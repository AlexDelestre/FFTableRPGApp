import { useState, useEffect } from "react";
import "./Monk.css";

const skills = [
  { id: 1, name: "Coup puissant", description: "Inflige +10 dégâts", cost: 2, level: 1 },
  { id: 2, name: "Bouclier solide", description: "Augmente la défense de 5", cost: 3, level: 2, prerequisite: 1 },
  { id: 3, name: "Furie du guerrier", description: "Inflige +25 dégâts sur un coup critique", cost: 5, level: 3, prerequisite: 2 },
  { id: 4, name: "Riposte", description: "Contre-attaque automatiquement", cost: 3, level: 2, prerequisite: 1 },
  { id: 5, name: "Coup tournoyant", description: "Attaque tous les ennemis autour", cost: 4, level: 3, prerequisite: 4 },
  { id: 6, name: "Maîtrise de l'épée", description: "+2 précision sur les attaques", cost: 2, level: 1 },
  { id: 7, name: "Garde renforcée", description: "Réduit les dégâts subis de 5%", cost: 3, level: 2, prerequisite: 6 },
  { id: 8, name: "Cri de guerre", description: "Augmente la puissance de tous les alliés", cost: 4, level: 2, prerequisite: 1 },
  { id: 9, name: "Frappe dévastatrice", description: "+50 dégâts mais consomme 2 AP", cost: 6, level: 3, prerequisite: 3 },
  { id: 10, name: "Endurance", description: "+10 PV maximum", cost: 2, level: 1 },
  { id: 11, name: "Regain d'énergie", description: "Récupère 3 AP par tour", cost: 4, level: 2, prerequisite: 10 },
  { id: 12, name: "Coup écrasant", description: "Inflige +20 dégâts et étourdit l'ennemi", cost: 5, level: 3, prerequisite: 11 },
  { id: 13, name: "Parade experte", description: "Chance d'annuler une attaque ennemie", cost: 3, level: 2, prerequisite: 7 },
  { id: 14, name: "Charge du guerrier", description: "Se déplace rapidement et frappe fort", cost: 4, level: 2, prerequisite: 1 },
  { id: 15, name: "Fracas", description: "Inflige dégâts à tous les ennemis en ligne", cost: 6, level: 3, prerequisite: 14 },
  { id: 16, name: "Force herculéenne", description: "+5 dégâts sur toutes les attaques", cost: 5, level: 3, prerequisite: 6 },
  { id: 17, name: "Courage indomptable", description: "Immunité à la peur", cost: 3, level: 2, prerequisite: 10 },
  { id: 18, name: "Frappe rapide", description: "Attaque deux fois par tour", cost: 6, level: 3, prerequisite: 16 },
  { id: 19, name: "Blocage parfait", description: "Annule totalement une attaque", cost: 7, level: 3, prerequisite: 7 },
  { id: 20, name: "Appel à la bataille", description: "Rallie les alliés et restaure 5 AP", cost: 4, level: 2, prerequisite: 8 },
  { id: 21, name: "Écrasement", description: "Inflige +40 dégâts sur un ennemi unique", cost: 7, level: 3, prerequisite: 9 },
  { id: 22, name: "Instinct du guerrier", description: "Augmente la vitesse de 10%", cost: 3, level: 2, prerequisite: 1 },
  { id: 23, name: "Coup précis", description: "Ignorer 5 points de défense ennemie", cost: 4, level: 2, prerequisite: 16 },
  { id: 24, name: "Tempête de lames", description: "Attaque tous les ennemis deux fois", cost: 8, level: 4, prerequisite: 15 },
  { id: 25, name: "Défense ultime", description: "Réduit tous les dégâts de 10%", cost: 6, level: 4, prerequisite: 19 },
  { id: 26, name: "Esprit guerrier", description: "+5 AP maximum", cost: 3, level: 2, prerequisite: 11 },
  { id: 27, name: "Coup déchirant", description: "Inflige +30 dégâts et saigne l'ennemi", cost: 7, level: 4, prerequisite: 12 },
  { id: 28, name: "Maîtrise totale", description: "Toutes les attaques critiques infligent +50% dégâts", cost: 9, level: 4, prerequisite: 18 },
  { id: 29, name: "Dernier rempart", description: "Réduit les dégâts à 1 PV une fois par combat", cost: 10, level: 5, prerequisite: 25 },
  { id: 30, name: "Colère du guerrier", description: "Augmente tous les dégâts de 15% pendant 3 tours", cost: 8, level: 5, prerequisite: 28 },
];

