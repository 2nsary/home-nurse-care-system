"""
Booking Model — Represents a patient booking a nurse for home care.
Status flow: pending → accepted → completed  OR  pending → rejected  OR  pending/accepted → cancelled
"""

from models import db
from datetime import datetime


class Booking(db.Model):
    __tablename__ = "bookings"

    booking_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.patient_id"), nullable=False)
    nurse_id = db.Column(db.Integer, db.ForeignKey("nurses.nurse_id"), nullable=False)
    booking_date = db.Column(db.String(20), nullable=False)  # YYYY-MM-DD
    booking_time = db.Column(db.String(10), nullable=False)  # HH:MM
    duration_hours = db.Column(db.Integer, default=1)
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default="pending")  # pending | accepted | rejected | completed | cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    payment = db.relationship("Payment", backref="booking", uselist=False, cascade="all, delete-orphan")
    review = db.relationship("Review", backref="booking", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        """Serialize booking with related data."""
        return {
            "booking_id": self.booking_id,
            "patient_id": self.patient_id,
            "nurse_id": self.nurse_id,
            "booking_date": self.booking_date,
            "booking_time": self.booking_time,
            "duration_hours": self.duration_hours,
            "notes": self.notes,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "patient_name": self.patient.user.full_name if self.patient and self.patient.user else None,
            "nurse_name": self.nurse.user.full_name if self.nurse and self.nurse.user else None,
            "nurse_specialization": self.nurse.specialization if self.nurse else None,
            "hourly_rate": self.nurse.hourly_rate if self.nurse else None,
            "payment": self.payment.to_dict() if self.payment else None,
            "review": self.review.to_dict() if self.review else None,
        }
