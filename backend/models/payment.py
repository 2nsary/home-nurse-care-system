"""
Payment Model — Tracks payment for a booking.
"""

from models import db
from datetime import datetime


class Payment(db.Model):
    __tablename__ = "payments"

    payment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id = db.Column(db.Integer, db.ForeignKey("bookings.booking_id"), nullable=False, unique=True)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), default="credit_card")  # credit_card | cash | insurance
    payment_status = db.Column(db.String(20), default="pending")  # pending | completed | refunded
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Serialize payment."""
        return {
            "payment_id": self.payment_id,
            "booking_id": self.booking_id,
            "amount": self.amount,
            "payment_method": self.payment_method,
            "payment_status": self.payment_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
