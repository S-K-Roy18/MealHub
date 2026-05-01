# 🍽 MealHub – Eat Together, Manage Smarter

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://meal-hub-gcmc.vercel.app/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

MealHub is a **premium, high-end mess management system** designed for modern shared living. Built with a stunning **Glassmorphism UI**, it automates complex financial calculations, meal tracking, and expense management for students, professionals, and teammates.

---

## ✨ Features & Highlights

-   🚀 **Stunning UI/UX**: Redesigned with mesh gradients, 3D illustrations, and floating glass cards.
-   💰 **Smart Financials**: Automatic calculation of "Money Due" and "Extra Paid" per member.
-   🔥 **Gas & Utility Tracking**: Manage gas cylinder bookings and payments with automated expense history integration.
-   📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile (Mobile-First approach).
-   🛡️ **Role-Based Access**: 
    -   **👑 Admin**: Create mess, manage members, assign monthly managers.
    -   **🍽 Manager**: Record meals, expenses, and payments for the current month.
    -   **👤 Member**: View transparency-focused dashboards and personal meal history.
-   🔔 **Activity Notifications**: Real-time audit logs for all financial and managerial actions.
-   💳 **Flexible Payments**: Support for **Cash** and **Online** payment tracking.

---

## 📸 Screenshots

### 🖥️ Premium Landing Page
![Hero Section](./screenshots/hero.png)

### 📊 Modern Management Dashboard
![Dashboard](./screenshots/dashboard.png)

### 📱 Mobile Optimized
![Mobile View](./screenshots/mobile.png)

---

## 💡 Smart Calculations

MealHub eliminates manual errors with automated formulas:

```
Per Meal Cost     = Total Monthly Spent / Total Mess Meals
Member Total Cost = (Member's Total Meals) × (Per Meal Cost)
Member Balance    = (Total Money Given) - (Member Total Cost)

• Balance > 0 (+) → Green → Member paid extra
• Balance < 0 (-) → Red   → Member owes money
```

---

## 🚀 Installation & Setup

### 📁 Project Structure
```
MealHub/
├── frontend/     # React (Vite) + Vanilla CSS
└── backend/      # Node.js + Express + MongoDB Atlas
```

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` (use `.env.example` as a template):
   ```env
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```
4. `npm run dev`

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. `npm run dev`

---

## 🌐 Deployment

-   **Frontend**: Hosted on **Vercel** ([meal-hub-gcmc.vercel.app](https://meal-hub-gcmc.vercel.app/))
-   **Backend**: Hosted on **Render**
-   **Database**: **MongoDB Atlas**

---

## 🛠 Built By
Built with ❤️ for shared living communities by **SURYA**.

---

© {new Date().getFullYear()} MealHub Mess Management System.
