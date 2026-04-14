import { SectionHeader, Input } from './FormComponents';
import { Trash2 } from 'lucide-react';
import './KeyMetricsForm.css';

export default function KeyMetricsForm({ data, update, label, onRename, onDelete, id }) {
  const addMetric = () => update([...(data || []), { id: crypto.randomUUID(), text: "" }]);
  const updateMetric = (idx, val) => { const metrics = [...(data || [])]; metrics[idx] = { ...metrics[idx], text: val }; update(metrics); };
  const removeMetric = (idx) => update((data || []).filter((_, i) => i !== idx));

  return (
    <div className="metrics-container">
      <SectionHeader icon="📊" title={label || "Key Metrics & Scale"} action="ADD METRIC" onAction={addMetric} onRename={onRename} onDelete={onDelete} id={id} />
      <div className="metrics-tip-box">
        <strong className="metrics-tip-bold">💡 ATS Tip:</strong> Quantify your impact. e.g. "Scaled API to handle 1M+ req/sec" or "Reduced load time by 40%".
      </div>
      {(data || []).map((metric, idx) => (
        <div key={metric.id} className="metrics-row">
          <span className="metrics-bullet-icon">•</span>
          <Input value={metric.text} onChange={(v) => updateMetric(idx, v)} placeholder={`Metric #${idx + 1}`} />
          {(data || []).length > 1 && (
            <button onClick={() => removeMetric(idx)} className="metrics-remove-btn" title="Delete item">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
