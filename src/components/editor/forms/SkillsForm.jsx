import { SectionHeader, Label, Input, ItemCard } from './FormComponents';
import './SkillsForm.css';

export default function SkillsForm({ data, update, label, onRename, onDelete, id }) {
  const safeData = Array.isArray(data) ? data : [];
  
  const addSkill = () => update([...safeData, { id: crypto.randomUUID(), category: "", items: "" }]);
  const updateSkill = (idx, field, val) => { const skills = [...safeData]; skills[idx] = { ...skills[idx], [field]: val }; update(skills); };
  const removeSkill = (idx) => update(safeData.filter((_, i) => i !== idx));

  return (
    <div className="skills-container">
      <SectionHeader icon="⚡" title={label || "Technical Skills"} action="ADD CATEGORY" onAction={addSkill} onRename={onRename} onDelete={onDelete} id={id} />
      {safeData.map((skill, idx) => (
        <ItemCard key={skill.id || idx} title={skill.category || "Skill Category"} subtitle={skill.items || ""} onRemove={safeData.length > 1 ? () => removeSkill(idx) : undefined}>
          <Label>Category</Label>
          <Input value={skill.category} onChange={(v) => updateSkill(idx, "category", v)} placeholder="e.g. Frontend, Data Science" />
          <div className="skills-mt-14">
            <Label>Skills (Comma separated)</Label>
            <Input value={skill.items} onChange={(v) => updateSkill(idx, "items", v)} placeholder="e.g. React.js, Python, AWS" />
          </div>
        </ItemCard>
      ))}
    </div>
  );
}
