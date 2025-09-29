import { useState, useEffect } from "react";
import "./WhiteMage.css";

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
];

export default function WhiteMage() {
  const [learnedSkills, setLearnedSkills] = useState(() => {
    const saved = localStorage.getItem("whitemageSkills");
    return saved ? JSON.parse(saved) : [];
  });

  const [popupSkill, setPopupSkill] = useState(null);

  // AP depuis stats
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("stats");
    return saved ? JSON.parse(saved) : { AP: 10 }; // fallback
  });

  // Sauvegarde skills
  useEffect(() => {
    localStorage.setItem("whitemageSkills", JSON.stringify(learnedSkills));
  }, [learnedSkills]);

  // Sauvegarde stats
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

  const forgetSkillWithDependencies = (skillId) => {
    // On part d'une compétence et on va chercher toutes les dépendances
    const dependentSkills = [];

    const findDependents = (id) => {
        skills.forEach(s => {
        if (s.prerequisite === id && learnedSkills.includes(s.id)) {
            dependentSkills.push(s);
            findDependents(s.id); // récursif pour aller plus loin
        }
        });
    };

    findDependents(skillId);
    return dependentSkills;
    };

    const confirmSkill = (skill) => {
    const currentAP = parseInt(stats["AP"]) || 0;

    if (learnedSkills.includes(skill.id)) {
        if (window.confirm(`Voulez-vous oublier "${skill.name}" ? Cela supprimera aussi toutes les compétences dépendantes.`)) {
        // Trouve toutes les compétences dépendantes
        const dependents = forgetSkillWithDependencies(skill.id);

        // Liste des IDs à retirer
        const idsToRemove = [skill.id, ...dependents.map(s => s.id)];

        // Calcule AP à rembourser
        const refundedAP = idsToRemove.reduce((sum, id) => {
            const s = skills.find(sk => sk.id === id);
            return sum + (s ? s.cost : 0);
        }, 0);

        // Supprime les compétences et rembourse AP
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
    <div className="white-mage-tree">
      <div className="ap-counter">
        <strong>AP disponibles :</strong> {stats["AP"]}
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
