import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Load the secrets from the .env file we just made
load_dotenv()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        if connection.is_connected():
            print("SUCCESS: Connected to the task_manager database!")
            return connection
    except Error as e:
        print(f"CRITICAL ERROR: Could not connect to database. {e}")
        return None

# This automatically tests the connection when you run this file directly
if __name__ == "__main__":
    get_db_connection()