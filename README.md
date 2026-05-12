# 🏢 Building Management Frontend

A modern, scalable **Angular (Standalone)** application for managing residential buildings, built with enterprise-grade architecture, clean UI, and real-world SaaS design patterns.

---

## 🚀 Overview

The **Building Management Platform** provides a complete solution for managing residential buildings, enabling tenants and managers to interact through a secure and intuitive interface.

The application is built using modern Angular best practices, ensuring high performance, maintainability, and scalability.

---

## 🧠 Core Concept

The platform separates **user identity** from **building membership**, allowing flexibility in how users interact with different buildings.

```text
User Account
      ↓
Join Building (via invitation code)
      ↓
Access Building Features
```

A user can exist independently and join or leave buildings without affecting their account.

---

## ✨ Features

### 👤 Tenant Experience

- Secure authentication (Login / Register)
- Join a building using a unique invitation code
- Dynamic dashboard with contextual access
- View building information
- Access announcements
- Participate in resident chat
- Use help & share features
- Manage personal settings (profile, password, preferences)

---

### 🧑‍💼 Manager & Admin Architecture

The system is designed to support multiple roles:

- Tenant
- Manager
- Administrator

The frontend structure and routing are built to scale for:

- Manager dashboards (building management, invitations, announcements)
- Admin dashboards (system-wide control)

---

## 🧭 System Roles

- **Tenant**: interacts with building features  
- **Manager**: manages buildings, residents, and announcements  
- **Admin**: oversees the entire system  

---

## 🔒 Privacy

- Only **Display Name** and **optional profile photo** are visible to other residents  
- Email and phone number remain private  

---

## 🎨 UI / UX

- Built with Angular Material  
- Clean and modern dashboard layout  
- Sidebar navigation  
- Responsive design  

---

## 🧱 Tech Stack

- Angular (Standalone Architecture)  
- TypeScript  
- SCSS  
- RxJS  
- Angular Router (lazy loading)  
- Angular Material  

---

## 🏗️ Architecture

- Feature-based structure  
- Separation of concerns  
- Lazy-loaded standalone components  
- Scalable for microservices backend  

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

## ▶️ Run the Application

```bash
ng serve
```

Open:

http://localhost:4200

---

## 📌 Application Flow

```text
Register → Login → Dashboard
→ Enter Building Code → Access Full Features
```

---

## 🔗 Backend Integration

Designed to integrate with:

- Spring Boot microservices  
- API Gateway  
- JWT authentication  
- Role-based access control  

---

## 👨‍💻 Author

**Ibrahim**  
Software Engineer | Java & Angular  

---

## ⭐ Highlights

- Modern Angular (Standalone + Lazy Loading)  
- Clean enterprise architecture  
- Scalable SaaS design  
- Privacy-first approach  
