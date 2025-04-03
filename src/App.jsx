import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Tasks from './pages/Tasks';
import Inbox from './pages/Inbox';
import Calendar from './pages/Calendar';
import Employees from './pages/Employees';
import Projects from './pages/Projects';
import Attendance from './pages/Attendance';
import Hiring from './pages/Hiring';
import Payroll from './pages/Payroll';
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user document from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              ...firebaseUser,
              role: userDoc.data().role || 'Employee' // Default to Employee if role not set
            });
          } else {
            // If user document doesn't exist, treat as unauthenticated
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Redirect to appropriate dashboard or login */}
        <Route path="/" element={
          user ? (
            user.role === 'HR' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/employee-dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        {/* Auth routes */}
        <Route path="/login" element={!user ? <Login /> : (
          user.role === 'HR' ? <Navigate to="/dashboard" replace /> : <Navigate to="/employee-dashboard" replace />
        )} />
        
        <Route path="/register" element={!user ? <Register /> : (
          user.role === 'HR' ? <Navigate to="/dashboard" replace /> : <Navigate to="/employee-dashboard" replace />
        )} />
        
        {/* HR Routes */}
        {user?.role === 'HR' && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/hiring" element={<Hiring />} />
            <Route path="/payroll" element={<Payroll />} />
          </>
        )}
        
        {/* Employee Route */}
        {user?.role === 'Employee' && (
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        )}
        
        {/* Fallback route - redirect to login if not authenticated */}
        <Route path="*" element={
          user ? (
            user.role === 'HR' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/employee-dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;