export default function Monk() {
  const [learnedSkills, setLearnedSkills] = useState(() => {
    const saved = localStorage.getItem("monkSkills");
    return saved ? JSON.parse(saved) : [];
  });

  const [popupSkill, setPopupSkill] = useState(null);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("stats");
    return saved ? JSON.parse(saved) : { AP: 10 };
  });

  useEffect(() => {
    localStorage.setItem("monkSkills", JSON.stringify(learnedSkills));
  }, [learnedSkills]);

  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
  }, [stats]);

  const handleSkillClick = (skill) => {
    if (isSkillLocked(skill)) {
      const prerequisiteSkill = skills.find(s => s.id === skill.prerequisite);
      setPopupSkill({
        ...skill,
        lockedReason: prerequisiteSkill
          ? `Vous devez d'abord apprendre "${prerequisiteSkill.name}"`
          : "Prérequis manquant"
      });
    } else {
      setPopupSkill(skill);
    }
  };

  // Récupérer toutes les compétences dépendantes récursivement
  const getDependentSkills = (skillId) => {
    const dependents = [];
    const findDependents = (id) => {
      skills.forEach(s => {
        if (s.prerequisite === id && learnedSkills.includes(s.id)) {
          dependents.push(s);
          findDependents(s.id);
        }
      });
    };
    findDependents(skillId);
    return dependents;
  };

  const confirmSkill = (skill) => {
    const currentAP = parseInt(stats.AP) || 0;

    if (learnedSkills.includes(skill.id)) {
      if (window.confirm(`Voulez-vous oublier "${skill.name}" ? Cela supprimera aussi toutes les compétences dépendantes.`)) {
        const dependents = getDependentSkills(skill.id);
        const idsToRemove = [skill.id, ...dependents.map(s => s.id)];

        const refundedAP = idsToRemove.reduce((sum, id) => {
          const s = skills.find(sk => sk.id === id);
          return sum + (s ? s.cost : 0);
        }, 0);

        setLearnedSkills(learnedSkills.filter(id => !idsToRemove.includes(id)));
        setStats({ ...stats, AP: currentAP + refundedAP });
        setPopupSkill(null);
      }
    } else {
      if (skill.cost > currentAP) {
        alert("Vous n'avez pas assez d'AP !");
        return;
      }
      if (window.confirm(`Voulez-vous apprendre "${skill.name}" pour ${skill.cost} AP ?`)) {
        setLearnedSkills([...learnedSkills, skill.id]);
        setStats({ ...stats, AP: currentAP - skill.cost });
        setPopupSkill(null);
      }
    }
  };

  const isSkillLocked = (skill) => {
    if (!skill.prerequisite) return false;
    return !learnedSkills.includes(skill.prerequisite);
  };

  return (
    <div className="monk-tree">
      <div className="ap-counter">
        <strong>AP disponibles :</strong> {stats.AP}
      </div>

      {Array.from({ length: 5 }, (_, lvl) => lvl + 1).map(level => (
        <div key={level} className="skill-level">
          {skills
            .filter(skill => skill.level === level)
            .map(skill => {
              const locked = isSkillLocked(skill);
              const learned = learnedSkills.includes(skill.id);
              return (
                <div
                  key={skill.id}
                  className={`skill-dot ${learned ? "learned" : ""} ${locked ? "locked" : ""}`}
                  onClick={() => handleSkillClick(skill)}
                  title={skill.name}
                >
                  <span>{skill.name}</span>
                </div>
              );
            })}
        </div>
      ))}

      {popupSkill && (
        <div className="popup-overlay" onClick={() => setPopupSkill(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{popupSkill.name}</h3>
            <p>{popupSkill.description}</p>
            <p>Coût : {popupSkill.cost} AP</p>

            {popupSkill.lockedReason ? (
              <p style={{ color: "#f87171" }}>{popupSkill.lockedReason}</p>
            ) : (
              <button onClick={() => confirmSkill(popupSkill)}>
                {learnedSkills.includes(popupSkill.id) ? "Oublier" : "Apprendre"}
              </button>
            )}

            <button onClick={() => setPopupSkill(null)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
