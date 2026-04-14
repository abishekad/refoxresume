import { SectionHeader, Input } from './FormComponents';
import { Trash2 } from 'lucide-react';
import './AchievementsForm.css';

export default function AchievementsForm({ data, update, label, onRename, onDelete, id }) {
  const addAchievement = () => update([...(data || []), { id: crypto.randomUUID(), text: "" }]);
  const updateAchievement = (idx, val) => { const ach = [...(data || [])]; ach[idx] = { ...ach[idx], text: val }; update(ach); };
  const removeAchievement = (idx) => update((data || []).filter((_, i) => i !== idx));

  return (
    <div className="achieve-container">
      <SectionHeader icon="🏆" title={label || "Notable Achievements"} action="ADD ACHIEVEMENT" onAction={addAchievement} onRename={onRename} onDelete={onDelete} id={id} />
      {(data || []).map((ach, idx) => (
        <div key={ach.id} className="achieve-row">
          <span className="achieve-bullet-icon">•</span>
          <Input value={ach.text} onChange={(v) => updateAchievement(idx, v)} placeholder="e.g. App reached 10k downloads" />
          {(data || []).length > 1 && (
            <button onClick={() => removeAchievement(idx)} className="achieve-remove-btn" title="Delete item">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
