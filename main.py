from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import database  # Uses your successful MySQL connection script

# --- INITIALIZE APP ---
app = FastAPI(
    title="Professional Task Manager API", 
    description="A secure REST API with JWT Authentication built with FastAPI and MySQL.",
    version="1.0.0"
)

# --- SECURITY & JWT CONFIG ---
SECRET_KEY = "karthik_super_secret_key_2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# --- CORS MIDDLEWARE ---
# Allows your React local server (5173) to talk to this API (8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA SCHEMAS ---
class UserCreate(BaseModel):
    email: str
    password: str

class TaskCreate(BaseModel):
    task_name: str

# --- SECURITY HELPERS ---
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
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
    conn = database.get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    hashed_password = pwd_context.hash(user.password)
    try:
        cursor.execute("INSERT INTO users (email, hashed_password) VALUES (%s, %s)", (user.email, hashed_password))
        conn.commit()
        return {"message": "User registered successfully!"}
    except:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        cursor.close()
        conn.close()

@app.post("/login", tags=["Authentication"])
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = database.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (form_data.username,))
    db_user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not db_user or not pwd_context.verify(form_data.password, db_user['hashed_password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(db_user['id'])})
    return {"access_token": access_token, "token_type": "bearer"}

# --- TASK ROUTES (SECURED) ---

@app.get("/tasks", tags=["Tasks"])
def get_my_tasks(current_user_id: int = Depends(get_current_user_id)):
    conn = database.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM todo_list WHERE user_id = %s ORDER BY id DESC", (current_user_id,))
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return tasks

@app.post("/tasks", tags=["Tasks"])
def create_new_task(task: TaskCreate, current_user_id: int = Depends(get_current_user_id)):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO todo_list (task_name, user_id) VALUES (%s, %s)", (task.task_name, current_user_id))
        conn.commit()
        return {"message": "Task added!"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.put("/tasks/{task_id}", tags=["Tasks"])
def complete_task(task_id: int, current_user_id: int = Depends(get_current_user_id)):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE todo_list SET is_completed = TRUE WHERE id = %s AND user_id = %s", (task_id, current_user_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Task completed!"}

@app.delete("/tasks/{task_id}", tags=["Tasks"])
def delete_task(task_id: int, current_user_id: int = Depends(get_current_user_id)):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM todo_list WHERE id = %s AND user_id = %s", (task_id, current_user_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Task deleted!"}