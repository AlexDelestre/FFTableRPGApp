import { useState, useEffect } from "react";
import "./Stats.css";

export default function Stats() {
  const statNames = [
    "Nom", "Race", "Classe", "Niveau", "XP", "AP",
    "Force", "Force magique", "Défense", "Défense magique",
    "Précision", "Évasion", "Chance", "Vitesse",
    "PV Max", "PV Actuel", "PM Max", "PM Actuel"
  ];

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("stats");
    if (saved) return JSON.parse(saved);
    const initialStats = {};
    statNames.forEach(stat => initialStats[stat] = "");
    return initialStats;
  });

  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
  }, [stats]);

  const editStat = (stat) => {
    const newValue = prompt(`Modifier ${stat}:`, stats[stat]);
    if (newValue !== null) {
      setStats({ ...stats, [stat]: newValue });
    }
  };

  // Découpage en deux colonnes
  const midIndex = Math.ceil(statNames.length / 2);
  const leftStats = statNames.slice(0, midIndex);
  const rightStats = statNames.slice(midIndex);

  return (
    <div className="stats-page">
      <h2>📊 Stats du personnage</h2>
      <div className="stats-grid">
        {/* Colonne gauche */}
        <div className="stats-column">
          {leftStats.map((stat, idx) => (
            <div key={idx} className="stat-row">
              <span className="stat-name">{stat}</span>
              <span className="stat-value">{stats[stat] || "--"}</span>
              <button className="edit-stat-btn" onClick={() => editStat(stat)}>✎</button>
            </div>
          ))}
        </div>

        {/* Colonne droite */}
        <div className="stats-column">
          {rightStats.map((stat, idx) => (
            <div key={idx} className="stat-row">
              <span className="stat-name">{stat}</span>
              <span className="stat-value">{stats[stat] || "--"}</span>
              <button className="edit-stat-btn" onClick={() => editStat(stat)}>✎</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
