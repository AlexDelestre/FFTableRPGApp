import { Link } from "react-router-dom";
import './SideBar.css';

export default function SideBar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Menu</h2>
        <button onClick={toggleSidebar}>✖</button>
      </div>
      <nav className="sidebar-nav">
        <Link to="/stats" onClick={toggleSidebar}>📊 Stats de personnage</Link>
        <Link to="/equipment" onClick={toggleSidebar}>🛡️ Équipement</Link>
        <Link to="/skill-tree" onClick={toggleSidebar}>🌳 Arbre de compétences</Link>
      </nav>
    </div>
  );
}
