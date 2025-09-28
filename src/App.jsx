import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import SideBar from "./components/SideBar.jsx";
import NavBar from "./components/NavBar.jsx";

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
        <NavBar toggleSidebar={toggleSidebar} />

        {/* Sidebar */}
        <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

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