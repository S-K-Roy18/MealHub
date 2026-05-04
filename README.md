# 🍽️ MealHub – Eat Together, Manage Smarter

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://meal-hub-gcmc.vercel.app/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

**A premium, high-end mess management system designed for modern shared living.**

[Explore Live](https://meal-hub-gcmc.vercel.app/) • [Report Bug](https://github.com/S-K-Roy18/MealHub/issues) • [Request Feature](https://github.com/S-K-Roy18/MealHub/issues)

</div>

---

## ⚡ Quick Glance

MealHub isn't just another management tool; it's a high-performance experience built with a stunning **Glassmorphism UI**. It automates complex financial calculations, meal tracking, and expense management for students, professionals, and teammates.

| Feature | Description |
| :--- | :--- |
| **🎨 Premium UI** | Stunning Mesh gradients, Frosted-glass cards, and Lucide icons |
| **💰 Smart Financials** | Automatic "Money Due" and "Extra Paid" calculations |
| **🔥 Gas Tracking** | Integrated utility management with expense history |
| **📱 Mobile First** | Pixel-perfect responsiveness on all screen sizes |
| **🛡️ Role Access** | Secure Admin, Monthly Manager, and Member permissions |
| **🔔 Activity Log** | Real-time audit notifications for 100% transparency |

---

## 💎 Design Philosophy

- **Glassmorphism**: Floating interface with mesh gradients and frosted backgrounds.
- **Modern Typography**: Clean, readable fonts optimized for dashboard experiences.
- **Premium Icons**: Powered by **Lucide-React** for a sharp, consistent look.
- **Fluid Interactions**: Smooth transitions and micro-animations throughout.

---

## ⚖️ The "Precision" Engine

MealHub eliminates manual errors with automated financial formulas:

```bash
Per Meal Cost     = Total Monthly Spent / Total Mess Meals
Member Total Cost = (Member's Total Meals) × (Per Meal Cost)
Member Balance    = (Total Money Given) - (Member Total Cost)
```

-   **🟢 Positive Balance**: Member has paid extra.
-   **🔴 Negative Balance**: Member owes money to the mess.

---

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Lucide Icons, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas.
- **Hosting**: Vercel (Frontend), Render (Backend).

---

## 🚀 Local Setup

### 1️⃣ Backend Configuration
```bash
cd backend
npm install
# Create .env with MONGODB_URI, JWT_SECRET, PORT, CLIENT_URL
npm run dev
```

### 2️⃣ Frontend Configuration
```bash
cd frontend
npm install
# Create .env with VITE_API_URL
npm run dev
```

---

## 🌐 Production Notes

- **Routing**: The `vercel.json` configuration handles client-side SPA routing to prevent `404: NOT_FOUND` errors on page refresh.
- **Performance**: Assets are optimized via Vite for lightning-fast load times.
- **Privacy**: Member data (like Gmail) is restricted to Admins and the account owner.

---

### Built with ❤️ by **SURYA**

© 2026 MealHub Mess Management System.
