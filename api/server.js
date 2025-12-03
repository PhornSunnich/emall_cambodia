// server.js 
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Serve static images 
app.use('/emall_cambodia/public', express.static('emall_cambodia/public'));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many attempts, try again later." }
});
app.use("/api/auth", authLimiter);

// JWT Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { user_id: payload.user_id };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ==================== AUTH ====================
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  try {
    const hashed = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );
    res.status(201).json({ message: "User created", user_id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(400).json({ error: "Username or email already exists" });
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { user_id: user.user_id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// ==================== PRODUCTS ====================
app.get("/api/products", async (req, res) => {
  try {
    const { search = "", category = "", page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    let sql = `
      SELECT 
        p.product_id AS id, p.name, p.description, p.price, p.stock,
        p.image_url AS image, p.created_at AS createdAt,
        COALESCE(c.name, 'Uncategorized') AS category
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      WHERE 1=1
    `;
    const params = [];

    if (search.trim()) {
      sql += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }
    if (category && category !== "all") {
      sql += " AND c.name = ?";
      params.push(category);
    }

    sql += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    params.push(limitNum, offset);

    const [rows] = await pool.query(sql, params);
    const [[{ total = 0 }]] = await pool.query(
      `SELECT COUNT(*) as total FROM Products p 
       LEFT JOIN Categories c ON p.category_id = c.category_id WHERE 1=1` +
      (search.trim() ? " AND (p.name LIKE ? OR p.description LIKE ?)" : "") +
      (category && category !== "all" ? " AND c.name = ?" : ""),
      params.slice(0, -2)
    );

    res.json({
      products: rows.map(p => ({
        ...p,
        price: Number(p.price).toFixed(2),
        stock: p.stock || 0
      })),
      pagination: { current: pageNum, pages: Math.ceil(total / limitNum), total, limit: limitNum }
    });
  } catch (err) {
    console.error("Products error:", err);
    res.json({ products: [], pagination: { current: 1, pages: 0, total: 0, limit: 12 } });
  }
});

// 1. បន្ថែម static folder នេះឱ្យត្រឹមត្រូវ (ដាក់ខាងលើ app.listen())
app.use("/brands", express.static(path.join(__dirname, "public", "brands")));

// 2. កែ route ឱ្យសាមញ្ញបំផុត (copy-paste នេះទាំងអស់)
app.get("/api/brands", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT brand_id AS id, name, logo FROM brands ORDER BY name");
    
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const brands = rows.map(b => ({
      id: b.id,
      name: b.name,
      logo: b.logo ? `${baseUrl}/brands/${b.logo}` : null
    }));

    res.json({ brands });
  } catch (err) {
    console.error(err);
    res.status(500).json({ brands: [] });
  }
});


// ==================== PRODUCT DETAIL ====================
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
         p.product_id AS id,
         p.name,
         p.description,
         p.price,
         p.stock,
         p.image_url AS image,
         p.created_at AS createdAt,
         COALESCE(c.name, 'Uncategorized') AS category
       FROM Products p
       LEFT JOIN Categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = rows[0];
    product.price = Number(product.price).toFixed(2);

    // Build full image URL if image exists
    if (product.image) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      product.image = `${baseUrl}/emall_cambodia/public/products/${product.image}`;
    }

    res.json(product);
  } catch (err) {
    console.error("Product detail error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// ==================== STORES ====================
app.get("/api/stores", async (req, res) => {
  try {
    const { search = "", category = "", page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    let sql = `
      SELECT 
        s.store_id AS id,
        s.name,
        s.description,
        s.logo,
        s.cover_image,
        s.rating,
        s.total_sales,
        s.created_at AS createdAt,
        c.name AS category
      FROM stores s
      LEFT JOIN categories c ON s.category_id = c.category_id
      WHERE 1=1
    `;
    const params = [];

    if (search.trim()) {
      sql += " AND (s.name LIKE ? OR s.description LIKE ?)";
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }
    if (category && category !== "all") {
      sql += " AND c.name = ?";
      params.push(category);
    }

    const countSql = sql.replace(/SELECT[\s\S]*?FROM/, "SELECT COUNT(*) as total FROM");
    const [[{ total = 0 }]] = await pool.query(countSql.split("WHERE 1=1")[0] + " WHERE 1=1" + sql.split("WHERE 1=1")[1].split("LIMIT")[0], params);

    sql += " ORDER BY s.total_sales DESC, s.rating DESC LIMIT ? OFFSET ?";
    params.push(limitNum, offset);

    const [rows] = await pool.query(sql, params);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const stores = rows.map(store => ({
      ...store,
      logo: store.logo ? `${baseUrl}/emall_cambodia/public/stores/${store.logo}` : null,
      cover_image: store.cover_image ? `${baseUrl}/emall_cambodia/public/stores/${store.cover_image}` : null,
      rating: Number(store.rating || 0).toFixed(1),
      total_sales: Number(store.total_sales || 0)
    }));

    res.json({
      stores,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (err) {
    console.error("Stores API error:", err);
    res.status(500).json({ stores: [], pagination: { current: 1, pages: 0, total: 0 } });
  }
});

// ==================== REAL ESTATE ====================
app.get("/api/real-estate", async (req, res) => {
  try {
    const { search = "", type = "" } = req.query;
    let sql = "SELECT * FROM real_estate WHERE 1=1";
    const params = [];

    if (search.trim()) {
      sql += " AND (title LIKE ? OR location LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (type && type !== "all") {
      sql += " AND type = ?";
      params.push(type);
    }

    sql += " ORDER BY featured DESC, created_at DESC";
    const [rows] = await pool.query(sql, params);

    res.json({
      properties: rows.map(p => ({
        ...p,
        price: Number(p.price).toFixed(2),
        image: p.image_url || "https://via.placeholder.com/400x300/198754/white?text=No+Image"
      }))
    });
  } catch (err) {
    console.error("Real estate error:", err);
    res.json({ properties: [] });
  }
});

// Health Check
app.get("/", (req, res) => {
  res.json({
    ok: true,
    api: "EMALL Cambodia API",
    time: new Date().toLocaleString('km-KH'),
    message: "ដំណើរការល្អ 100%!"
  });
});

app.get("/products", (req, res) => {
  res.redirect(301, `/api/products?${new URLSearchParams(req.query).toString()}`);
});

// Allow old frontend URL to work
app.get("/stores", (req, res) => {
  res.redirect(301, `/api/stores?${new URLSearchParams(req.query).toString()}`);
});
 
app.use("/brands", express.static(path.join(__dirname, "public", "brands")));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nEMALL Cambodia API ដំណើរការល្អ 100%`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Brands   → http://localhost:${PORT}/api/brands`);
  console.log(`Stores   → http://localhost:${PORT}/api/stores`);
  console.log(`Real Estate → http://localhost:${PORT}/api/real-estate`);
  console.log(`Products → http://localhost:${PORT}/api/products\n`);
});