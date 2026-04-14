import { SectionHeader, Label, Input, TextArea, ItemCard } from './FormComponents';
import { Plus } from 'lucide-react';
import './ExperienceForm.css';

export default function ExperienceForm({ data, update, label, onRename, onDelete, id }) {
  const addExp = () => update([...data, { id: crypto.randomUUID(), jobTitle: "", company: "", companyNote: "", location: "", startDate: "", endDate: "", duration: "", bullets: ["", "", ""] }]);
  const updateExp = (idx, field, val) => { const exp = [...data]; exp[idx] = { ...exp[idx], [field]: val }; update(exp); };
  const updateExpBullet = (expIdx, bIdx, val) => { const exp = [...data]; const bullets = [...exp[expIdx].bullets]; bullets[bIdx] = val; exp[expIdx] = { ...exp[expIdx], bullets }; update(exp); };
  const addExpBullet = (expIdx) => { const exp = [...data]; exp[expIdx] = { ...exp[expIdx], bullets: [...exp[expIdx].bullets, ""] }; update(exp); };
  const removeExp = (idx) => update(data.filter((_, i) => i !== idx));

  return (
    <div className="exp-container">
      <SectionHeader icon="💼" title={label || "Work Experience"} action="ADD JOB" onAction={addExp} onRename={onRename} onDelete={onDelete} id={id} />
      {data.map((exp, idx) => (
        <ItemCard key={exp.id} onRemove={data.length > 1 ? () => removeExp(idx) : undefined}>
          <Label>Job Title</Label>
          <Input value={exp.jobTitle} onChange={(v) => updateExp(idx, "jobTitle", v)} placeholder="e.g. Software Engineer" />
          <div className="exp-grid-2">
            <div><Label>Company Name</Label><Input value={exp.company} onChange={(v) => updateExp(idx, "company", v)} placeholder="e.g. Google" /></div>
            <div><Label>Location</Label><Input value={exp.location} onChange={(v) => updateExp(idx, "location", v)} placeholder="e.g. New York, NY" /></div>
          </div>
          <div className="exp-grid-2">
            <div><Label>Company Note (optional)</Label><Input value={exp.companyNote} onChange={(v) => updateExp(idx, "companyNote", v)} placeholder="e.g. (Self-employed)" /></div>
            <div><Label>Duration</Label><Input value={exp.duration} onChange={(v) => updateExp(idx, "duration", v)} placeholder="1+ Year" /></div>
          </div>
          <div className="exp-grid-2">
            <div><Label>Start Date</Label><Input value={exp.startDate} onChange={(v) => updateExp(idx, "startDate", v)} placeholder="Feb 2025" /></div>
            <div><Label>End Date</Label><Input value={exp.endDate} onChange={(v) => updateExp(idx, "endDate", v)} placeholder="Present" /></div>
          </div>
          <div className="exp-mt-18">
            <Label>Achievement Bullets</Label>
            {exp.bullets.map((b, bIdx) => (
              <div key={bIdx} className="exp-bullet-row">
                <span className="exp-bullet-icon">•</span>
                <TextArea value={b} onChange={(v) => updateExpBullet(idx, bIdx, v)} placeholder={`Achievement / Responsibility #${bIdx + 1}`} rows={2} />
              </div>
            ))}
            <span onClick={() => addExpBullet(idx)} className="exp-add-bullet-btn">
              <Plus size={14} strokeWidth={3} /> Add Bullet Point
            </span>
          </div>
        </ItemCard>
      ))}
    </div>
  );
}
