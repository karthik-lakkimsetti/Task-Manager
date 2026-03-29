import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

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

  const handleToggleComplete = async (id) => {
    try {
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: 'PUT',
      })
      fetchTasks()
    } catch (error) {
      console.error("Critical error updating task:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: 'DELETE',
      })
      fetchTasks()
    } catch (error) {
      console.error("Critical error deleting task:", error)
    }
  }

  // Quick calculations for the new dashboard stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shadow-2xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <h2 className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
            <span className="text-blue-500">⚡</span> PRO TASK
          </h2>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg font-medium border border-blue-600/20 flex items-center gap-3 cursor-pointer transition-colors">
            <span className="text-lg">📋</span> My Workspace
          </div>
          <div className="px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors flex items-center gap-3 cursor-pointer">
            <span className="text-lg">📈</span> Analytics
          </div>
          <div className="px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors flex items-center gap-3 cursor-pointer">
            <span className="text-lg">⚙️</span> Settings
          </div>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              K
            </div>
            <div>
              <div className="text-sm font-bold text-white">Karthik</div>
              <div className="text-xs text-slate-400">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </button>
          </div>
        </header>

        {/* SCROLLABLE WORKSPACE */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Dashboard Widgets (Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</p>
                  <p className="text-4xl font-black text-slate-800 mt-1">{totalTasks}</p>
                </div>
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl shadow-inner">📊</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
                  <p className="text-4xl font-black text-emerald-600 mt-1">{completedTasks}</p>
                </div>
                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-3xl shadow-inner">✅</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
                  <p className="text-4xl font-black text-amber-500 mt-1">{pendingTasks}</p>
                </div>
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-3xl shadow-inner">⏳</div>
              </div>
            </div>

            {/* Main Action Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              
              {/* Input Form Area */}
              <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1 px-6 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 font-medium shadow-sm text-lg"
                  />
                  <button 
                    type="submit" 
                    className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    + Add Task
                  </button>
                </form>
              </div>

              {/* Task List Area */}
              <div className="p-0">
                {tasks.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="text-6xl mb-4">✨</div>
                    <h3 className="text-xl font-bold text-slate-700">You're all caught up!</h3>
                    <p className="text-slate-500 mt-2">Add a new task above to get started.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                      <li 
                        key={task.id} 
                        className={`group flex items-center justify-between p-6 transition-all duration-200 hover:bg-slate-50 ${
                          task.is_completed ? 'bg-slate-50/50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-3 h-3 rounded-full ${task.is_completed ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'}`}></div>
                          <span 
                            className={`text-xl font-medium transition-colors duration-200 ${
                              task.is_completed ? 'text-slate-400 line-through' : 'text-slate-700'
                            }`}
                          >
                            {task.task_name}
                          </span>
                        </div>
                        
                        {/* Buttons now only appear on hover to keep the UI perfectly clean */}
                        <div className="flex gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                          {!task.is_completed && (
                            <button 
                              onClick={() => handleToggleComplete(task.id)}
                              className="px-5 py-2.5 bg-emerald-100 text-emerald-700 font-bold rounded-lg hover:bg-emerald-200 hover:text-emerald-800 transition-colors shadow-sm"
                            >
                              ✓ Mark Done
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(task.id)}
                            className="px-5 py-2.5 bg-rose-100 text-rose-700 font-bold rounded-lg hover:bg-rose-200 hover:text-rose-800 transition-colors shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App