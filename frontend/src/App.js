import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => setAuthed(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthed(false);
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/dashboard">Dashboard</Link>{" | "}
        <Link to="/login">Login</Link>{" | "}
        <Link to="/register">Register</Link>{" | "}
        {authed && <button onClick={handleLogout}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;