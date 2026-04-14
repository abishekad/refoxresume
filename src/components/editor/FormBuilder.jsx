import React from 'react';
import PersonalForm from './forms/PersonalForm';
import SummaryForm from './forms/SummaryForm';
import SkillsForm from './forms/SkillsForm';
import KeyMetricsForm from './forms/KeyMetricsForm';
import ExperienceForm from './forms/ExperienceForm';
import ProjectsForm from './forms/ProjectsForm';
import EducationForm from './forms/EducationForm';
import AchievementsForm from './forms/AchievementsForm';
import CertificationsForm from './forms/CertificationsForm';
import FooterForm from './forms/FooterForm';

const SECTION_MAP = {
  'personal': PersonalForm,
  'textarea': SummaryForm,
  'skills-repeater': SkillsForm,
  'bullet-repeater': KeyMetricsForm, // Fallback for generic bullets
  'exp-repeater': ExperienceForm,
  'project-repeater': ProjectsForm,
  'edu-repeater': EducationForm,
  'footer': FooterForm,
  // Direct mappings to maintain specific visual labels if desired
  'keyMetrics': KeyMetricsForm,
  'achievements': AchievementsForm,
  'certifications': CertificationsForm,
  'projects': ProjectsForm,
  'education': EducationForm,
  'experience': ExperienceForm,
  'skills': SkillsForm,
  'summary': SummaryForm,
};

export default function FormBuilder({ sectionConfig, data, onChange, onRename, onDelete }) {
  if (!sectionConfig) return null;

  // Determine component based on 'type' or fallback to 'id'
  const Component = SECTION_MAP[sectionConfig.type] || SECTION_MAP[sectionConfig.id];

  if (!Component) {
    return <div style={{color: 'red'}}>No UI component mapped for type: {sectionConfig.type || sectionConfig.id}</div>;
  }

  // Pass down the exact fields subset if the UI component needs it, 
  // though our custom forms handle their own dense layouts beautifully.
  const isRepeater = sectionConfig.type?.includes("repeater") || ['keyMetrics', 'achievements', 'certifications', 'projects', 'education', 'experience', 'skills'].includes(sectionConfig.id);
  const safeData = data[sectionConfig.id] || (isRepeater ? [] : {});

  return (
    <Component 
      data={safeData} 
      update={(payload) => onChange(sectionConfig.id, payload)} 
      fields={sectionConfig.fields}
      label={sectionConfig.label}
      onRename={(newVal) => onRename(sectionConfig.id, newVal)}
      onDelete={() => onDelete(sectionConfig.id)}
      id={sectionConfig.id}
    />
  );
}
