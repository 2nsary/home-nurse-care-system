"""
Patient Model — Extended profile for users with 'patient' role.
"""

from models import db


class Patient(db.Model):
    __tablename__ = "patients"

    patient_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False, unique=True)
    address = db.Column(db.String(256), nullable=True)
    date_of_birth = db.Column(db.String(20), nullable=True)

    # Relationships
    bookings = db.relationship("Booking", backref="patient", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        """Serialize patient profile."""
        return {
            "patient_id": self.patient_id,
            "user_id": self.user_id,
            "address": self.address,
            "date_of_birth": self.date_of_birth,
            "full_name": self.user.full_name if self.user else None,
            "email": self.user.email if self.user else None,
            "phone": self.user.phone if self.user else None,
        }
