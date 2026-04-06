# 📝 Full-Stack Task Management System

A professional, high-performance task management application built with a **decoupled architecture**. This project demonstrates proficiency in **RESTful API development**, **JWT Authentication**, and **Relational Database Management**.

---

## 🏗️ System Architecture & Structure

The application follows a **Three-Tier Architecture**, ensuring scalability and separation of concerns:

### 1. Presentation Tier (Frontend)
* **Framework**: React (Vite)
* **Architecture**: Component-based UI with one-way data flow.
* **State Management**: React Hooks (`useState`, `useEffect`) for real-time UI updates.
* **API Integration**: Asynchronous service layer using the Fetch API.

### 2. Logic Tier (Backend)
* **Framework**: FastAPI (Python)
* **Security**: **JWT (JSON Web Tokens)** for stateless authentication and **Bcrypt** for password hashing.
* **Middleware**: Custom **CORS** configuration to allow secure cross-origin communication.
* **Documentation**: Automatic interactive documentation via **Swagger UI** (/docs).

### 3. Data Tier (Database)
* **Database**: MySQL
* **Schema**: Relational design with **One-to-Many relationships** (One User -> Many Tasks) using Foreign Keys.

---

## 🚀 Technical Features

* **🛡️ Secure Authentication**: Implemented OAuth2 with Password Flow and JWT.
* **⚡ Real-time CRUD**: Full Create, Read, Update, and Delete capabilities without page refreshes.
* **📱 Responsive Design**: Modern minimalist UI that adapts to different screen sizes.
* **🔗 API Decoupling**: Frontend and Backend are hosted independently, communicating via a RESTful contract.

---

## ⚙️ Local Setup Guide

### Prerequisites
* Python 3.9+
* Node.js & npm
* MySQL

### 1. Backend Setup
```bash
# From the root directory
pip install -r requirements.txt
uvicorn main:app --reload
Access API Docs at: http://127.0.0.1:8000/docs2. Frontend SetupBash# Navigate to frontend directory
cd frontend
npm install
npm run dev
Access App at: http://localhost:5173🛡️ API Endpoints (Quick Reference)MethodEndpointDescriptionAuth RequiredPOST/registerRegister a new userNoPOST/loginGet JWT Access TokenNoGET/tasksGet all user tasksYesPOST/tasksCreate a new taskYesPUT/tasks/{id}Mark task as completeYesDELETE/tasks/{id}Delete a taskYes👤 AuthorKarthik B.Tech in Computer Science Engineering (2025 Graduate) Specialization: Full-Stack Development & Data Analysis

---

## 📸 Project Showcase

| Registration Page | User Dashboard | API Documentation (Swagger) |
| :--- | :--- | :--- |
| ![Signup Screen](./screenshots/signup.png) | ![Task List](./screenshots/dashboard.png) | ![Swagger UI](./screenshots/swagger.png) |

---