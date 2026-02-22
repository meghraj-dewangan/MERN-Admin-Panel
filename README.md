# 🚀 MERN Multi-Role Admin Panel

A secure and scalable **Multi-Role Admin System** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.  
This project demonstrates secure authentication, Google OAuth integration, Role-Based Access Control (RBAC), and a structured backend architecture.

---

# 📌 Features Overview

- 🔐 Secure JWT Authentication (with expiry)
- 🔑 Google OAuth 2.0 Login Integration
- 👥 Role-Based Access Control (RBAC)
- 🛡 Protected Backend Routes
- 🔄 Auth Persistence after Refresh
- 🚪 Automatic Logout on 401 (Token Expiry)
- 📁 Project Request Workflow System
- 🧱 Clean & Scalable Backend Architecture

---

# 🔐 Authentication

- User Registration & Login
- Password Hashing using bcrypt
- JWT-based authentication
- Token expiry handling
- Google Login using OAuth 2.0
- Persistent login session
- Centralized error handling

---

# 👥 Roles & Access Control (RBAC)

## 🟢 SuperAdmin
- Full system access
- Create users
- Change user roles
- Activate / Deactivate users
- View all project requests

## 🔵 Manager
- Create project requests
- View only their own requests
- Assign requests to Staff

## 🟡 Staff
- View only assigned requests
- Update request status:
  - pending
  - approved
  - rejected

> ✅ All permissions are strictly enforced on the backend.

---

# 📁 Project Request Module

## Request Schema Fields

- title
- description
- createdBy (User Reference)
- assignedTo (User Reference)
- status
- timestamps

---

# 🛠 Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)
- Google OAuth (google-auth-library)
- Role-based Middleware
- Centralized Error Handling

## Frontend
- React.js
- Context API
- Role-based UI Rendering
- Auth Persistence Logic
- Axios Interceptors (401 Auto Logout)

---

# 🎯 Key Highlights

## 🔐 Security
- Secure JWT Authentication with expiry
- Password hashing using bcrypt
- Protected backend routes
- Automatic logout on expired token

## 👥 Role Management
- SuperAdmin control panel
- Manager-level request handling
- Staff-level restricted access
- Backend enforced role validation


## 🏗 Architecture
- Modular backend structure
- Scalable design
- Clean separation of concerns
- Production-ready code structure

---
