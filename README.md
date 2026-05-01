# 🏢 Building Management Frontend

A modern, scalable **Angular (Standalone)** application for managing residential buildings, built with enterprise-grade architecture and clean UI.

---

## 🚀 Overview

The **Building Management Platform** enables tenants and managers to interact within residential buildings through a secure and intuitive interface.

### Modern Angular approach:

- Standalone Components (no NgModules)
- Lazy Loading (`loadComponent`)
- Feature-based architecture
- Clean separation of concerns
- Scalable structure

---

## 🧠 Core Concept

```text
User (Account)
      ↓
Join Building (via invitation code)
      ↓
Access building features
```

A user can exist without being part of any building.

---

## ✨ Features

### 👤 Tenant Experience

- Authentication (Login / Register)
- Join building via invitation code
- Dashboard with conditional access
- Building Information
- Announcements
- Resident Chat (UI ready)
- Help & Share
- User Settings

---

## 🔒 Privacy

- Only nickname + (optional photo) are visible
- Email and phone are hidden

---

## 🎨 UI / UX

- Angular Material
- Sidebar layout
- Responsive design
- Clean interface

---

## 🧱 Tech Stack

- Angular (Standalone)
- TypeScript
- SCSS
- RxJS
- Angular Router
- Angular Material

---

## 📂 Project Structure

```bash
src/app/
├── core/
├── auth/
├── layout/
├── features/
│   └── tenant/
├── shared/
└── app.routes.ts
```

---

## ⚙️ Installation

```bash
npm install
```

---

## ▶️ Run

```bash
ng serve
```

Open:

```
http://localhost:4200
```

---

## 📌 Flow

```text
Register → Login → Dashboard (locked)
→ Enter Building Code → Unlock Features
```

---

## 🚀 Roadmap

### Next
- JWT authentication
- API integration
- Role guards

### Future
- Real-time chat
- Notifications
- File uploads

---

## 👨‍💻 Author

**Ibrahim**  
Software Engineer | Java & Angular  

---

## ⭐ Highlights

- Modern Angular architecture
- Clean structure
- Scalable design
