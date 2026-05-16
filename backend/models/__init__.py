"""
Models package for Home Nurse Care System.
Exports all SQLAlchemy models and the shared db instance.
"""

from flask_sqlalchemy import SQLAlchemy

# Shared database instance — imported by all model files
db = SQLAlchemy()

from models.user import User
from models.patient import Patient
from models.nurse import Nurse
from models.booking import Booking
from models.payment import Payment
from models.review import Review

__all__ = ["db", "User", "Patient", "Nurse", "Booking", "Payment", "Review"]
