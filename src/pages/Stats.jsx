import { useState, useEffect } from "react";
import "./Stats.css";

// Définition des races et classes avec leurs stats de base et compétences initiales
const races = {
  Humain: { "Force": 1, "Force magique": 1, "Précision": 1 },
  Elfe: { "Défense magique": 1, "Précision": 2 },
  Nain: { "Défense": 2, "Défense magique": 1},
  Halfelin: { "Chance": 1, "Évasion": 1 },
  DemiElfe: { "Précision": 2, "Force": 1 },
  DemiOrc: { "Force": 2, "Force magique": 1 },
  Drakeide: { "Défense": 2, "Force": 1 },
  Gnome: { "Défense magique": 2, "Évasion": 1 },
  Tieffelin: { "Force magique": 2, "Défense magique": 1, },
  Orc: { "Force": 2, "Défense": 1 },
};

const classes = {
  Warrior: { initialSkills: [1, 2, 3], "PV Max": 5, "Force": 3, "Défense": 3, "Précision": 2 },
  Barbare: { initialSkills: [1, 2, 3], "PV Max": 10, "Force": 5, "Défense": 1 },
  Monk: { initialSkills: [1, 2, 3], "PV Max": 3, "Force": 4, "Vitesse": 1, "Évasion": 1 },
  BlackMage: { initialSkills: [1, 2, 3], "PV Max": 1, "PM Max": 3, "Force magique": 5, "Défense magique": 3 },
  WhiteMage: { initialSkills: [1, 2, 3], "PV Max": 2, "PM Max": 3, "Force magique": 3, "Défense magique": 5 },
};

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

  const [showCreationPopup, setShowCreationPopup] = useState(false);
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
  }, [stats]);

  // Commencer un nouveau personnage
  const startNewCharacter = () => {
    if (window.confirm("Es-tu sûr de vouloir créer un nouveau personnage ? Toutes tes données actuelles seront effacées.")) {
      localStorage.clear();
      setStats(statNames.reduce((acc, stat) => ({ ...acc, [stat]: "" }), {}));
      setSelectedRace(null);
      setSelectedClass(null);
      setShowCreationPopup(true);
    }
  };

  // Choisir les races et classes de départ
  const chooseRaceAndClass = (race, cls) => {
    if (!race || !cls) {
      alert("Merci de choisir une race et une classe !");
      return;
    }

    const raceStats = races[race] || {};
    const clsInfo = classes[cls] || {};

    const newStats = {
      ...stats,
      Race: race,
      Classe: cls,
      Niveau: 1,
      XP: 0,
      AP: 5 + (raceStats["AP"] || 0) + (clsInfo["AP"] || 0),
      "PV Max": 10 + (raceStats["PV Max"] || 0) + (clsInfo["PV Max"] || 0),
      "PV Actuel": 10 + (raceStats["PV Max"] || 0) + (clsInfo["PV Max"] || 0),
      "PM Max": 3 + (raceStats["PM Max"] || 0) + (clsInfo["PM Max"] || 0),
      "PM Actuel": 3 + (raceStats["PM Max"] || 0) + (clsInfo["PM Max"] || 0),
      Force: 5 + (raceStats["Force"] || 0) + (clsInfo["Force"] || 0),
      "Force magique": 5 + (raceStats["Force magique"] || 0) + (clsInfo["Force magique"] || 0),
      Défense: 4 + (raceStats["Défense"] || 0) + (clsInfo["Défense"] || 0),
      "Défense magique": 4 + (raceStats["Défense magique"] || 0) + (clsInfo["Défense magique"] || 0),
      Précision: 25 + (raceStats["Précision"] || 0) + (clsInfo["Précision"] || 0),
      Évasion: 50 + (raceStats["Évasion"] || 0) + (clsInfo["Évasion"] || 0),
      Vitesse: 5 + (raceStats["Vitesse"] || 0) + (clsInfo["Vitesse"] || 0),
      Chance: 5 + (raceStats["Chance"] || 0) + (clsInfo["Chance"] || 0),
    };

    setStats(newStats);

    if (clsInfo.initialSkills) {
      localStorage.setItem(`${cls.toLowerCase()}Skills`, JSON.stringify(clsInfo.initialSkills));
    }

    setShowCreationPopup(false);
  };

  const editStat = (stat) => {
    const newValue = prompt(`Modifier ${stat}:`, stats[stat]);
    if (newValue !== null) {
      setStats({ ...stats, [stat]: newValue });
    }
  };

  const midIndex = Math.ceil(statNames.length / 2);
  const leftStats = statNames.slice(0, midIndex);
  const rightStats = statNames.slice(midIndex);

  return (
    <div className="stats-page">
      <h2>📊 Stats du personnage</h2>

      <button className="new-character-btn" onClick={startNewCharacter}>Créer un nouveau personnage</button>

      {showCreationPopup && (
        <div className="popup-overlay-create" onClick={() => setShowCreationPopup(false)}>
          <div className="popup-content-create" onClick={e => e.stopPropagation()}>
            <h3>Choisis ta race et ta classe</h3>
            <div>
              <strong>Race :</strong>
              {Object.keys(races).map(race => (
                <button
                  key={race}
                  className={selectedRace === race ? "selected" : ""}
                  onClick={() => setSelectedRace(race)}
                >
                  {race}
                </button>
              ))}
            </div>
            <div>
              <strong>Classe :</strong>
              {Object.keys(classes).map(cls => (
                <button
                  key={cls}
                  className={selectedClass === cls ? "selected" : ""}
                  onClick={() => setSelectedClass(cls)}
                >
                  {cls}
                </button>
              ))}
            </div>
            <button
              className="validate-btn-create"
              onClick={() => chooseRaceAndClass(selectedRace, selectedClass)}
            >
              Valider
            </button>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stats-column">
          {leftStats.map((stat, idx) => (
            <div key={idx} className="stat-row">
              <span className="stat-name">{stat}</span>
              <span className="stat-value">{stats[stat] || "--"}</span>
              <button className="edit-stat-btn" onClick={() => editStat(stat)}>✎</button>
            </div>
          ))}
        </div>
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
