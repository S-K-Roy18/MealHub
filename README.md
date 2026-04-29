# 🍽 MealHub – Eat Together, Manage Smarter

A full-stack mess management web application with role-based access control.

## 📁 Project Structure

```
MealHub/
├── frontend/     # React + Vite
└── backend/      # Node.js + Express + MongoDB
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
```

**Create `.env` file** (copy from `.env.example` and fill in):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mealhub
JWT_SECRET=your_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
npm install
npm run dev   # starts on port 5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev   # starts on port 5173
```

Open → **http://localhost:5173**

---

## 🛡 User Roles

| Role | Who | Can Do |
|------|-----|--------|
| 👑 Admin | Mess creator | Everything + change manager |
| 🍽 Manager | Monthly assigned | Add expenses, meals, money, gas |
| 👤 Member | Everyone else | View all data |

> Admin can also be Manager if assigned for that month.

---

## 📱 Pages

| Page | Route | Access |
|------|-------|--------|
| Landing | `/` | Public |
| Login | `/login` | Public |
| Sign Up | `/signup` | Public |
| Create Mess | `/create-mess` | After signup |
| Dashboard | `/dashboard` | All members |
| Money Entry | `/money-entry` | Manager only |
| Money Collected | `/money-collected` | All |
| Expense Entry | `/expense-entry` | Manager only |
| Expense History | `/expense-history` | All |
| Meal Entry | `/meal-entry` | Manager only |
| Meal Tracking | `/meal-tracking` | All |
| Manager Change | `/manager-change` | Admin only |
| Members | `/members` | All |
| Notifications | `/notifications` | All |
| Profile | `/profile` | All |

---

## 💡 Key Formulas

```
Total Money Collected = Sum of all money entries
Total Money Spent     = Sum of all expense entries
Available Balance     = Collected - Spent
Per Meal Cost         = Total Spent / Total Mess Meals
Total Meals (member)  = Lunches + Dinners
Money Due             = Money Given - (Own Meals × Per Meal Cost)
  Positive (+) = Green = member paid extra
  Negative (-) = Red   = member owes money
```

---

## 🗄 MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user
3. Whitelist your IP (or `0.0.0.0/0` for development)
4. Copy the connection string to `backend/.env`

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Upload dist/ to Vercel
```
Set `VITE_API_URL` env variable to your backend URL.

### Backend → Render
- Create a Web Service pointing to `/backend`
- Set all env variables from `.env`
- Build command: `npm install`
- Start command: `npm start`
