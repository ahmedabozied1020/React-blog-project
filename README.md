# 📝 BlogApp – Full Stack Blog with Real-Time Chat

## 📌 Overview

**BlogApp** is a full-stack blog application built with modern technologies, offering both traditional blog features and real-time messaging capabilities. The system consists of:

- 🔧 A **React** frontend client
- 🌐 A **Node.js + Express** backend server
- 🗄️ A **MongoDB** database (via Mongoose)
- 💬 **Socket.IO** for real-time chat
- 📁 File uploads via **Multer**

---

## 🎯 Purpose and Scope

This document outlines the core architecture and technology stack behind the BlogApp. It describes how components interact across the frontend and backend, and how real-time messaging and file uploads are managed.

For full implementation details, refer to:
- **Frontend Architecture** – React client components and routing
- **Backend Architecture** – Express server and APIs
- **Deployment & Configuration** – Project setup and environment configs

---

## 🏗️ System Architecture Overview

BlogApp follows a **three-tier architecture**:

1. **Frontend** (React): User interface, routing, and authentication
2. **Backend** (Node.js/Express): API routing, database operations, real-time handling
3. **Database** (MongoDB): Stores users, posts, and messages

---

## 🔄 Application Flow Architecture

User requests flow through the system as follows:

- Frontend routes requests via `React Router` (`App.jsx`)
- Backend handles APIs and WebSocket events (`server.js`)
- Components such as `Home.jsx` and others dynamically update UI based on state and server responses

---

## 🧪 Core Technology Stack

| Technology       | Purpose                        | Key Files / Entry Points             |
|------------------|--------------------------------|--------------------------------------|
| **React 18**     | Frontend framework             | `App.jsx`, page components           |
| **Express.js**   | Backend web framework          | `server.js`, `app.use()` middleware  |
| **Socket.IO**    | Real-time communication        | `server.js:35-167`                   |
| **MongoDB + Mongoose** | Data persistence        | `Model files`, `server.js:176-189`   |
| **JWT**          | Auth system                    | `AuthContext`, `server.js:115-134`   |
| **Multer**       | File upload middleware         | `server.js:7-8`, `server.js:55`      |
| **React Router** | Client-side routing            | `App.jsx:3-9`, `BrowserRouter` setup |

---

## 🧩 Component Architecture

The React frontend uses a **hierarchical component structure** with centralized state management.

- `App.jsx`: Main layout and route logic
- `Footer.jsx`, `Header.jsx`, `Home.jsx`, etc.: Modular and reusable UI components

---

## 🌐 API Endpoints & Real-Time Features

The Express backend exposes REST APIs and Socket.IO events:

### 🔗 REST Endpoints
- `/api/v1/auth`: Register, login, token management
- `/api/v1/posts`: Create, update, delete, fetch blog posts
- `/api/v1/users`: User profile and settings
- `/api/v1/upload`: File uploads and image handling

### ⚡ WebSocket (Socket.IO)
- Real-time chat events: Connect, send message, receive message
- Live updates handled inside `server.js:114-167`

---

## 💾 Data Storage and File Management

| Data Type        | Storage           | Access Pattern                   | Operations                          |
|------------------|-------------------|----------------------------------|--------------------------------------|
| User Accounts     | MongoDB           | JWT-authenticated API calls      | Registration, login, profile         |
| Blog Posts        | MongoDB           | Public read / Authenticated write| CRUD via `/posts/*` endpoints        |
| Chat Messages     | MongoDB (optional)| Real-time via Socket.IO          | Live chat with optional persistence  |
| Upload Files      | `server/uploads/` | Static route: `/uploads/*`       | Handled by Multer middleware         |
| Static Assets     | `project/public/` | Browser-accessible               | Used for UI icons and images         |

> 📂 File uploads are handled via `Multer` (`server.js:7-8`) and served through Express static middleware (`server.js:55`).

---

## 📁 Relevant Source Files

- **Frontend**
  - `project/src/App.jsx` – Routing & main component logic
  - `project/src/pages/Home.jsx` – Blog homepage layout
  - `project/src/components/Footer.jsx` – Shared UI layout

- **Backend**
  - `server/server.js` – Express config, Socket.IO, middleware, routing

---

## ✅ Summary

**BlogApp** is a robust blogging platform with:

- Modern frontend/backend stack
- JWT-secured APIs
- Real-time messaging support
- Local file uploads with static hosting
- Clean and modular code structure

> 💬 For issues, suggestions, or contributions, feel free to open a pull request or issue.

---
