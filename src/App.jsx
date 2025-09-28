import { useState, useEffect } from "react";

function App() {
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem("playerSkills");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("playerSkills", JSON.stringify(skills));
  }, [skills]);

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const allSkills = [
    { id: "tir_rapide", name: "Tir Rapide" },
    { id: "vue_perçante", name: "Vue Perçante" },
    { id: "camouflage", name: "Camouflage" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌳 Arbre de compétences</h1>
      <p>Choisis tes compétences :</p>
      <ul>
        {allSkills.map((skill) => (
          <li key={skill.id}>
            <button onClick={() => toggleSkill(skill.id)}>
              {skills.includes(skill.id) ? "✅ " : "⬜ "} {skill.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App;
