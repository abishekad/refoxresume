import { SectionHeader, Label, Input, ItemCard } from './FormComponents';
import './CertificationsForm.css';

export default function CertificationsForm({ data, update, label, onRename, onDelete, id }) {
  const addCert = () => update([...(data || []), { id: crypto.randomUUID(), name: "", issuer: "" }]);
  const updateCert = (idx, field, val) => { const certs = [...(data || [])]; certs[idx] = { ...certs[idx], [field]: val }; update(certs); };
  const removeCert = (idx) => update((data || []).filter((_, i) => i !== idx));

  return (
    <div className="cert-container">
      <SectionHeader icon="📜" title={label || "Certifications"} action="ADD CERTIFICATION" onAction={addCert} onRename={onRename} onDelete={onDelete} id={id} />
      {(data || []).map((cert, idx) => (
        <ItemCard key={cert.id} title={cert.name || "Certification"} subtitle={cert.issuer || ""} onRemove={(data || []).length > 1 ? () => removeCert(idx) : undefined}>
          <Label>Certification Name</Label>
          <Input value={cert.name} onChange={(v) => updateCert(idx, "name", v)} placeholder="e.g. AWS Certified Developer" />
          <div className="cert-mt-14"><Label>Issuer</Label>
          <Input value={cert.issuer} onChange={(v) => updateCert(idx, "issuer", v)} placeholder="e.g. Amazon Web Services" /></div>
        </ItemCard>
      ))}
    </div>
  );
}
