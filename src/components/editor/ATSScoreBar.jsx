import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { calculateATSScore } from '../../utils/atsScoring';

export default function ATSScoreBar({ data }) {
  const score = useMemo(() => calculateATSScore(data), [data]);

  // Determine color based on score
  let color = "#ff4444"; // default red (poor)
  if (score >= 80) color = "#00ff88"; // green (excellent)
  else if (score >= 50) color = "#ffcc00"; // yellow (fair)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 200 }} title="Optimized for Applicant Tracking Systems">
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>ATS SCORE</span>
          <span style={{ fontSize: 11, fontWeight: 800, color }}>{score}/100</span>
        </div>
        <div style={{ height: 6, width: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ 
               height: '100%', 
               background: color, 
               boxShadow: `0 0 10px ${color}88`,
               borderRadius: 4
            }}
          />
        </div>
      </div>
    </div>
  );
}
