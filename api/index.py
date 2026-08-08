import os
import sys

# Ensure backend directory is in Python path for Vercel Serverless Function
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

# Import FastAPI application
from app.main import app
from app.database import init_db_seed

# Initialize SQLite tables on Vercel Serverless cold start
try:
    init_db_seed()
except Exception as e:
    print(f"[VERCEL COLD START] Database initialization warning: {e}")

# Vercel ASGI Handler Export
handler = app
