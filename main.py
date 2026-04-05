from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import database

# Initialize the App with professional documentation tags
app = FastAPI(
    title="Professional Task Manager API", 
    description="A secure REST API with JWT Authentication built with FastAPI and MySQL.",
    version="1.0.0"
)

# --- SECURITY & JWT CONFIGURATION ---
SECRET_KEY = "karthik_super_secret_key_2026" # In a real app, this goes in your .env file!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# This specific line creates the "Authorize" padlock button in your Swagger UI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# CORS Middleware for React/Frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA SCHEMAS (Pydantic) ---
class UserCreate(BaseModel):
    email: str
    password: str

class TaskCreate(BaseModel):
    task_name: str
    # Notice: user_id is gone! The API now gets it securely from the JWT token.

# --- SECURITY HELPER FUNCTIONS ---
def create_access_token(data: dict):
    """Generates the encrypted JWT Digital ID Card."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    """Decrypts the token to find out exactly who is making the request."""
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return int(user_id)
    except JWTError:
        raise credentials_exception

# --- AUTHENTICATION ROUTES ---

@app.post("/register", tags=["Authentication"])
def register_user(user: UserCreate):
    """Registers a new user and hashes their password securely."""
    conn = database.get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()
    hashed_password = pwd_context.hash(user.password)
    
    try:
        cursor.execute(
            "INSERT INTO users (email, hashed_password) VALUES (%s, %s)",
            (user.email, hashed_password)
        )
        conn.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        cursor.close()
        conn.close()
        
    return {"message": f"User {user.email} registered successfully!"}

@app.post("/login", tags=["Authentication"])
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Logs the user in and hands them a JWT Token.
    Note: OAuth2PasswordRequestForm uses 'username' instead of 'email' by default.
    """
    conn = database.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # form_data.username will contain the user's email
    cursor.execute("SELECT * FROM users WHERE email = %s", (form_data.username,))
    db_user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not db_user or not pwd_context.verify(form_data.password, db_user['hashed_password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create the token storing the user's ID
    access_token = create_access_token(data={"sub": str(db_user['id'])})
    
    return {"access_token": access_token, "token_type": "bearer"}

# --- TASK ROUTES (SECURED) ---

@app.get("/tasks", tags=["Tasks"])
def get_my_tasks(current_user_id: int = Depends(get_current_user_id)):
    """Fetches tasks belonging ONLY to the currently logged-in user."""
    conn = database.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute(
        "SELECT * FROM todo_list WHERE user_id = %s ORDER BY id DESC;",
        (current_user_id,)
    )
    tasks = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return tasks

@app.post("/tasks", tags=["Tasks"])
def create_new_task(task: TaskCreate, current_user_id: int = Depends(get_current_user_id)):
    """Creates a new task linked automatically to the logged-in user."""
    conn = database.get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO todo_list (task_name, user_id) VALUES (%s, %s)",
            (task.task_name, current_user_id)
        )
        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to add task: {str(e)}")
    finally:
        cursor.close()
        conn.close()
        
    return {"message": f"Successfully added '{task.task_name}'!"}

@app.put("/tasks/{task_id}", tags=["Tasks"])
def complete_task(task_id: int, current_user_id: int = Depends(get_current_user_id)):
    """Marks a task as complete, but only if it belongs to the logged-in user."""
    conn = database.get_db_connection()
    cursor = conn.cursor()
    # Security check: Ensure the task belongs to current_user_id before updating
    cursor.execute(
        "UPDATE todo_list SET is_completed = TRUE WHERE id = %s AND user_id = %s", 
        (task_id, current_user_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Task marked as complete!"}

@app.delete("/tasks/{task_id}", tags=["Tasks"])
def delete_task(task_id: int, current_user_id: int = Depends(get_current_user_id)):
    """Deletes a task, but only if it belongs to the logged-in user."""
    conn = database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM todo_list WHERE id = %s AND user_id = %s", 
        (task_id, current_user_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Task deleted!"}