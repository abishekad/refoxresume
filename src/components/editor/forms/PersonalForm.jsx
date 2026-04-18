import { SectionHeader, Label, Input } from './FormComponents';
import './PersonalForm.css';

export default function PersonalForm({ data, update, label, onRename, onDelete, id }) {
  const setField = (field, val) => update({ ...data, [field]: val });

  return (
    <div className="pf-container">
      <SectionHeader icon="👤" title={label || "Personal Information"} onRename={onRename} onDelete={onDelete} id={id} />
      <Label>Full Name</Label>
      <Input value={data.fullName} onChange={(v) => setField("fullName", v)} placeholder="E.g. Joshua Schmidt" />
      <Label>Professional Headline / Subhead</Label>
      <Input value={data.subhead} onChange={(v) => setField("subhead", v)} placeholder="E.g. Full Stack Developer & Software Engineer" />
      <Label>Current Role Tag</Label>
      <Input value={data.currentRole} onChange={(v) => setField("currentRole", v)} placeholder="E.g. SOFTWARE ENGINEER @ GOOGLE" />
      <div className="pf-grid-2">
        <div><Label>Professional Title</Label><Input value={data.professionalTitle} onChange={v => setField("professionalTitle", v)} placeholder="E.g. Full Stack Developer" /></div>
        <div><Label>Location</Label><Input value={data.location} onChange={v => setField("location", v)} placeholder="E.g. Bengaluru, India" /></div>
      </div>
      <div className="pf-grid-2">
        <div><Label>Phone</Label><Input value={data.phone} onChange={v => setField("phone", v)} placeholder="+91 98765 43210" /></div>
        <div><Label>Email</Label><Input value={data.email} onChange={v => setField("email", v)} placeholder="your@email.com" /></div>
      </div>
      <div className="pf-grid-2">
        <div><Label>GitHub Username</Label><Input value={data.github} onChange={v => setField("github", v)} placeholder="yourusername" /></div>
        <div><Label>LinkedIn Username</Label><Input value={data.linkedin} onChange={v => setField("linkedin", v)} placeholder="yourprofile" /></div>
      </div>
      <Label>Website / Portfolio</Label>
      <Input value={data.website} onChange={(v) => setField("website", v)} placeholder="E.g. joshuaschmidt.tech" />
    </div>
  );
}
