import { SectionHeader, Label, Input, TextArea, ItemCard } from './FormComponents';
import { Plus } from 'lucide-react';
import './ProjectsForm.css';

export default function ProjectsForm({ data, update, label, onRename, onDelete, id }) {
  const addProject = () => update([...data, { id: crypto.randomUUID(), title: "", subtitle: "", location: "", startDate: "", endDate: "", description: "", bullets: ["", "", ""] }]);
  const updateProject = (idx, field, val) => { const proj = [...data]; proj[idx] = { ...proj[idx], [field]: val }; update(proj); };
  const updateBullet = (projIdx, bulIdx, val) => { const projs = [...data]; const bullets = [...projs[projIdx].bullets]; bullets[bulIdx] = val; projs[projIdx] = { ...projs[projIdx], bullets }; update(projs); };
  const addBullet = (projIdx) => { const projs = [...data]; projs[projIdx] = { ...projs[projIdx], bullets: [...projs[projIdx].bullets, ""] }; update(projs); };
  const removeProject = (idx) => update(data.filter((_, i) => i !== idx));

  return (
    <div className="proj-container">
      <SectionHeader icon="🚀" title={label || "Projects"} action="ADD PROJECT" onAction={addProject} onRename={onRename} onDelete={onDelete} id={id} />
      {data.map((proj, idx) => (
        <ItemCard key={proj.id} onRemove={data.length > 1 ? () => removeProject(idx) : undefined}>
          <Label>Project Name</Label>
          <Input value={proj.title} onChange={(v) => updateProject(idx, "title", v)} placeholder="e.g. Smart Mobility Platform" />
          <div className="proj-mt-14"><Label>Subtitle / Type</Label>
          <Input value={proj.subtitle} onChange={(v) => updateProject(idx, "subtitle", v)} placeholder="e.g. Full Stack Application" /></div>
          
          <div className="proj-grid-3">
            <div><Label>Location</Label><Input value={proj.location} onChange={(v) => updateProject(idx, "location", v)} placeholder="e.g. New York, NY" /></div>
            <div><Label>Start Date</Label><Input value={proj.startDate} onChange={(v) => updateProject(idx, "startDate", v)} placeholder="Dec 2021" /></div>
            <div><Label>End Date</Label><Input value={proj.endDate} onChange={(v) => updateProject(idx, "endDate", v)} placeholder="June 2022" /></div>
          </div>
          
          <div className="proj-mt-14">
            <Label>Description (For simpler templates)</Label>
            <TextArea value={proj.description} onChange={(v) => updateProject(idx, "description", v)} placeholder="Brief description, tech stack, and key outcome" rows={2} />
          </div>

          <div className="proj-mt-18">
            <Label>Bullet Points (For detailed templates)</Label>
            {proj.bullets.map((b, bIdx) => (
              <div key={bIdx} className="proj-bullet-row">
                <span className="proj-bullet-icon">•</span>
                <Input value={b} onChange={(v) => updateBullet(idx, bIdx, v)} placeholder={`Feature / Bullet point #${bIdx + 1}`} />
              </div>
            ))}
            <span onClick={() => addBullet(idx)} className="proj-add-bullet-btn">
              <Plus size={14} strokeWidth={3} /> Add Bullet Point
            </span>
          </div>
        </ItemCard>
      ))}
    </div>
  );
}
