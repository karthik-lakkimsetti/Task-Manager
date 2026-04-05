// src/services/api.js
const BASE_URL = 'https://taskmanager-api-3wxg.onrender.com';
const getToken = () => localStorage.getItem('token');

// Helper to handle API responses cleanly
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API Error');
  }
  return response.json();
};

export const api = {
  // NEW: Registration endpoint
  register: async (email, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }), 
    });
    return handleResponse(response);
  },

  // Existing Login endpoint (OAuth2 format)
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: email, password: password }),
    });
    return handleResponse(response);
  },

  // Fetch all tasks for the logged-in user
  getTasks: async () => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return handleResponse(response);
  },

  // Create a new task
  createTask: async (taskName) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ task_name: taskName }),
    });
    return handleResponse(response);
  },

  // Mark a task as completed
  completeTask: async (taskId) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return handleResponse(response);
  },

  // Delete a task
  deleteTask: async (taskId) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return handleResponse(response);
  }
};