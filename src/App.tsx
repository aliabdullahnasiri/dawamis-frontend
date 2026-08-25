import { Routes, Route } from "react-router-dom";

import { Dashboard } from "./layouts/Dashboard";

import "./App.css"

function App() {

  return (
    <Routes>
      <Route path="/*" element={<Dashboard />} />
      <Route path="/auth" element={<h2>Auth</h2>} />
    </Routes>
  );
}

export default App;
