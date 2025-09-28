import './NavBar.css';

export default function Navbar({ toggleSidebar }) {
  return (
    <div className="navbar">
      <button onClick={toggleSidebar}>☰</button>
      <h1>FF Table RPG App</h1>
    </div>
  );
}
