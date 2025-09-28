import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";

import Stats from "./pages/Stats.jsx";
import Equipment from "./pages/Equipment.jsx";
import SkillTree from "./pages/SkillTree.jsx";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <div className="app-container">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <div className="main-content">
          <Routes>
            <Route path="/stats" element={<Stats />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/skill-tree" element={<SkillTree />} />
            <Route path="*" element={<Stats />} /> {/* Page par défaut */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;