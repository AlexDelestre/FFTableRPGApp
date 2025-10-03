import { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./Tree.css";

const skills = [
  { id: 1, name: "Coup puissant", description: "Inflige +10 dégâts", cost: 2, level: 1 },
  { id: 6, name: "Maîtrise de l'épée", description: "+2 précision sur les attaques", cost: 2, level: 1 },
  { id: 10, name: "Endurance", description: "+10 PV maximum", cost: 2, level: 1 },
  { id: 2, name: "Bouclier solide", description: "Augmente la défense de 5", cost: 3, level: 2, prerequisite: 1 },
];

export default function Barbare() {
  const [learnedSkills, setLearnedSkills] = useState(() => {
    const saved = localStorage.getItem("barbareSkills");
    return saved ? JSON.parse(saved) : [];
  });

  const [connections, setConnections] = useState([]);
  const skillRefs = useRef({})

  const [popupSkill, setPopupSkill] = useState(null);

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("stats");
    return saved ? JSON.parse(saved) : { AP: 10 };
  });

  useLayoutEffect(() => {
    const updateConnections = () => {
      const newConnections = [];

      skills.forEach(skill => {
        if (!skill.prerequisite) return;
        const parentRef = skillRefs.current[skill.prerequisite];
        const childRef = skillRefs.current[skill.id];
        if (parentRef && childRef) {
          const parentRect = parentRef.getBoundingClientRect();
          const childRect = childRef.getBoundingClientRect();
          const containerRect = parentRef.closest(".tree").getBoundingClientRect();

          newConnections.push({
            id: skill.id,
            startX: parentRect.left + parentRect.width / 2 - containerRect.left,
            startY: parentRect.top + parentRect.height / 2 - containerRect.top,
            endX: childRect.left + childRect.width / 2 - containerRect.left,
            endY: childRect.top + childRect.height / 2 - containerRect.top,
          });
        }
      });

      setConnections(newConnections);
    };

    updateConnections(); // calcul initial
    window.addEventListener("resize", updateConnections);
    return () => window.removeEventListener("resize", updateConnections);
  }, [learnedSkills]);

  useEffect(() => {
    localStorage.setItem("barbareSkills", JSON.stringify(learnedSkills));
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
    <div className="tree">
      <div className="ap-counter">
        <strong>AP disponibles :</strong> {stats.AP}
      </div>

      <svg className="skill-connections">
        {connections.map((c) => (
          <line
            key={c.id}
            x1={c.startX}
            y1={c.startY}
            x2={c.endX}
            y2={c.endY}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>

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
                  ref={el => (skillRefs.current[skill.id] = el)}
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
