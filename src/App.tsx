import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { Dashboard } from "./layouts/Dashboard";

import "./App.css";

import AppLoader from "@/components/ui/AppLoader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load current user
        // Load permissions
        // Load settings
        // etc.
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/*" element={<Dashboard />} />
      <Route path="/auth" element={<h2>Auth</h2>} />
    </Routes>
  );
}

export default App;
