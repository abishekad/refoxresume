export default function renderGoogleSWE(data) {
  const { personal = {}, footer = {} } = data;
  const layout = data.layout || [];
  
  const sections = [];

  const defaultSkills = `<div class="skill-line"><span class="skill-cat">Languages:</span> <span class="skill-items">JavaScript, TypeScript, Python, SQL</span></div>
      <div class="skill-line"><span class="skill-cat">Frontend:</span> <span class="skill-items">React.js, Next.js, HTML5/CSS3, Tailwind CSS</span></div>
      <div class="skill-line"><span class="skill-cat">Backend:</span> <span class="skill-items">Node.js, Express, Django</span></div>`;

  layout.forEach(sec => {
    if (sec.id === 'personal' || sec.id === 'footer') return;

    let htmlChunks = '';
    const secData = data[sec.id];
    
    if (sec.type === 'textarea') {
      htmlChunks = `<div class="summary-text">${secData || 'Results-driven Full Stack Developer with 5+ years of experience building scalable web applications.'}</div>`;
      sections.push({ title: sec.label, html: htmlChunks });
      return;
    }

    if (!secData || !Array.isArray(secData)) return;

    if (sec.type === 'skills-repeater') {
      htmlChunks = secData.filter(s => s.category || s.items).map(s => `<div class="skill-line"><span class="skill-cat">${s.category || 'Category'}:</span> <span class="skill-items">${s.items || ''}</span></div>`).join('\n');
      sections.push({ title: sec.label, html: `<div class="skills-grid">\n${htmlChunks || defaultSkills}\n</div>` });

    } else if (sec.type === 'bullet-repeater') {
      htmlChunks = secData.filter(s => s.text).map(m => `<li>${m.text}</li>`).join('\n');
      if (htmlChunks) {
         // Google SWE uses projects-list style for bullets, it's cool
         sections.push({ title: sec.label, html: `<ul class="projects-list">\n${htmlChunks}\n</ul>` });
      }

    } else if (sec.type === 'exp-repeater') {
      htmlChunks = secData.map(exp => {
        let bullets = exp.bullets || [];
        if (typeof bullets === 'string') bullets = bullets.split('\n');
        const bulletHTML = bullets.filter(b => b.trim()).map(b => `<li>${b.trim()}</li>`).join('\n');
        
        const role = exp.jobTitle || 'Role';
        const company = exp.company ? ` | ${exp.company}` : '';
        const startDate = exp.startDate || '';
        const endDate = exp.endDate ? `– ${exp.endDate}` : '';
        
        if (!exp.jobTitle && !exp.company && !bulletHTML) return '';

        return `
        <div class="exp-item">
          <div class="exp-header">
            <span class="exp-role">${role}${company}</span>
            <span class="exp-date">${startDate} ${endDate}${exp.duration ? ` (${exp.duration})` : ''}</span>
          </div>
          <div class="exp-desc">
            <ul>
              ${bulletHTML}
            </ul>
          </div>
        </div>`;
      }).join('\n');
      if (htmlChunks) sections.push({ title: sec.label, html: htmlChunks });

    } else if (sec.type === 'project-repeater') {
      htmlChunks = secData.map(proj => {
        let bullets = proj.bullets || [];
        if (typeof bullets === 'string') bullets = bullets.split('\n');
        const desc = proj.description || bullets.join(' ');
        const title = proj.title || 'Project';
        if (!proj.title && !desc) return '';
        return `<li><strong>${title}:</strong> ${desc}</li>`;
      }).join('\n');
      if (htmlChunks) {
        sections.push({ title: sec.label, html: `<ul class="projects-list">\n${htmlChunks}\n</ul>` });
      }

    } else if (sec.type === 'edu-repeater') {
      htmlChunks = secData.map(edu => {
        const degree = edu.degree || 'Degree';
        const school = edu.school || 'School';
        if (!edu.degree && !edu.school) return '';
        return `
        <div class="edu-detail">
          <div class="edu-degree">${degree}</div>
          <div class="edu-college">${school}, ${edu.location || ''}</div>
          ${edu.cgpa ? `<div class="edu-cgpa">${edu.cgpa}</div>` : ''}
        </div>`;
      }).join('\n');
      if (htmlChunks) sections.push({ title: sec.label, html: htmlChunks });
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>${personal.fullName || 'Google SWE Template'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #eef2f5;
      font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      color: #1a2c3e;
      padding: 2rem 1rem;
    }

    .resume {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border: 1px solid #d0d7de;
      padding: 2rem 2.2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }

    .name {
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: #0a2942;
      margin-bottom: 0.2rem;
      text-transform: uppercase;
    }

    .target-role {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e6b3e;
      background: #e6f4ea;
      display: inline-block;
      padding: 0.2rem 0.8rem;
      border-radius: 20px;
      margin: 0.3rem 0 0.6rem 0;
    }

    .title {
      font-size: 1rem;
      font-weight: 500;
      color: #2c6e9e;
      margin-bottom: 0.5rem;
    }

    .location-line {
      font-size: 0.85rem;
      color: #7b2c45;
      margin-bottom: 0.8rem;
    }

    .contact-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1.2rem;
      margin-bottom: 1.2rem;
      font-size: 0.85rem;
      color: #2c3e4e;
      background: #f8fafc;
      padding: 0.7rem 1rem;
      border-radius: 6px;
    }
    .contact-row span, .contact-row a {
      color: #1e5a7d;
      text-decoration: none;
    }
    .contact-row a:hover {
      text-decoration: underline;
    }

    .section {
      margin: 1.4rem 0 1.6rem 0;
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 0.3rem;
      margin-bottom: 0.9rem;
      color: #0f3b54;
    }

    .summary-text {
      font-size: 0.92rem;
      line-height: 1.55;
      background: #fefefe;
      padding: 0.2rem 0;
    }

    .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .skill-line {
      font-size: 0.9rem;
    }
    .skill-cat {
      font-weight: 700;
      color: #0f3b54;
      display: inline-block;
      min-width: 150px;
    }
    .skill-items {
      display: inline;
    }

    .exp-item {
      margin-bottom: 1.6rem;
    }
    .exp-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.4rem;
    }
    .exp-role {
      font-weight: 700;
      font-size: 1rem;
      color: #0c2e44;
    }
    .exp-date {
      font-size: 0.78rem;
      font-weight: normal;
      color: #5c6f82;
      background: #f0f4f9;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
    }
    .exp-desc {
      margin-top: 0.5rem;
      padding-left: 1rem;
    }
    .exp-desc ul {
      list-style: none;
      padding-left: 0;
    }
    .exp-desc li {
      font-size: 0.88rem;
      margin-bottom: 0.45rem;
      position: relative;
      padding-left: 1.2rem;
      line-height: 1.45;
    }
    .exp-desc li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #2c7cb6;
      font-weight: bold;
    }

    .projects-list {
      list-style: none;
      padding-left: 0;
    }
    .projects-list li {
      font-size: 0.88rem;
      margin-bottom: 0.5rem;
      position: relative;
      padding-left: 1.2rem;
    }
    .projects-list li::before {
      content: "▹";
      position: absolute;
      left: 0;
      color: #2c7cb6;
    }

    .edu-detail {
      margin-top: 0.2rem;
      margin-bottom: 1rem;
    }
    .edu-degree {
      font-weight: 700;
      font-size: 1rem;
    }
    .edu-college {
      font-size: 0.88rem;
      color: #2c3e50;
      margin: 0.2rem 0 0.1rem;
    }
    .edu-cgpa {
      font-size: 0.85rem;
      color: #4a627a;
    }

    hr {
      margin: 0.8rem 0;
      border: 0;
      border-top: 1px solid #e9edf2;
    }

    @media print {
      body { background: #fff; padding: 0; }
      .resume { box-shadow: none; border: none; padding: 1.5rem 2rem; max-width: 100%; }
    }
  </style>
</head>
<body>
<div class="resume">
  ${personal.fullName ? `<div class="name">${personal.fullName}</div>` : ''}
  
  ${personal.targetRole || personal.openTo ? `<div class="target-role">🎯 ${personal.targetRole ? `Target Role: ${personal.targetRole}` : ''} ${personal.openTo ? `| Open to ${personal.openTo}` : ''}</div>` : ''}
  
  ${personal.professionalTitle || personal.subhead || personal.currentRole ? `<div class="title">${[personal.professionalTitle, personal.subhead, personal.currentRole].filter(Boolean).join(' | ')}</div>` : ''}
  
  ${personal.location ? `<div class="location-line">📍 ${personal.location} ${personal.openToRemote ? '(Open to remote / relocation)' : ''}</div>` : ''}

  <div class="contact-row">
    ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ''}
    ${personal.email ? `<span>✉️ <a href="mailto:${personal.email}">${personal.email}</a></span>` : ''}
    ${personal.github ? `<span>🔗 GitHub: <a href="https://${personal.github.replace(/^https?:\/\//, '')}" target="_blank">${personal.github.replace(/^https?:\/\//, '')}</a></span>` : ''}
    ${personal.linkedin ? `<span>🔗 LinkedIn: <a href="https://${personal.linkedin.replace(/^https?:\/\//, '')}" target="_blank">${personal.linkedin.replace(/^https?:\/\//, '')}</a></span>` : ''}
    ${personal.website ? `<span>🔗 Portfolio: <a href="${personal.website.startsWith('http') ? personal.website : 'https://' + personal.website}" target="_blank">${personal.website.replace(/^https?:\/\//, '')}</a></span>` : ''}
  </div>

  ${sections.map(sec => `
  <div class="section">
    <div class="section-title">${sec.title}</div>
    ${sec.html}
  </div>`).join('\n')}

  <hr>
  <div style="font-size: 0.7rem; color: #8ba0ae; text-align: center; margin-top: 0.5rem;">
    ${footer.tagline || 'John Doe | Software Engineer Resume | 2024'} | ${footer.skillsHighlight || 'Full Stack Development'} | ${footer.yearsExperience || '5+ Years Experience'}
  </div>
</div>
</body>
</html>`;
}
