import { useState, useEffect } from "react";
import "./WarriorTree.css";

const skills = [
  { id: 1, name: "Coup puissant", description: "Inflige +10 dégâts", cost: 2, level: 1 },
  { id: 2, name: "Bouclier solide", description: "Augmente la défense de 5", cost: 3, level: 2, prerequisite: 1 },
  { id: 3, name: "Furie du guerrier", description: "Inflige +25 dégâts sur un coup critique", cost: 5, level: 3, prerequisite: 2 },
];

export default function WarriorTree() {
  const [ap, setAp] = useState(10);

  const [learnedSkills, setLearnedSkills] = useState(() => {
    const saved = localStorage.getItem("warriorSkills");
    return saved ? JSON.parse(saved) : [];
  });

  const [popupSkill, setPopupSkill] = useState(null);

  // Sauvegarde dans localStorage
  useEffect(() => {
    localStorage.setItem("warriorSkills", JSON.stringify(learnedSkills));
  }, [learnedSkills]);

  const handleSkillClick = (skill) => {
    setPopupSkill(skill);
  };

  const confirmSkill = (skill) => {
    if (learnedSkills.includes(skill.id)) {
      // Débloquer skill
      if (window.confirm(`Voulez-vous désapprendre "${skill.name}" ?`)) {
        setLearnedSkills(learnedSkills.filter(id => id !== skill.id));
        setAp(ap + skill.cost);
        setPopupSkill(null);
      }
    } else {
      // Acheter skill
      if (ap < skill.cost) {
        alert("Pas assez d'AP !");
        return;
      }
      if (window.confirm(`Voulez-vous apprendre "${skill.name}" pour ${skill.cost} AP ?`)) {
        setLearnedSkills([...learnedSkills, skill.id]);
        setAp(ap - skill.cost);
        setPopupSkill(null);
      }
    }
  };

  const isSkillLocked = (skill) => {
    if (!skill.prerequisite) return false;
    return !learnedSkills.includes(skill.prerequisite);
  };

  return (
    <div className="warrior-tree">
      <p>AP disponibles : {ap}</p>
      <div className="skills-grid">
        {skills.map(skill => {
          const locked = isSkillLocked(skill);
          const learned = learnedSkills.includes(skill.id);
          return (
            <div
              key={skill.id}
              className={`skill-dot ${learned ? "learned" : ""} ${locked ? "locked" : ""}`}
              onClick={() => !locked && handleSkillClick(skill)}
            >
              {skill.name[0]}
            </div>
          );
        })}
      </div>

      {popupSkill && (
        <div className="popup-overlay" onClick={() => setPopupSkill(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{popupSkill.name}</h3>
            <p>{popupSkill.description}</p>
            <p>Coût : {popupSkill.cost} AP</p>
            <button onClick={() => confirmSkill(popupSkill)}>
              {learnedSkills.includes(popupSkill.id) ? "Désapprendre" : "Apprendre"}
            </button>
            <button onClick={() => setPopupSkill(null)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
