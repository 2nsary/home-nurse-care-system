"""
Review Model — Patient rating and comment for a completed booking.
"""

from models import db
from datetime import datetime


class Review(db.Model):
    __tablename__ = "reviews"

    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id = db.Column(db.Integer, db.ForeignKey("bookings.booking_id"), nullable=False, unique=True)
    rating = db.Column(db.Integer, nullable=False)  # 1 to 5
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Serialize review."""
        return {
            "review_id": self.review_id,
            "booking_id": self.booking_id,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
