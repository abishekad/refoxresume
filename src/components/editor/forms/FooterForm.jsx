import { SectionHeader, Label, Input } from './FormComponents';
import './FooterForm.css';

export default function FooterForm({ data, update, label, onRename, onDelete, id }) {
  return (
    <div className="footer-container">
      <SectionHeader icon="🏷️" title={label || "Footer Tagline"} onRename={onRename} onDelete={onDelete} id={id} />
      <Label>Resume Tagline</Label>
      <Input value={data?.tagline || ''} onChange={v => update({ ...data, tagline: v })} placeholder="Leave blank for auto-generation (Name • Resume)" />
    </div>
  );
}
