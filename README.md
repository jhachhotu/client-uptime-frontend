# 🖥️ Sentinel – Uptime Monitoring Frontend

A modern, responsive, and high-performance frontend for the **Sentinel Uptime Monitoring Platform**, built with **React**, **Vite**, and **Tailwind CSS**. The application provides an intuitive interface for monitoring websites, APIs, SSL certificates, DNS records, ports, and infrastructure health through a clean and interactive dashboard.

🌐 **Live Demo:** https://client-uptime-frontend.vercel.app/

---

## 📖 Overview

Sentinel is a modern infrastructure monitoring platform designed to help developers and organizations monitor the health and availability of their services in real time.

The frontend communicates with a **Spring Boot Microservices Backend** secured with **OAuth2** and **JWT Authentication**, delivering a fast, scalable, and responsive user experience.

---

## ✨ Features

- 🚀 Modern Landing Page
- 🔐 Secure Authentication (OAuth2 & JWT)
- 📊 Interactive Monitoring Dashboard
- 🌐 Website & API Monitoring
- 🔒 SSL Certificate Monitoring
- 🌍 DNS Monitoring
- 🔌 Port Monitoring
- 📈 Real-time Status Updates
- 📱 Fully Responsive UI
- ⚡ Lightning Fast Performance with Vite
- 🎨 Modern UI with Tailwind CSS
- 🌙 Clean Dark Theme
- 🔄 REST API Integration
- ☁️ Cloud Deployment Ready

---

# 📸 Screenshots

## Landing Page

> Replace the path below with your actual screenshot after uploading it to your repository.

```markdown
![Landing Page](./public/screenshots/homepage.png)
```

---

# 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Authentication | Google OAuth + JWT |
| Icons | Lucide React |
| Linting | ESLint |
| Deployment | Vercel |

---

# 📂 Project Structure

```
client-uptime-frontend/

│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── utils/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── vercel.json
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/yourusername/client-uptime-frontend.git

cd client-uptime-frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_URL=http://localhost:8080

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Run Development Server

```bash
npm run dev
```

The application will start at:

```
http://localhost:5173
```

Vite provides an extremely fast development experience with instant Hot Module Replacement (HMR). :contentReference[oaicite:0]{index=0}

---

# 📦 Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Vite generates an optimized production bundle suitable for deployment to static hosting providers like Vercel. :contentReference[oaicite:1]{index=1}

---

# 🌐 Live Demo

Frontend is deployed on **Vercel**

**🔗 Live URL**

https://client-uptime-frontend.vercel.app/

---

# 🎯 Core Features

## Authentication

- Google OAuth Login
- JWT Authentication
- Protected Routes
- Secure Session Management

---

## Monitoring Dashboard

- Website Monitoring
- API Monitoring
- SSL Certificate Status
- DNS Monitoring
- Port Monitoring
- Response Time Analytics
- Uptime Statistics

---

## User Experience

- Responsive Design
- Fast Navigation
- Modern UI Components
- Smooth Animations
- Mobile Friendly
- Dark Theme

---

# 🎨 UI Highlights

- Clean and minimal interface
- Beautiful hero section
- Modern dashboard layout
- Responsive navigation
- Professional typography
- Reusable React components
- Optimized performance

---

# ⚡ Performance

- Fast page loading
- Optimized asset bundling
- Component-based architecture
- Lazy loading support
- Efficient API requests
- Hot Module Replacement (HMR)

---

# 🔗 Backend Integration

This frontend integrates with the **Sentinel Uptime Monitoring Backend**, built using:

- Spring Boot
- Spring Cloud Gateway
- Eureka Service Registry
- Config Server
- OAuth2 Authentication
- JWT Security
- Docker
- Microservices Architecture

---

# 🚀 Deployment

The frontend is deployed on **Vercel**.

To deploy your own instance:

```bash
npm run build
```

Deploy the generated `dist/` folder to:

- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages
- AWS S3
- Cloudflare Pages

---

# 📈 Future Enhancements

- Push Notifications
- Email Alerts
- SMS Notifications
- Dark / Light Theme Toggle
- Team Collaboration
- Dashboard Analytics
- WebSocket Real-Time Updates
- Charts & Graphs
- User Preferences
- Multi-language Support

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Chhotu Kumar**

- GitHub: https://github.com/jhachhotu
- LinkedIn: https://www.linkedin.com/in/kumarchhotu/

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub. It helps others discover the project and supports future development.
