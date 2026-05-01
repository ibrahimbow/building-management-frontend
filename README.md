🏢 Building Management Frontend

A modern, scalable Angular (Standalone) application for managing residential buildings, built with enterprise-grade architecture, clean UI, and real-world SaaS design patterns.

🚀 Overview

The Building Management Platform enables tenants and managers to interact within residential buildings through a secure and intuitive interface.

This frontend follows modern Angular best practices:

Standalone Components (no NgModules)
Lazy Loading (loadComponent)
Feature-based architecture
Clean separation of concerns
Scalable structure for microservices backend
🧠 Core Concept

The system separates user identity from building membership:

User (Account)
      ↓
Join Building (via invitation code)
      ↓
Access building features

A user can exist in the system without being part of any building.

✨ Features
👤 Tenant Experience
Authentication (Login / Register)
Join building via invitation code
Dashboard with conditional access
Building Information
Announcements
Resident Chat (UI ready)
Help & Share module
User Settings (profile & privacy)
🔒 Privacy by Design
Only nickname + profile photo are visible to residents
Sensitive data is protected:
Email ❌ hidden
Phone ❌ hidden
🎨 UI / UX
Angular Material design system
Sidebar-based dashboard layout
Responsive design
Clean and minimal interface
Navigation with active states
🧱 Tech Stack
Angular (Standalone Architecture)
TypeScript
SCSS
RxJS
Angular Router (lazy loading)
Angular Material
🏗️ Architecture
Key Principles
Feature-based structure
Separation of concerns
Lazy loading for performance
Scalable for backend microservices
📂 Project Structure
src/app/
├── core/              # Services, guards, interceptors, models
├── auth/              # Login / Register UI
├── layout/            # Main layout (sidebar + router-outlet)
├── features/
│   └── tenant/
│       ├── tenant-dashboard/
│       ├── join-building/
│       ├── building-info/
│       ├── announcements/
│       ├── resident-chat/
│       ├── help-share/
│       └── settings/
├── shared/            # Reusable components & utilities
└── app.routes.ts      # Routing configuration
⚙️ Installation
npm install
▶️ Run the Application
ng serve

Open in browser:

http://localhost:4200
🔧 Configuration
Standalone Angular setup (no NgModules)
Routing handled via app.routes.ts
Layout uses nested routing with MainLayout
Angular Material requires:
provideAnimations()

in app.config.ts

🔗 Backend Integration

Designed to integrate with:

Spring Boot microservices
API Gateway
JWT authentication
Role-based access control (Tenant / Manager / Admin)
📌 Application Flow
Register → Login → Dashboard (locked)
→ Enter Building Code
→ Unlock Features
🚀 Roadmap
Current
Tenant UI
Routing & layout
Feature structure
Next
JWT authentication
API integration
Role-based guards
Manager dashboard
Future
Real-time chat (WebSocket)
Notifications system
File uploads (profile images)
Multi-building support
Mobile / PWA support

⭐ Highlights
Modern Angular (Standalone + Lazy Loading)
Clean enterprise architecture
Scalable SaaS design
Ready for microservices backend integration