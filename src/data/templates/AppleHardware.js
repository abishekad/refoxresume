export default function renderAppleHardware(data) {
    const { personal = {}, footer = {} } = data;
    const layout = data.layout || [];

    // Contact lines (right-aligned header)
    const contactLines = [];
    if (personal?.location)  contactLines.push(`<div class="contact-line">${personal.location}</div>`);
    if (personal?.phone)     contactLines.push(`<div class="contact-line">${personal.phone}</div>`);
    if (personal?.email)     contactLines.push(`<div class="contact-line"><a href="mailto:${personal.email}">${personal.email}</a></div>`);
    if (personal?.website)   contactLines.push(`<div class="contact-line"><a href="${personal.website}" target="_blank" rel="noopener noreferrer">${personal.website.replace(/^https?:\/\//, '')}</a></div>`);
    if (personal?.github)    contactLines.push(`<div class="contact-line"><a href="${personal.github}" target="_blank" rel="noopener noreferrer">${personal.github.replace(/^https?:\/\//, '')}</a></div>`);
    if (personal?.linkedin)  contactLines.push(`<div class="contact-line"><a href="${personal.linkedin}" target="_blank" rel="noopener noreferrer">${personal.linkedin.replace(/^https?:\/\//, '')}</a></div>`);

    const leftColHTML = [];
    const rightColHTML = [];

    layout.forEach(sec => {
        if (sec.id === 'personal' || sec.id === 'footer') return;

        let htmlChunk = '';
        const secData = data[sec.id];
        
        if (sec.type === 'textarea') {
            htmlChunk = `<p class="summary-text">${secData || ''}</p>`;
            if (secData) leftColHTML.push({ title: sec.label, html: htmlChunk });

        } else if (sec.type === 'exp-repeater') {
            if (!secData || !Array.isArray(secData)) return;
            htmlChunk = secData.map(exp => {
                let bullets = exp.bullets || [];
                if (typeof bullets === 'string') bullets = bullets.split('\n');
                const liHTML = bullets.filter(b => b.trim()).map(b => `<li>${b.trim()}</li>`).join('\n                ');
                
                if (!exp.jobTitle && !exp.company && !liHTML) return '';

                return `
                <div class="exp-item">
                    <div class="exp-role-line">
                        <span class="exp-role">${exp.jobTitle || ''}</span>
                        <span class="exp-date">${exp.startDate || ''}${exp.endDate ? ' \u2013 ' + exp.endDate : ''}${exp.duration ? ' (' + exp.duration + ')' : ''}</span>
                    </div>
                    ${exp.company ? `<div class="exp-company">${exp.company}${exp.location ? ', ' + exp.location : ''}</div>` : ''}
                    ${liHTML ? `<div class="exp-desc"><ul>${liHTML}</ul></div>` : ''}
                </div>`;
            }).join('\n');
            if (htmlChunk) leftColHTML.push({ title: sec.label, html: htmlChunk });

        } else if (sec.type === 'bullet-repeater') {
            if (!secData || !Array.isArray(secData)) return;
            const liHTML = secData.filter(m => m.text && m.text.trim()).map(m => `<li>${m.text.trim()}</li>`).join('\n                ');
            if (!liHTML) return;

            if (sec.id.includes('cert')) {
                const certs = secData.map(c => `<div class="cert-item">${c.text || c.name || ''}</div>`).join('\n            ');
                rightColHTML.push({ title: sec.label, html: certs });
            } else if (sec.id.includes('achieve') || sec.id === 'bullet-repeater') { 
                // typically achievements on left in Apple template, or right if metrics
                // let's put custom bullets on the right to balance textarea and experience on the left
                rightColHTML.push({ title: sec.label, html: `<div class="exp-desc"><ul>\n${liHTML}\n</ul></div>` });
            } else {
                rightColHTML.push({ title: sec.label, html: `<div class="exp-desc"><ul>\n${liHTML}\n</ul></div>` });
            }

        } else if (sec.type === 'skills-repeater') {
            if (!secData || !Array.isArray(secData)) return;
            htmlChunk = secData.filter(s => s.category || s.items).map(s => {
                return `<div class="skill-row"><div class="skill-cat">${s.category || 'Category'}</div><div class="skill-val">${s.items || ''}</div></div>`;
            }).join('\n            ');
            if (htmlChunk) rightColHTML.push({ title: sec.label, html: htmlChunk });

        } else if (sec.type === 'project-repeater') {
            if (!secData || !Array.isArray(secData)) return;
            htmlChunk = secData.map(proj => {
                let bullets = proj.bullets || [];
                if (typeof bullets === 'string') bullets = bullets.split('\n');
                const desc = bullets.filter(b => b.trim()).map(b => b.trim()).join(' ') || proj.description || '';
                if (!proj.title && !desc) return '';
                return `
                    <div class="proj-item">
                        <div class="proj-title">${proj.title}</div>
                        ${proj.subtitle ? `<div class="proj-tech">${proj.subtitle}</div>` : ''}
                        ${desc ? `<div class="proj-desc">${desc}</div>` : ''}
                    </div>`;
            }).join('\n');
            if (htmlChunk) rightColHTML.push({ title: sec.label, html: htmlChunk });

        } else if (sec.type === 'edu-repeater') {
            if (!secData || !Array.isArray(secData)) return;
            htmlChunk = secData.map(edu => {
                const meta = [edu.cgpa ? 'CGPA: ' + edu.cgpa : '', edu.date || ''].filter(Boolean).join(' \u00b7 ');
                if (!edu.degree && !edu.school) return '';
                return `
                    <div style="margin-bottom: 10px;">
                        <div class="edu-deg">${edu.degree || ''}</div>
                        <div class="edu-school">${edu.school || ''}${edu.location ? ', ' + edu.location : ''}</div>
                        ${meta ? `<div class="edu-meta">${meta}</div>` : ''}
                    </div>`;
            }).join('\n');
            if (htmlChunk) rightColHTML.push({ title: sec.label, html: htmlChunk });
        }
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${personal?.fullName || 'Resume'} \u00b7 Resume</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #e9ecef;
      font-family: 'Georgia', 'Times New Roman', serif;
      padding: 30px 16px;
      color: #111;
    }
    .page {
      max-width: 820px;
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 3px 20px rgba(0,0,0,0.13);
    }
    .top-bar {
      background: #2c5f2e;
      height: 7px;
    }
    .content { padding: 36px 52px 44px; }

    /* HEADER */
    .header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: start;
      border-bottom: 1px solid #ccc;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }
    .header-left h1 {
      font-family: 'Georgia', serif;
      font-size: 1.9rem;
      font-weight: 700;
      color: #111;
      letter-spacing: 0.5px;
    }
    .header-left .tagline {
      font-size: 0.80rem;
      color: #2c5f2e;
      font-weight: 700;
      font-family: 'Segoe UI', Arial, sans-serif;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .header-right {
      text-align: right;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .contact-line {
      font-size: 0.72rem;
      color: #444;
      margin-bottom: 3px;
      line-height: 1.5;
    }
    .contact-line a { color: #2c5f2e; text-decoration: none; }
    .contact-line a:hover { text-decoration: underline; }

    /* TWO COLUMN */
    .body-grid {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 0 32px;
    }

    /* SECTION */
    .section { margin-bottom: 18px; }
    .section-title {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #2c5f2e;
      margin-bottom: 8px;
      padding-bottom: 3px;
      border-bottom: 2px solid #2c5f2e;
    }
    .summary-text {
      font-size: 0.79rem;
      line-height: 1.6;
      color: #222;
      font-family: 'Georgia', serif;
    }

    /* EXPERIENCE */
    .exp-item { margin-bottom: 13px; }
    .exp-role-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .exp-role {
      font-size: 0.83rem;
      font-weight: 700;
      color: #111;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .exp-date {
      font-size: 0.69rem;
      color: #666;
      font-style: italic;
      font-family: 'Georgia', serif;
      white-space: nowrap;
    }
    .exp-company {
      font-size: 0.74rem;
      color: #2c5f2e;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .exp-desc ul { list-style: none; padding: 0; }
    .exp-desc li {
      font-size: 0.77rem;
      font-family: 'Georgia', serif;
      line-height: 1.55;
      color: #222;
      margin-bottom: 3px;
      padding-left: 12px;
      position: relative;
    }
    .exp-desc li::before {
      content: '\u2013';
      position: absolute;
      left: 0;
      color: #2c5f2e;
      font-weight: 700;
    }

    /* RIGHT COLUMN */
    .right-col { border-left: 1px solid #ddd; padding-left: 22px; }
    .rc-section { margin-bottom: 18px; }
    .rc-section-title {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #2c5f2e;
      border-bottom: 2px solid #2c5f2e;
      padding-bottom: 3px;
      margin-bottom: 8px;
    }
    .skill-row { margin-bottom: 8px; }
    .skill-cat {
      font-size: 0.66rem;
      font-weight: 700;
      font-family: 'Segoe UI', Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #444;
      margin-bottom: 2px;
    }
    .skill-val {
      font-size: 0.73rem;
      color: #222;
      font-family: 'Georgia', serif;
      line-height: 1.4;
    }
    .proj-item { margin-bottom: 10px; }
    .proj-title {
      font-size: 0.77rem;
      font-weight: 700;
      color: #111;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .proj-tech {
      font-size: 0.66rem;
      color: #666;
      font-style: italic;
      font-family: 'Georgia', serif;
      margin-bottom: 2px;
    }
    .proj-desc {
      font-size: 0.72rem;
      line-height: 1.4;
      color: #333;
      font-family: 'Georgia', serif;
    }
    .edu-deg {
      font-size: 0.78rem;
      font-weight: 700;
      color: #111;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .edu-school {
      font-size: 0.71rem;
      color: #444;
      font-family: 'Georgia', serif;
      margin-top: 1px;
    }
    .edu-meta {
      font-size: 0.67rem;
      color: #777;
      font-family: 'Georgia', serif;
      margin-top: 1px;
    }
    .cert-item {
      font-size: 0.72rem;
      color: #222;
      font-family: 'Georgia', serif;
      margin-bottom: 4px;
      padding-left: 10px;
      position: relative;
      line-height: 1.4;
    }
    .cert-item::before {
      content: '\u2713';
      position: absolute;
      left: 0;
      color: #2c5f2e;
      font-size: 0.65rem;
      font-weight: 700;
    }

    @media print {
      body { background: #fff; padding: 0; }
      .page { box-shadow: none; }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="top-bar"></div>
  <div class="content">

    <!-- HEADER -->
    <div class="header">
      <div class="header-left">
        ${personal.fullName ? `<h1>${personal.fullName}</h1>` : ''}
        ${personal.targetRole || personal.openTo ? `<div style="font-size: 0.75rem; color: #2c5f2e; font-weight: 600; margin-top: 4px; text-transform: uppercase;">🎯 ${personal.targetRole ? `Target Role: ${personal.targetRole}` : ''} ${personal.openTo ? `| Open to ${personal.openTo}` : ''}</div>` : ''}
        ${personal.professionalTitle || personal.currentRole || personal.subhead ? `<div class="tagline">${[personal.professionalTitle, personal.currentRole, personal.subhead].filter(Boolean).join(' | ')}</div>` : ''}
      </div>
      <div class="header-right">
        ${contactLines.join('\n        ')}
      </div>
    </div>

    <!-- BODY GRID -->
    <div class="body-grid">

      <!-- LEFT COLUMN -->
      <div class="left-col">
        ${leftColHTML.map(sec => `
        <div class="section">
          <div class="section-title">${sec.title}</div>
          ${sec.html}
        </div>`).join('\n')}
      </div>

      <!-- RIGHT COLUMN -->
      <div class="right-col">
        ${rightColHTML.map(sec => `
        <div class="rc-section">
          <div class="rc-section-title">${sec.title}</div>
          ${sec.html}
        </div>`).join('\n')}
      </div>

    </div><!-- end body-grid -->
  </div><!-- end content -->
</div>
</body>
</html>`;
}
