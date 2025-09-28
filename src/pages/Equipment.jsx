import { useState, useEffect } from "react";
import "./Equipment.css";

export default function Equipment() {
  const [equipments, setEquipments] = useState(() => {
    const saved = localStorage.getItem("equipments");
    return saved ? JSON.parse(saved) : [];
  });

  const [money, setMoney] = useState(() => {
    const saved = localStorage.getItem("money");
    return saved ? JSON.parse(saved) : { copper: 0, silver: 0, gold: 0, platinum: 0 };
  });

  useEffect(() => {
    localStorage.setItem("equipments", JSON.stringify(equipments));
  }, [equipments]);

  useEffect(() => {
    localStorage.setItem("money", JSON.stringify(money));
  }, [money]);

  const addEquipment = () => {
    const name = prompt("Nom de l'équipement :");
    if (!name) return;
    const description = prompt("Description :") || "";
    setEquipments([...equipments, { name, description }]);
  };

  const removeEquipment = (index) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet équipement ?")) {
      const newList = [...equipments];
      newList.splice(index, 1);
      setEquipments(newList);
    }
  };

  const editEquipment = (index) => {
    const eq = equipments[index];
    const newName = prompt("Modifier le nom :", eq.name);
    if (newName === null) return; // Annulé
    const newDescription = prompt("Modifier la description :", eq.description);
    if (newDescription === null) return; // Annulé
    const newList = [...equipments];
    newList[index] = { name: newName, description: newDescription };
    setEquipments(newList);
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
            <div className="equipment-info">
              <strong>{eq.name}</strong>
              <p>{eq.description}</p>
            </div>
            <div className="equipment-actions">
              <button onClick={() => editEquipment(idx)} className="edit-btn">✎</button>
              <button onClick={() => removeEquipment(idx)} className="remove-equipment-btn">✖</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
