# 🍽️ MealHub – Eat Together, Manage Smarter

<div align="center">
  <img src="frontend/public/favicon.png" alt="MealHub Logo" width="120" />
  <br/>

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://meal-hub-gcmc.vercel.app/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

**A premium, high-end mess management system designed for modern shared living.**

<br/>
<img src="https://img.shields.io/badge/Built%20with-Passion-red" alt="Passion"/>
<img src="https://img.shields.io/badge/Maintained-Yes-green" alt="Maintained"/>
</div>

---

## ⚡ Quick Glance

MealHub isn't just another management tool; it's a high-performance experience built with a stunning **Glassmorphism UI**. It automates complex financial calculations, meal tracking, and expense management for students, professionals, and teammates sharing a living space.

| Feature | Description |
| :--- | :--- |
| **🎨 Premium UI** | Stunning Mesh gradients, Frosted-glass cards, and Lucide icons. |
| **💰 Smart Financials** | Automatic "Money Due" and "Extra Paid" calculations based on dynamic variables. |
| **🔥 Utility Tracking** | Integrated gas cylinder & rice bag tracking with expense history. |
| **📱 Mobile First** | Pixel-perfect responsiveness ensuring usability on all screen sizes. |
| **🛡️ Role Access** | Secure Admin, Monthly Manager, and Member permissions. |
| **🔔 Activity Log** | Real-time audit notifications for 100% transparency. |
| **📅 Period Filters** | Global synchronization of current tracking period across all analytics pages. |

---

## 🔑 How It Works: Authentication & Mess Creation

MealHub is designed around a secure and intuitive onboarding process that groups users into independent "Messes". Here is the core logic that powers the platform:

### 1️⃣ Signup & Login
- **Registration:** Users sign up using their **Username**, **Mobile Number**, and **Email Address**. 
- **Authentication:** The backend authenticates credentials and issues a secure **JSON Web Token (JWT)**, which is stored locally on the client to maintain session state without requiring constant re-login.

### 2️⃣ Mess Creation & Joining
Once a user creates an account, they are placed in a "limbo" state until they join a mess. They have two options:
- **Create a New Mess (Admin Role):** The user can opt to create a brand new Mess by providing a Mess Name. By doing so, the user is automatically designated as the **Admin** and the **First Member** of that Mess. 
- **Join an Existing Mess (Member Role):** A user cannot forcefully join a mess. Instead, they must be manually added by an existing **Admin** or **Manager** of that mess. The Admin searches for the user by their registered mobile number and adds them to their roster.

### 3️⃣ Role Distribution
- **Admin:** The creator of the mess. Can add/remove members, promote managers, and oversee everything.
- **Monthly Manager:** Assigned by the Admin. Handles daily data entry (Meals, Expenses, Money Collected) for their designated active period.
- **Member:** Can view dashboards, track their own expenses, and monitor the overall mess statistics in read-only mode.

---

## 💎 Design Philosophy

- **Glassmorphism**: A floating interface utilizing layered mesh gradients and frosted backgrounds to create a sense of depth.
- **Modern Typography**: Clean, readable, and highly legible fonts optimized for data-dense dashboard experiences.
- **Premium Icons**: Powered by **Lucide-React** to maintain a sharp, consistent, and recognizable visual language.
- **Fluid Interactions**: Smooth page transitions, hover states, and micro-animations make the app feel alive and responsive.

---

## ⚖️ The "Precision" Engine

MealHub eliminates manual errors by calculating finances using an automated engine at the end of every active period:

```text
1. Per Meal Cost     = Total Monthly Spent / Total Mess Meals
2. Member Total Cost = (Member's Total Meals) × (Per Meal Cost)
3. Member Balance    = (Total Money Given) - (Member Total Cost)
```

- **🟢 Positive Balance**: The member has paid extra and is owed a refund (or credit for the next month).
- **🔴 Negative Balance**: The member owes money to the mess to settle their accounts.

---

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Lucide Icons, Vanilla CSS (Custom Design System).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas.
- **Hosting**: Vercel (Frontend), Render (Backend).

---

## 🚀 Local Setup

### 1️⃣ Backend Configuration
Navigate to the backend directory and set up the environment:
```bash
cd backend
npm install
# Create a .env file containing:
# MONGODB_URI=your_mongo_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000
# CLIENT_URL=http://localhost:5173
npm run dev
```

### 2️⃣ Frontend Configuration
Navigate to the frontend directory and start the Vite dev server:
```bash
cd frontend
npm install
# Create a .env file containing:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## 🌐 Production Notes

- **Routing**: The `vercel.json` configuration handles client-side SPA routing rewrites to gracefully prevent `404: NOT_FOUND` errors on page refresh.
- **Performance**: Static assets and modules are highly optimized via Vite for lightning-fast load times.
- **Privacy**: Sensitive member data (like email addresses) is heavily restricted and only visible to authorized Admins.

---

### Built with ❤️ by **SURYA**

© 2026 MealHub - Mess Management System.
