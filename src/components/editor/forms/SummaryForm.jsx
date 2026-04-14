import { SectionHeader, TextArea } from './FormComponents';
import './SummaryForm.css';

export default function SummaryForm({ data, update, label, onRename, onDelete, id }) {
  return (
    <div className="summary-container">
      <SectionHeader icon="📝" title={label || "Professional Summary"} onRename={onRename} onDelete={onDelete} id={id} />
      <div className="summary-tip-box">
        <strong className="summary-tip-bold">💡 ATS Tip:</strong> Use keywords from your target job description. Limit to 3-4 impactful lines integrating your top skills.
      </div>
      <TextArea value={data} onChange={(v) => update(v)} placeholder="Strategic software engineer with 5+ years of experience..." rows={5} />
    </div>
  );
}
