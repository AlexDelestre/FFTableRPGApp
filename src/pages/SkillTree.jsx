import { useState } from "react";
import "./SkillTree.css";
import Warrior from "./SkillTrees/Warrior.jsx";
import BlackMage from "./SkillTrees/BlackMage.jsx";
import WhiteMage from "./SkillTrees/WhiteMage.jsx";
import Monk from "./SkillTrees/Monk.jsx";
import Barbare from "./SkillTrees/Barbare.jsx";

export default function SkillTree() {
  const [currentTree, setCurrentTree] = useState("guerrier");

  return (
    <div className="skilltree-page">
      <h2>🌳 Arbre de compétences</h2>

      <div className="trees-menu">
        <button className="guerrier" onClick={() => setCurrentTree("guerrier")}>Guerrier</button>
        <button className="mage-noir" onClick={() => setCurrentTree("mage-noir")}>Mage Noir</button>
        <button className="mage-blanc" onClick={() => setCurrentTree("mage-blanc")}>Mage Blanc</button>
        <button className="monk" onClick={() => setCurrentTree("monk")}>Monk</button>
        <button className="barbare" onClick={() => setCurrentTree("barbare")}>Barbare</button>
      </div>

      <div className="tree-container">
        {currentTree === "guerrier" && <Warrior />}
        {currentTree === "mage-noir" && <BlackMage />}
        {currentTree === "mage-blanc" && <WhiteMage />}
        {currentTree === "monk" && <Monk />}
        {currentTree === "barbare" && <Barbare />}
      </div>
    </div>
  );
}
