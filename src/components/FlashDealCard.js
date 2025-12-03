import { Card } from 'react-bootstrap';

export default function FlashDealCard({ deal }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{deal.name}</Card.Title>
        <Card.Text>
          <strong>Discount:</strong> {deal.discount}%<br />
          <strong>Until:</strong> {new Date(deal.end_time).toLocaleString()}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}