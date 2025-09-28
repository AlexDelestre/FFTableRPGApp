import { useState } from "react";
import "./SkillTree.css";
import WarriorTree from "./SkillTrees/WarriorTree.jsx";

export default function SkillTree() {
  const [currentTree, setCurrentTree] = useState("guerrier");

  return (
    <div className="skilltree-page">
      <h2>🌳 Arbre de compétences</h2>

      <div className="trees-menu">
        <button onClick={() => setCurrentTree("guerrier")}>Guerrier</button>
        <button onClick={() => setCurrentTree("mage-noir")}>Mage Noir</button>
        <button onClick={() => setCurrentTree("mage-blanc")}>Mage Blanc</button>
      </div>

      <div className="tree-container">
        {currentTree === "guerrier" && <WarriorTree />}
        {currentTree === "mage-noir" && <p>Arbre Mage Noir à venir...</p>}
        {currentTree === "mage-blanc" && <p>Arbre Mage Blanc à venir...</p>}
      </div>
    </div>
  );
}
