import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  // 1. READ: Get all tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Critical error fetching tasks:", error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // 2. CREATE: Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask) return

    try {
      await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_name: newTask }),
      })
      setNewTask('')
      fetchTasks()
    } catch (error) {
      console.error("Critical error adding task:", error)
    }
  }

  // 3. UPDATE: Mark task as complete
  const handleToggleComplete = async (id) => {
    try {
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: 'PUT',
      })
      fetchTasks() // Refresh the list instantly
    } catch (error) {
      console.error("Critical error updating task:", error)
    }
  }

  // 4. DELETE: Remove task permanently
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: 'DELETE',
      })
      fetchTasks() // Refresh the list instantly
    } catch (error) {
      console.error("Critical error deleting task:", error)
    }
  }

  return (
    <div style={{ padding: '3rem', fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>Task Manager Pro</h1>
      
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs to be done?"
          style={{ flex: 1, padding: '0.8rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Task
        </button>
      </form>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li 
            key={task.id} 
            style={{ 
              padding: '1rem', 
              backgroundColor: '#f9f9f9', 
              borderBottom: '1px solid #eee', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '4px', 
              marginBottom: '8px' 
            }}
          >
            {/* If completed, cross out the text */}
            <span 
              style={{ 
                fontSize: '1.1rem', 
                textDecoration: task.is_completed ? 'line-through' : 'none',
                color: task.is_completed ? '#888' : '#000'
              }}
            >
              {task.task_name}
            </span>
            
            {/* The Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {!task.is_completed && (
                <button 
                  onClick={() => handleToggleComplete(task.id)}
                  style={{ padding: '0.4rem 0.8rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  ✓ Done
                </button>
              )}
              
              <button 
                onClick={() => handleDelete(task.id)}
                style={{ padding: '0.4rem 0.8rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App