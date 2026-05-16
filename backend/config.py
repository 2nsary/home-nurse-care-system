"""
Configuration module for Home Nurse Care System.
Contains application settings including database URI, JWT secrets, and CORS config.
"""

import os
from datetime import timedelta

# Base directory of the backend
BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    """Base configuration class."""
    
    # SQLite database file path
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'homenurse.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = "home-nurse-care-super-secret-key-2026"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # CORS allowed origins (React dev server)
    CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
