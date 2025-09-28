import { useState } from "react";
import "./Equipment.css";

export default function Equipment() {
  const [equipments, setEquipments] = useState([]);
  const [money, setMoney] = useState({ copper: 0, silver: 0, gold: 0, platinum: 0 });

  const addEquipment = () => {
    const name = prompt("Nom de l'équipement :");
    const description = prompt("Description :");
    if (name) setEquipments([...equipments, { name, description }]);
  };

  return (
    <div className="equipment-page">
      <h2>🛡️ Équipement</h2>

      <div className="money-grid">
        {Object.entries(money).map(([key, value]) => (
          <div key={key} className="money-item">
            <label className="capitalize">{key}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setMoney({ ...money, [key]: Number(e.target.value) })}
            />
          </div>
        ))}
      </div>

      <button onClick={addEquipment} className="add-equipment-btn">
        ➕ Ajouter un équipement
      </button>

      <ul className="equipment-list">
        {equipments.map((eq, idx) => (
          <li key={idx} className="equipment-item">
            <strong>{eq.name}</strong>
            <p>{eq.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
