import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    # Render provides this automatically in Environment Variables
    db_url = os.getenv("DATABASE_URL")
    try:
        # Use sslmode=require for secure cloud database connections
        conn = psycopg2.connect(db_url)
        return conn
    except Exception as e:
        print(f"Database Connection Error: {e}")
        return None