// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { logout, userEmail } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State to track which card is currently clicked
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', or 'pending'

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    try {
      await api.createTask(newTaskName);
      setNewTaskName(''); 
      loadTasks(); 
      setActiveFilter('pending'); // Auto-switch to pending so they see their new task
    } catch (error) { console.error(error); }
  };

  const handleComplete = async (taskId) => {
    try { await api.completeTask(taskId); loadTasks(); } 
    catch (error) { console.error(error); }
  };

  const handleDelete = async (taskId) => {
    try { await api.deleteTask(taskId); loadTasks(); } 
    catch (error) { console.error(error); }
  };

  // --- Derived State for the Cards ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Derived State for the List (What actually gets shown below)
  const displayedTasks = tasks.filter(task => {
    if (activeFilter === 'completed') return task.is_completed;
    if (activeFilter === 'pending') return !task.is_completed;
    return true; // 'all'
  });

  // Format the user's name for the UI
  const username = userEmail ? userEmail.split('@')[0] : 'Karthik';
  const initial = username.charAt(0).toUpperCase();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F7]">
      <div className="w-10 h-10 border-[3px] border-gray-300 border-t-[#0071E3] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-24 selection:bg-[#0071E3] selection:text-white">
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-[1024px] mx-auto px-4 h-14 flex justify-between items-center text-[12px] font-medium tracking-wide">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1D1D1F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span className="text-gray-800">TaskManager Pro</span>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] text-[#86868B] hidden sm:block">
                {username}
              </span>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0071E3] to-[#409CFF] text-white flex items-center justify-center font-semibold text-[13px] shadow-[0_2px_8px_rgba(0,113,227,0.3)]">
                {initial}
              </div>
            </div>
            
            <div className="w-[1px] h-4 bg-gray-200"></div> {/* Vertical divider line */}
            
            <button onClick={logout} className="text-[#0071E3] hover:text-[#0077ED] transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1024px] mx-auto px-4 sm:px-6 pt-16">
        
       {/* Header */}
        <div className="mb-14">
          <h1 className="text-[40px] sm:text-[48px] font-semibold tracking-tight text-[#1D1D1F] leading-tight">
            Overview. <br className="hidden sm:block"/>
            <span className="text-[#86868B]">Track your daily progress.</span>
          </h1>
        </div>
        
        {/* INTERACTIVE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1: Total */}
          <div 
            onClick={() => setActiveFilter('all')}
            className={`cursor-pointer p-8 rounded-[24px] transition-all duration-300 transform ${
              activeFilter === 'all' 
                ? 'bg-white border-2 border-[#0071E3] shadow-[0_8px_24px_rgba(0,113,227,0.15)] scale-[1.02]' 
                : 'bg-white border-2 border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1'
            }`}
          >
            <h3 className="text-[14px] font-semibold text-[#86868B] tracking-wide mb-2 uppercase">Total Tasks</h3>
            <p className="text-[48px] font-semibold tracking-tighter text-[#1D1D1F] leading-none mb-1">{totalTasks}</p>
            <p className="text-[15px] font-medium text-[#1D1D1F]">Currently in system.</p>
          </div>

          {/* Card 2: Completed */}
          <div 
            onClick={() => setActiveFilter('completed')}
            className={`cursor-pointer p-8 rounded-[24px] transition-all duration-300 transform ${
              activeFilter === 'completed' 
                ? 'bg-white border-2 border-emerald-500 shadow-[0_8px_24px_rgba(16,185,129,0.15)] scale-[1.02]' 
                : 'bg-white border-2 border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1'
            }`}
          >
            <h3 className="text-[14px] font-semibold text-emerald-500 tracking-wide mb-2 uppercase">Completed</h3>
            <p className="text-[48px] font-semibold tracking-tighter text-[#1D1D1F] leading-none mb-1">{completedTasks}</p>
            <p className="text-[15px] font-medium text-[#1D1D1F]">Tasks finalized.</p>
          </div>

          {/* Card 3: Pending */}
          <div 
            onClick={() => setActiveFilter('pending')}
            className={`cursor-pointer p-8 rounded-[24px] transition-all duration-300 transform ${
              activeFilter === 'pending' 
                ? 'bg-white border-2 border-[#F56300] shadow-[0_8px_24px_rgba(245,99,0,0.15)] scale-[1.02]' 
                : 'bg-white border-2 border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1'
            }`}
          >
            <h3 className="text-[14px] font-semibold text-[#F56300] tracking-wide mb-2 uppercase">Pending</h3>
            <p className="text-[48px] font-semibold tracking-tighter text-[#1D1D1F] leading-none mb-1">{pendingTasks}</p>
            <p className="text-[15px] font-medium text-[#1D1D1F]">Awaiting action.</p>
          </div>

        </div>

        {/* Input Section */}
        <div className="mb-12 max-w-2xl">
          <form onSubmit={handleAddTask} className="flex gap-3">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter a new task..."
              className="flex-1 px-5 py-4 bg-white border border-gray-200 rounded-[18px] outline-none text-[17px] text-[#1D1D1F] placeholder:text-[#86868B] shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:ring-[3px] focus:ring-[#0071E3]/30 transition-all"
            />
            <button 
              type="submit"
              disabled={!newTaskName.trim()}
              className="px-8 py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-[17px] rounded-[18px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Add
            </button>
          </form>
        </div>

        {/* The Filtered List */}
        <div className="bg-white rounded-[24px] p-2 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          
          {/* Dynamic Header based on filter */}
          <div className="flex justify-between items-center px-4 pt-4 pb-2">
            <h2 className="text-[24px] font-semibold text-[#1D1D1F] capitalize">
              {activeFilter === 'all' ? 'Your Items' : `${activeFilter} Items`}
            </h2>
            <span className="text-[#86868B] font-medium bg-[#F5F5F7] px-3 py-1 rounded-full text-sm">
              {displayedTasks.length}
            </span>
          </div>
          
          {displayedTasks.length === 0 ? (
            <div className="py-16 text-center text-[#86868B] text-[17px]">
              {activeFilter === 'all' && "Your list is empty."}
              {activeFilter === 'completed' && "No tasks completed yet."}
              {activeFilter === 'pending' && "You're all caught up! No pending tasks."}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Map over displayedTasks instead of tasks! */}
              {displayedTasks.map((task) => (
                <div key={task.id} className="group flex items-center justify-between p-4 hover:bg-[#F5F5F7] rounded-[14px] transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleComplete(task.id)}
                      className={`w-7 h-7 rounded-full border-[2px] flex items-center justify-center transition-all ${
                        task.is_completed 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-[#86868B] hover:border-[#0071E3]'
                      }`}
                    >
                      {task.is_completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    
                    <span className={`text-[17px] font-medium ${task.is_completed ? 'text-[#86868B] line-through decoration-gray-300' : 'text-[#1D1D1F]'}`}>
                      {task.task_name}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 px-4 py-2 text-[14px] font-medium text-white bg-[#E30000] hover:bg-[#FF3B30] rounded-full transition-all duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}