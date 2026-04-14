export default function renderMicrosoftAzure(data) {
    const { personal = {}, footer = {} } = data;
    const layout = data.layout || [];
    
    // Build contact links
    const contactParts = [];
    if (personal?.location)  contactParts.push(`<span>${personal.location}</span>`);
    if (personal?.phone)     contactParts.push(`<span>${personal.phone}</span>`);
    if (personal?.email)     contactParts.push(`<span>${personal.email}</span>`);
    if (personal?.website)   contactParts.push(`<span><a href="${personal.website}" target="_blank" rel="noopener noreferrer">${personal.website.replace(/^https?:\/\//, '')}</a></span>`);
    if (personal?.github)    contactParts.push(`<span><a href="${personal.github}" target="_blank" rel="noopener noreferrer">${personal.github.replace(/^https?:\/\//, '')}</a></span>`);
    if (personal?.linkedin)  contactParts.push(`<span><a href="${personal.linkedin}" target="_blank" rel="noopener noreferrer">${personal.linkedin.replace(/^https?:\/\//, '')}</a></span>`);
    const contactStr = contactParts.join('<span class="sep">|</span>');

    const sections = [];

    layout.forEach(sec => {
        if (sec.id === 'personal' || sec.id === 'footer') return;

        let htmlChunks = '';
        const secData = data[sec.id];
        
        if (sec.type === 'textarea') {
            htmlChunks = `<div class="summary-text">${secData || ''}</div>`;
            if (secData) sections.push({ title: sec.label, html: htmlChunks });
            return;
        }

        if (!secData || !Array.isArray(secData)) return;

        if (sec.type === 'skills-repeater') {
            htmlChunks = secData.filter(s => s.category || s.items).map(s => `<div class="skill-group"><div class="skill-cat">${s.category || ''}</div><div class="skill-items">${s.items || ''}</div></div>`).join('\n');
            if (htmlChunks) sections.push({ title: sec.label, html: `<div class="skills-wrapper">\n${htmlChunks}\n</div>` });

        } else if (sec.type === 'bullet-repeater') {
            htmlChunks = secData.filter(s => s.text).map(m => `<li>${m.text}</li>`).join('\n');
            // Check if it's certifications layout style (starts with ✓)
            if (sec.id.includes('cert')) {
                if (htmlChunks) sections.push({ title: sec.label, html: `<ul class="cert-list">\n${htmlChunks}\n</ul>` });
            } else {
                if (htmlChunks) sections.push({ title: sec.label, html: `<ul class="plain-list">\n${htmlChunks}\n</ul>` });
            }

        } else if (sec.type === 'exp-repeater') {
            htmlChunks = secData.map(exp => {
                let bullets = exp.bullets || [];
                if (typeof bullets === 'string') bullets = bullets.split('\n');
                const liHTML = bullets.filter(b => b.trim()).map(b => `<li>${b.trim()}</li>`).join('\n');
                
                if (!exp.jobTitle && !exp.company && !liHTML) return '';

                return `
                <div class="exp-item">
                    <div class="exp-header">
                        <span class="exp-role">${exp.jobTitle || ''}${exp.company ? ' | ' + exp.company : ''}</span>
                        <span class="exp-date">${exp.startDate || ''} ${exp.endDate ? '– ' + exp.endDate : ''} ${exp.duration ? '(' + exp.duration + ')' : ''}</span>
                    </div>
                    ${exp.companyNote ? `<div class="exp-company">${exp.companyNote}</div>` : ''}
                    ${liHTML ? `<div class="exp-desc"><ul>${liHTML}</ul></div>` : ''}
                </div>`;
            }).join('\n');
            if (htmlChunks) sections.push({ title: sec.label, html: htmlChunks });

        } else if (sec.type === 'project-repeater') {
            htmlChunks = secData.map(proj => {
                let bullets = proj.bullets || [];
                if (typeof bullets === 'string') bullets = bullets.split('\n');
                const desc = bullets.filter(b => b.trim()).map(b => b.trim()).join(' ') || proj.description || '';
                const tech = proj.subtitle || '';
                if (!proj.title && !desc) return '';
                return `
                <div class="project-card">
                    <div class="project-title">${proj.title}</div>
                    ${tech ? `<div class="project-tech">${tech}</div>` : ''}
                    ${desc ? `<div class="project-desc">${desc}</div>` : ''}
                </div>`;
            }).join('\n');
            if (htmlChunks) sections.push({ title: sec.label, html: `<div class="projects-grid">\n${htmlChunks}\n</div>` });

        } else if (sec.type === 'edu-repeater') {
            htmlChunks = secData.map(edu => {
                const meta = [edu.cgpa ? 'CGPA: ' + edu.cgpa : '', edu.date || ''].filter(Boolean).join(' · ');
                if (!edu.degree && !edu.school) return '';
                return `
                <div class="edu-item">
                    <div class="edu-degree">${edu.degree || ''}</div>
                    <div class="edu-school">${edu.school || ''}${edu.location ? ', ' + edu.location : ''}</div>
                    ${meta ? `<div class="edu-meta">${meta}</div>` : ''}
                </div>`;
            }).join('\n');
            if (htmlChunks) sections.push({ title: sec.label, html: htmlChunks });
        }
    });

    const footerText = footer?.tagline || ('Full Stack Developer | ' + new Date().getFullYear());

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>${personal?.fullName || 'Resume'} · ATS Resume · Clean Corporate</title>
    <style>
        /* ----- CORPORATE ATS OPTIMIZED · SINGLE COLUMN · HIGH SCANNABILITY ----- */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: #eef2f5;
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #000000;
            padding: 2rem 1rem;
        }

        .resume {
            max-width: 880px;
            margin: 0 auto;
            background: white;
            padding: 2rem 2.2rem;
            border: 1px solid #000000;
        }

        /* header */
        .header {
            text-align: left;
            margin-bottom: 1.2rem;
            border-bottom: 2px solid #000000;
            padding-bottom: 1rem;
        }
        .name {
            font-size: 2.2rem;
            font-weight: 700;
            letter-spacing: -0.3px;
            color: #000000;
            margin-bottom: 0.2rem;
            text-transform: uppercase;
        }
        .title {
            font-size: 0.9rem;
            font-weight: 600;
            color: #000000;
            margin-bottom: 0.4rem;
        }
        .contact {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem 0.6rem;
            font-size: 0.75rem;
            color: #333333;
            margin-top: 0.3rem;
            align-items: center;
        }
        .contact span, .contact a {
            color: #000000;
            text-decoration: none;
        }
        .contact a { text-decoration: underline; text-underline-offset: 2px; }
        .sep { color: #888; margin: 0 0.2rem; }

        /* sections */
        .section { margin-bottom: 1.4rem; }
        .section-title {
            font-size: 0.9rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #000000;
            border-bottom: 1px solid #000000;
            padding-bottom: 0.2rem;
            margin-bottom: 0.7rem;
        }

        /* summary */
        .summary-text {
            font-size: 0.84rem;
            line-height: 1.5;
            color: #1a1a1a;
        }

        /* skills grid */
        .skills-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem 1rem;
        }
        .skill-group { flex: 1; min-width: 180px; }
        .skill-cat { font-weight: 700; font-size: 0.78rem; color: #000000; margin-bottom: 0.2rem; }
        .skill-items { font-size: 0.8rem; line-height: 1.4; color: #222222; }

        /* experience */
        .exp-item { margin-bottom: 1.2rem; }
        .exp-header {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0.15rem;
        }
        .exp-role { font-weight: 700; font-size: 0.88rem; color: #000000; }
        .exp-company { font-weight: 600; font-size: 0.82rem; color: #000000; margin-bottom: 0.2rem; }
        .exp-date { font-size: 0.72rem; font-weight: normal; color: #4a4a4a; }
        .exp-desc { margin-top: 0.3rem; }
        .exp-desc ul, .plain-list { list-style: none; padding-left: 0; }
        .exp-desc li, .plain-list li {
            font-size: 0.82rem;
            margin-bottom: 0.45rem;
            position: relative;
            padding-left: 1.2rem;
            line-height: 1.45;
            color: #222222;
        }
        .exp-desc li::before, .plain-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #000000;
            font-weight: bold;
        }

        /* projects grid */
        .projects-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 1.2rem;
            margin-top: 0.2rem;
        }
        .project-card {
            flex: 1;
            min-width: 200px;
            background: #fefefe;
            border-left: 2px solid #000000;
            padding-left: 0.8rem;
        }
        .project-title { font-weight: 700; font-size: 0.84rem; color: #000000; margin-bottom: 0.2rem; }
        .project-tech { font-size: 0.7rem; color: #4a4a4a; margin-bottom: 0.3rem; }
        .project-desc { font-size: 0.78rem; line-height: 1.4; color: #222222; }

        /* education + certs */
        .edu-item { margin-bottom: 0.8rem; }
        .edu-degree { font-weight: 700; font-size: 0.85rem; color: #000000; }
        .edu-school { font-weight: 500; font-size: 0.8rem; color: #222222; }
        .edu-meta { font-size: 0.72rem; color: #4a4a4a; }

        .cert-list {
            list-style: none;
            padding-left: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem 1rem;
        }
        .cert-list li {
            font-size: 0.8rem;
            position: relative;
            padding-left: 1rem;
        }
        .cert-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #000000;
            font-weight: bold;
        }

        .footer {
            margin-top: 1rem;
            font-size: 0.65rem;
            color: #666666;
            text-align: center;
            border-top: 1px solid #cccccc;
            padding-top: 0.6rem;
        }

        hr { display: none; }

        a { color: #000000; text-decoration: underline; text-underline-offset: 2px; }
        a:hover { text-decoration-thickness: 1.5px; }

        @media (max-width: 650px) {
            .resume { padding: 1.2rem; }
            .exp-header { flex-direction: column; gap: 0.2rem; }
            .skills-wrapper { flex-direction: column; gap: 0.5rem; }
            .projects-grid { flex-direction: column; }
        }

        @media print {
            body { background: #fff; padding: 0; }
            .resume { border: none; padding: 1.5rem; max-width: 100%; }
        }
    </style>
</head>
<body>
<div class="resume">

    <!-- HEADER -->
    <div class="header">
        ${personal.fullName ? `<div class="name">${personal.fullName}</div>` : ''}
        ${personal.targetRole || personal.openTo ? `<div style="font-size: 0.85rem; font-weight: 600; color: #333; margin-bottom: 0.3rem;">🎯 ${personal.targetRole ? `Target Role: ${personal.targetRole}` : ''} ${personal.openTo ? `| Open to ${personal.openTo}` : ''}</div>` : ''}
        ${personal.professionalTitle || personal.currentRole || personal.subhead ? `<div class="title">${[personal.professionalTitle, personal.currentRole, personal.subhead].filter(Boolean).join(' | ')}</div>` : ''}
        <div class="contact">
            ${contactStr}
        </div>
    </div>

    ${sections.map(sec => `
    <div class="section">
        <div class="section-title">${sec.title}</div>
        ${sec.html}
    </div>`).join('\n')}

    <!-- FOOTER -->
    <div class="footer">${footerText}</div>

</div>
</body>
</html>`;
}
