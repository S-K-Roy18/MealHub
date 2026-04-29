import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateMess from './pages/CreateMess';

// Protected pages
import Dashboard from './pages/Dashboard';
import MoneyEntry from './pages/MoneyEntry';
import MoneyCollected from './pages/MoneyCollected';
import ExpenseEntry from './pages/ExpenseEntry';
import ExpenseHistory from './pages/ExpenseHistory';
import MealEntry from './pages/MealEntry';
import MealTracking from './pages/MealTracking';
import ManagerChange from './pages/ManagerChange';
import Members from './pages/Members';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/create-mess" element={<CreateMess />} />

            {/* Protected routes with sidebar layout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/money-collected" element={<MoneyCollected />} />
              <Route path="/expense-history" element={<ExpenseHistory />} />
              <Route path="/meal-tracking" element={<MealTracking />} />
              <Route path="/members" element={<Members />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />

              {/* Manager only */}
              <Route path="/money-entry" element={
                <ProtectedRoute requireManager><MoneyEntry /></ProtectedRoute>
              } />
              <Route path="/expense-entry" element={
                <ProtectedRoute requireManager><ExpenseEntry /></ProtectedRoute>
              } />
              <Route path="/meal-entry" element={
                <ProtectedRoute requireManager><MealEntry /></ProtectedRoute>
              } />

              {/* Admin only */}
              <Route path="/manager-change" element={
                <ProtectedRoute requireAdmin><ManagerChange /></ProtectedRoute>
              } />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
