import { SectionHeader, Label, Input, TextArea, ItemCard } from './FormComponents';
import './EducationForm.css';

export default function EducationForm({ data, update, label, onRename, onDelete, id }) {
  const addEduEntry = () => update([...data, { id: crypto.randomUUID(), degree: "", school: "", location: "", date: "", details: "", cgpa: "", coursework: "" }]);
  const updateEduEntry = (idx, field, val) => { const entries = [...data]; entries[idx] = { ...entries[idx], [field]: val }; update(entries); };
  const removeEduEntry = (idx) => update(data.filter((_, i) => i !== idx));

  return (
    <div className="edu-container">
      <SectionHeader icon="🎓" title={label || "Education"} action="ADD DEGREE" onAction={addEduEntry} onRename={onRename} onDelete={onDelete} id={id} />
      {data.map((edu, idx) => (
        <ItemCard key={edu.id} title={edu.degree || "Degree"} subtitle={edu.school || ""} onRemove={data.length > 1 ? () => removeEduEntry(idx) : undefined}>
          <Label>Degree Title</Label>
          <Input value={edu.degree} onChange={(v) => updateEduEntry(idx, "degree", v)} placeholder="e.g. Master of Engineering" />
          <div className="edu-mt-14"><Label>School / University</Label>
          <Input value={edu.school} onChange={(v) => updateEduEntry(idx, "school", v)} placeholder="e.g. Cornell Tech" /></div>
          <div className="edu-grid-2">
            <div><Label>Location</Label><Input value={edu.location} onChange={(v) => updateEduEntry(idx, "location", v)} placeholder="e.g. New York, NY" /></div>
            <div><Label>Date / Graduation</Label><Input value={edu.date} onChange={(v) => updateEduEntry(idx, "date", v)} placeholder="e.g. May 2022" /></div>
          </div>
          <div className="edu-grid-2">
            <div><Label>CGPA / GPA</Label><Input value={edu.cgpa} onChange={(v) => updateEduEntry(idx, "cgpa", v)} placeholder="e.g. 8.4/10" /></div>
            <div><Label>Coursework</Label><Input value={edu.coursework} onChange={(v) => updateEduEntry(idx, "coursework", v)} placeholder="e.g. Data Structures" /></div>
          </div>
          <div className="edu-mt-14"><Label>Details (Concentration, Honors)</Label>
          <TextArea value={edu.details} onChange={(v) => updateEduEntry(idx, "details", v)} placeholder="e.g. COURSES: ML Engineering, AR & VR" rows={2} /></div>
        </ItemCard>
      ))}
    </div>
  );
}
