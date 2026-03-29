from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import database  # This brings in your successful connection script

app = FastAPI()

# SECURITY: This allows your future React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SCHEMA: This tells Python exactly what the incoming data looks like
class TaskCreate(BaseModel):
    task_name: str

# ROUTE 1: Fetch all tasks from the database
@app.get("/tasks")
def get_all_tasks():
    conn = database.get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM todo_list ORDER BY id DESC;")
    tasks = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return tasks

# ROUTE 2: Add a new task to the database
@app.post("/tasks")
def create_new_task(task: TaskCreate):
    conn = database.get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    cursor = conn.cursor()
    # Safely insert the task to prevent SQL injection
    cursor.execute(
        "INSERT INTO todo_list (task_name) VALUES (%s)",
        (task.task_name,)
    )
    conn.commit()  # This officially saves it to MySQL!
    
    cursor.close()
    conn.close()
    return {"message": f"Successfully added '{task.task_name}' to your database!"}
    
    # ROUTE 3: Mark a task as complete (Update)
@app.put("/tasks/{task_id}")
def complete_task(task_id: int):
    conn = database.get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE todo_list SET is_completed = TRUE WHERE id = %s", 
        (task_id,)
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    return {"message": f"Task {task_id} marked as complete!"}

# ROUTE 4: Delete a task (Delete)
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    conn = database.get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM todo_list WHERE id = %s", 
        (task_id,)
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    return {"message": f"Task {task_id} successfully deleted!"}