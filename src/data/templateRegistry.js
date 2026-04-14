import { createDefaultFormData, createGoogleFormData, createAmazonFormData, createMetaFormData, createAzureFormData, createAppleFormData } from './resumeSchema';
import renderGoogleSWE from './templates/GoogleSWE';
import renderAmazonSDE from './templates/AmazonSDE';
import renderClassicSerifResume from './templates/SerifClassic';
import renderMicrosoftAzure from './templates/MicrosoftAzure';
import renderAppleHardware from './templates/AppleHardware';

const resumeTemplates = [
  {
    id: 'google-swe',
    name: 'Google Software Engineer',
    tag: 'Selected 2025',
    type: 'TOP SELLER',
    color: '#00E396',
    badge: 'primary',
    score: 97,
    preview: '/template-google-swe.png',
    sections: [
      { id: 'personal', label: 'Personal Info', type: 'personal', fields: ['fullName','professionalTitle','phone','email','github','linkedin'] },
      { id: 'summary', label: 'Summary', type: 'textarea' },
      { id: 'skills', label: 'Technical Skills', type: 'skills-repeater' },
      { id: 'keyMetrics', label: 'Key Metrics & Scale', type: 'bullet-repeater' },
      { id: 'experience', label: 'Experience', type: 'exp-repeater' },
      { id: 'education', label: 'Education', type: 'edu-repeater' },
      { id: 'achievements', label: 'Achievements', type: 'bullet-repeater' },
      { id: 'footer', label: 'Footer Tagline', type: 'footer', fields: ['tagline'] }
    ],
    createDefaultFormData: createGoogleFormData,
    renderHTML: renderGoogleSWE,
  },
  {
    id: 'amazon-sde',
    name: 'Amazon SDE',
    tag: 'ATS Pass 98%',
    type: 'MOST POPULAR',
    color: '#FF9900',
    sub: 'ATS Passed 98%',
    score: 98,
    preview: '/template-amazon-sde.png',
    sections: [
      { id: 'personal', label: 'Personal Info', type: 'personal', fields: ['fullName','professionalTitle','phone','email','github','linkedin'] },
      { id: 'summary', label: 'Summary', type: 'textarea' },
      { id: 'skills', label: 'Technical Skills', type: 'skills-repeater' },
      { id: 'experience', label: 'Experience', type: 'exp-repeater' },
      { id: 'projects', label: 'Key Projects', type: 'project-repeater' },
      { id: 'education', label: 'Education', type: 'edu-repeater' },
      { id: 'certifications', label: 'Certifications', type: 'bullet-repeater' },
      { id: 'footer', label: 'Footer Tagline', type: 'footer' }
    ],
    createDefaultFormData: createAmazonFormData,
    renderHTML: renderAmazonSDE,
  },
  {
    id: 'meta-pm',
    name: 'Meta Software Engineer',
    tag: 'Real Offer Resume',
    type: 'TOP SELLER',
    color: '#0668E1',
    sub: 'Clean Typography',
    score: 99,
    preview: '/template-meta-pm.png',
    sections: [
      { id: 'personal', label: 'Personal Info', type: 'personal' },
      { id: 'summary', label: 'Summary', type: 'textarea' },
      { id: 'skills', label: 'Technical Skills', type: 'skills-repeater' },
      { id: 'experience', label: 'Experience', type: 'exp-repeater' },
      { id: 'projects', label: 'Projects', type: 'project-repeater' },
      { id: 'education', label: 'Education', type: 'edu-repeater' },
      { id: 'certifications', label: 'Certifications', type: 'bullet-repeater' },
      { id: 'footer', label: 'Footer Tagline', type: 'footer' }
    ],
    createDefaultFormData: createMetaFormData,
    renderHTML: renderClassicSerifResume,
  },
  {
    id: 'microsoft-azure',
    name: 'Microsoft Azure',
    tag: 'Tier-1 Approved',
    type: 'MINIMALIST',
    color: '#00A4EF',
    sub: 'Clean Structure',
    score: 96,
    preview: '/template-microsoft-azure.png',
    sections: [
      { id: 'personal', label: 'Personal Info', type: 'personal' },
      { id: 'summary', label: 'Summary', type: 'textarea' },
      { id: 'skills', label: 'Technical Skills', type: 'skills-repeater' },
      { id: 'experience', label: 'Experience', type: 'exp-repeater' },
      { id: 'projects', label: 'Projects', type: 'project-repeater' },
      { id: 'education', label: 'Education', type: 'edu-repeater' },
      { id: 'certifications', label: 'Certifications', type: 'bullet-repeater' },
      { id: 'footer', label: 'Footer', type: 'footer' }
    ],
    createDefaultFormData: createAzureFormData,
    renderHTML: renderMicrosoftAzure,
  },
  {
    id: 'apple-hardware',
    name: 'Apple Hardware',
    tag: 'Design-First ATS',
    type: 'DESIGNER PICK',
    color: '#2c5f2e',
    sub: 'Elegant Styling',
    score: 95,
    preview: '/template-apple-hardware.png',
    sections: [
      { id: 'personal', label: 'Personal Info', type: 'personal' },
      { id: 'summary', label: 'Summary', type: 'textarea' },
      { id: 'skills', label: 'Technical Skills', type: 'skills-repeater' },
      { id: 'experience', label: 'Experience', type: 'exp-repeater' },
      { id: 'projects', label: 'Projects', type: 'project-repeater' },
      { id: 'education', label: 'Education', type: 'edu-repeater' },
      { id: 'certifications', label: 'Certifications', type: 'bullet-repeater' },
      { id: 'achievements', label: 'Achievements', type: 'bullet-repeater' },
      { id: 'footer', label: 'Footer', type: 'footer' }
    ],
    createDefaultFormData: createAppleFormData,
    renderHTML: renderAppleHardware,
  },
];

export const TEMPLATE_REGISTRY = resumeTemplates.reduce((acc, tmpl) => {
  acc[tmpl.id] = tmpl;
  return acc;
}, {});

export { resumeTemplates, createDefaultFormData };
export default resumeTemplates;
