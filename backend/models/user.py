"""
User Model — Stores authentication and profile data for all roles.
Roles: 'patient', 'nurse', 'admin'
"""

from models import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(20), nullable=False, default="patient")  # patient | nurse | admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    patient = db.relationship("Patient", backref="user", uselist=False, cascade="all, delete-orphan")
    nurse = db.relationship("Nurse", backref="user", uselist=False, cascade="all, delete-orphan")

    def set_password(self, raw_password):
        """Hash and store the password."""
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        """Verify a raw password against the stored hash."""
        return check_password_hash(self.password, raw_password)

    def to_dict(self):
        """Serialize user to dictionary (excludes password)."""
        return {
            "user_id": self.user_id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
