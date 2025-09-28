import "./Stats.css";

export default function Stats() {
  const stats = [
    "Nom", "Race", "Classe", "Niveau", "XP", "AP",
    "Force", "Force magique", "Défense", "Défense magique",
    "Précision", "Évasion", "Chance", "Vitesse",
    "PV Max", "PV Actuel", "PM Max", "PM Actuel"
  ];

  return (
    <div className="stats-page">
      <h2>📊 Stats du personnage</h2>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-row">
            <span className="stat-name">{stat}</span>
            <span className="stat-value">--</span>
          </div>
        ))}
      </div>
    </div>
  );
}
