export default function renderAmazonSDE(data) {
  const { personal = {}, footer = {} } = data;
  const layout = data.layout || [];

  const mainSections = [];
  const leftSections = [];
  const rightSections = [];

  const defaultSkills = `<div class="skills-cat">Languages</div><div class="skills-items">Java, Golang, Python, TypeScript</div>
          <div class="skills-cat">Backend & APIs</div><div class="skills-items">Node.js, Spring Boot, REST, GraphQL</div>
          <div class="skills-cat">Cloud & Databases</div><div class="skills-items">AWS (EC2, S3, RDS), PostgreSQL, Redis</div>
          <div class="skills-cat">DevOps & Tools</div><div class="skills-items">Docker, Kubernetes, Jenkins, Git</div>`;

  layout.forEach(sec => {
     if (sec.id === 'personal' || sec.id === 'footer') return;

     let htmlChunks = '';
     const secData = data[sec.id];
     
     if (sec.type === 'textarea') {
         htmlChunks = `<div class="summary-text">${secData || 'Senior Software Engineer with 8+ years of experience designing scalable distributed systems.'}</div>`;
         mainSections.push({ title: sec.label, html: htmlChunks, type: sec.type });
         return;
     }
     
     if (!secData || !Array.isArray(secData)) return; // repeaters only from here

     if (sec.type === 'skills-repeater') {
         htmlChunks = secData.filter(s => s.category || s.items).map(s => `<div class="skills-cat">${s.category || 'Category'}</div><div class="skills-items">${s.items || ''}</div>`).join('\n');
         leftSections.push({ title: sec.label, html: htmlChunks || defaultSkills });
         
     } else if (sec.type === 'bullet-repeater') {
         htmlChunks = secData.filter(s => s.text).map(s => `<li>${s.text}</li>`).join('\n');
         if (htmlChunks) leftSections.push({ title: sec.label, html: `<ul class="plain-list">${htmlChunks}</ul>` });
         
     } else if (sec.type === 'exp-repeater') {
         htmlChunks = secData.map(exp => {
            let bullets = exp.bullets || [];
            if (typeof bullets === 'string') bullets = bullets.split('\n');
            const bulletHTML = bullets.filter(b => b.trim()).map(b => `<li>${b.trim()}</li>`).join('\n');
            if (!exp.jobTitle && !exp.company && !bulletHTML) return '';
            return `
              <div class="exp-entry">
                <div class="exp-header">
                  <div>
                    <span class="exp-role">${exp.jobTitle || 'Role'}</span>
                    <span class="exp-company"> | ${exp.company || 'Company'}</span>
                  </div>
                  <div class="exp-date">${exp.startDate || 'Start'} – ${exp.endDate || 'Present'}${exp.duration ? ` (${exp.duration})` : ''}</div>
                </div>
                <ul class="exp-list">${bulletHTML}</ul>
              </div>`;
         }).join('\n');
         if (htmlChunks) rightSections.push({ title: sec.label, html: htmlChunks });
         
     } else if (sec.type === 'project-repeater') {
         htmlChunks = secData.map(proj => {
            let bullets = proj.bullets || [];
            if (typeof bullets === 'string') bullets = bullets.split('\n');
            const bulletHTML = bullets.filter(b => b.trim()).map(b => `<li>${b.trim()}</li>`).join('\n');
            if (!proj.title && !bulletHTML) return '';
            return `
              <div class="exp-entry">
                <div class="exp-header">
                  <div>
                    <span class="exp-role">${proj.title || 'Project'}</span>
                    ${proj.subtitle ? `<span class="exp-company"> | ${proj.subtitle}</span>` : ''}
                  </div>
                  <div class="exp-date">${proj.startDate || ''} ${proj.endDate ? `– ${proj.endDate}` : ''}</div>
                </div>
                <ul class="exp-list">${bulletHTML}</ul>
              </div>`;
         }).join('\n');
         if (htmlChunks) rightSections.push({ title: sec.label, html: htmlChunks });
         
     } else if (sec.type === 'edu-repeater') {
         htmlChunks = secData.map(edu => {
            if (!edu.degree && !edu.school) return '';
            return `
              <div class="edu-details">
                <div class="edu-title">${edu.degree || 'Degree'}</div>
                <div class="edu-meta">${edu.school || 'School'}, ${edu.location || 'Location'} ${edu.cgpa ? `| CGPA: ${edu.cgpa}` : ''}</div>
                ${edu.date || edu.coursework ? `<div class="edu-meta">Graduation: ${edu.date || '2020'} ${edu.coursework ? `· Relevant coursework: ${edu.coursework}` : ''}</div>` : ''}
              </div>`;
         }).join('\n');
         if (htmlChunks) rightSections.push({ title: sec.label, html: htmlChunks });
     }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>${personal.fullName || 'John Doe - ATS Optimized Resume'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f2f4f6;
      font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      color: #000000;
      padding: 2rem 1rem;
    }
    .ats-resume {
      max-width: 100%;
      margin: 0 auto;
      background: white;
      border: none;
      padding: 1.5rem 2rem;
      border-radius: 0px;
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #111;
      margin-bottom: 0.1rem;
      text-transform: uppercase;
      text-align: center;
    }
    .subhead {
      font-size: 1rem;
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 0.4rem;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.3rem;
      text-align: center;
    }
    .contact-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin: 0.4rem 0 0.8rem 0;
      font-size: 0.85rem;
      color: #1e2f3e;
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 0.6rem;
    }
    .contact-bar a {
      color: #0a5b83;
      text-decoration: none;
      border-bottom: none;
    }
    .contact-bar span, .contact-bar a {
      font-weight: 400;
    }
    .section { margin: 1.5rem 0 1.8rem 0; }
    .section-title {
      font-size: 1.2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #2c3e50;
      padding-bottom: 0.3rem;
      margin-bottom: 1rem;
      color: #000;
    }
    .summary-text {
      font-size: 0.94rem;
      background: transparent;
      padding: 0;
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    .two-col-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      margin: 0.5rem 0 0.2rem;
    }
    .col-left {
      flex: 1.2;
      min-width: 220px;
    }
    .col-right {
      flex: 2.2;
      min-width: 260px;
    }
    .skills-block { margin-bottom: 1.2rem; }
    .skills-cat {
      font-weight: 700;
      font-size: 0.85rem;
      margin: 0.75rem 0 0.3rem 0;
      color: #000;
      border-left: 2px solid #aaa;
      padding-left: 8px;
    }
    .skills-items {
      font-size: 0.88rem;
      line-height: 1.45;
      margin-bottom: 0.5rem;
      color: #1f2f3a;
      display: block;
    }
    .plain-list {
      list-style: none;
      margin-left: 0;
      padding-left: 0;
    }
    .plain-list li {
      margin-bottom: 0.3rem;
      position: relative;
      padding-left: 1rem;
      font-size: 0.89rem;
    }
    .plain-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #2c3e50;
      font-weight: bold;
    }
    .exp-entry { margin-bottom: 1.6rem; }
    .exp-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.3rem;
    }
    .exp-role {
      font-weight: 700;
      font-size: 1rem;
      color: #000;
    }
    .exp-company {
      font-weight: 600;
      color: #1f5e8c;
    }
    .exp-date {
      font-size: 0.8rem;
      font-weight: normal;
      color: #4b5e6c;
    }
    .exp-list {
      margin-top: 0.5rem;
      padding-left: 1.2rem;
    }
    .exp-list li {
      margin-bottom: 0.55rem;
      font-size: 0.89rem;
      line-height: 1.45;
    }
    .metric {
      font-weight: 700;
      color: #000;
    }
    .edu-details { margin-top: 0.2rem; margin-bottom: 1.2rem; }
    .edu-title {
      font-weight: 700;
      font-size: 1rem;
    }
    .edu-meta {
      font-size: 0.85rem;
      color: #2c3e50;
      margin-top: 0.2rem;
    }
    hr {
      margin: 1rem 0;
      border: 0;
      border-top: 1px solid #e2e8f0;
    }
    @media (max-width: 700px) {
      .ats-resume { padding: 1.2rem; }
      .exp-header { flex-direction: column; gap: 0.2rem; }
    }
    a { word-break: break-word; }
    .no-badge, .no-icon { all: unset; }
    
    @media print {
      body { background: #fff; padding: 0; }
      .ats-resume { box-shadow: none; border: none; padding: 1.5rem 2rem; max-width: 100%; }
    }
  </style>
</head>
<body>
<div class="ats-resume">
  ${personal.fullName ? `<h1>${personal.fullName}</h1>` : ''}
  
  ${personal.professionalTitle || personal.subhead || personal.currentRole ? `<div class="subhead">${[personal.professionalTitle, personal.subhead, personal.currentRole].filter(Boolean).join(' | ')}</div>` : ''}

  <div class="contact-bar">
    ${personal.location ? `<span>📍 ${personal.location}</span>` : ''}
    ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ''}
    ${personal.email ? `<span>✉️ <a href="mailto:${personal.email}">${personal.email}</a></span>` : ''}
    ${personal.github ? `<span>GitHub: <a href="https://${personal.github.replace(/^https?:\/\//, '')}" target="_blank">${personal.github.replace(/^https?:\/\//, '')}</a></span>` : ''}
    ${personal.linkedin ? `<span>LinkedIn: <a href="https://${personal.linkedin.replace(/^https?:\/\//, '')}" target="_blank">${personal.linkedin.replace(/^https?:\/\//, '')}</a></span>` : ''}
    ${personal.website ? `<span>Portfolio: <a href="https://${personal.website.replace(/^https?:\/\//, '')}" target="_blank">${personal.website.replace(/^https?:\/\//, '')}</a></span>` : ''}
  </div>

  ${mainSections.map(sec => `
  <div class="section">
    <div class="section-title">${sec.title}</div>
    ${sec.html}
  </div>`).join('\n')}

  <div class="two-col-grid">
    <div class="col-left">
      ${leftSections.map((sec, i) => `
      <div class="section" ${i===0 ? 'style="margin-top: 0;"' : ''}>
        <div class="section-title">${sec.title}</div>
        ${sec.html}
      </div>`).join('\n')}
    </div>

    <div class="col-right">
      ${rightSections.map((sec, i) => `
      <div class="section" ${i===0 ? 'style="margin-top: 0;"' : ''}>
        <div class="section-title">${sec.title}</div>
        ${sec.html}
      </div>`).join('\n')}
    </div>
  </div>

  <hr />
  <div style="font-size: 0.75rem; color: #4b5563; text-align: left; margin-top: 0.8rem;">
    ${footer.skillsHighlight || footer.tagline || 'John Doe | Senior Software Engineer'} ${footer.yearsExperience ? `| ${footer.yearsExperience}` : '| 8+ Years Experience'}
  </div>
</div>
</body>
</html>`;
}
