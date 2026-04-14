export default function renderClassicSerifResume(data) {
    const { personal = {}, footer = {} } = data;
    const layout = data.layout || [];

    const contactLinks = [];
    if (personal?.location) contactLinks.push(`<span>${personal.location}${personal.openToRemote ? ' (Open to remote / relocation)' : ''}</span>`);
    if (personal?.phone) contactLinks.push(`<span>${personal.phone}</span>`);
    if (personal?.email) contactLinks.push(`<span>${personal.email}</span>`);
    if (personal?.website) contactLinks.push(`<span>Portfolio: <a href="${personal.website}" target="_blank" rel="noopener noreferrer">${personal.website.replace(/^https?:\/\//, '')}</a></span>`);
    if (personal?.github) contactLinks.push(`<span>GitHub: <a href="${personal.github}" target="_blank" rel="noopener noreferrer">${personal.github.replace(/^https?:\/\//, '')}</a></span>`);
    if (personal?.linkedin) contactLinks.push(`<span>LinkedIn: <a href="${personal.linkedin}" target="_blank" rel="noopener noreferrer">${personal.linkedin.replace(/^https?:\/\//, '')}</a></span>`);

    const contactStr = contactLinks.join('\n        <span class="separator">|</span>\n        ');

    const sections = [];

    layout.forEach(sec => {
        if (sec.id === 'personal' || sec.id === 'footer') return;

        let htmlChunks = '';
        const secData = data[sec.id];
        
        if (sec.type === 'textarea') {
            htmlChunks = `<div class="summary-text">\n${secData || ''}\n</div>`;
            if (secData) sections.push({ title: sec.label, html: htmlChunks });
            return;
        }

        if (!secData || !Array.isArray(secData)) return;

        if (sec.type === 'skills-repeater') {
            htmlChunks = secData.filter(s => s.category || s.items).map(s => `<div class="skill-line"><span class="skill-cat">${s.category || 'Category'}:</span> <span class="skill-items">${s.items || ''}</span></div>`).join('\n');
            if (htmlChunks) sections.push({ title: sec.label, html: `<div class="skills-grid">\n${htmlChunks}\n</div>` });

        } else if (sec.type === 'bullet-repeater') {
            htmlChunks = secData.filter(s => s.text).map(m => `<li>${m.text}</li>`).join('\n');
            if (sec.id.includes('cert')) {
                if (htmlChunks) sections.push({ title: sec.label, html: `<ul class="cert-list">\n${htmlChunks}\n</ul>` });
            } else {
                if (htmlChunks) sections.push({ title: sec.label, html: `<ul class="achievements-list">\n${htmlChunks}\n</ul>` });
            }

        } else if (sec.type === 'exp-repeater') {
            htmlChunks = secData.map(exp => {
                let bullets = exp.bullets || [];
                if (typeof bullets === 'string') bullets = bullets.split('\n');
                const bulletHTML = bullets.filter(b => b.trim()).map(b => `<li>${b.trim()}</li>`).join('\n');
                
                if (!exp.jobTitle && !exp.company && !bulletHTML) return '';

                return `
                <div class="exp-item">
                    <div class="exp-header">
                        <span class="exp-role">${exp.jobTitle || ''} ${exp.company ? `| ${exp.company}` : ''}</span>
                        <span class="exp-date">${exp.startDate || ''} – ${exp.endDate || ''} ${exp.duration ? `(${exp.duration})` : ''}</span>
                    </div>
                    <div class="exp-desc">
                        ${bulletHTML ? `<ul>\n${bulletHTML}\n</ul>` : ''}
                    </div>
                </div>`;
            }).join('\n');
            if (htmlChunks) sections.push({ title: sec.label, html: htmlChunks });

        } else if (sec.type === 'project-repeater') {
            htmlChunks = secData.map(proj => {
                let bullets = proj.bullets || [];
                if (typeof bullets === 'string') bullets = bullets.split('\n');
                if (bullets.length === 0 && proj.description) {
                    bullets = [proj.description];
                }
                const bulletHTML = bullets.filter(b => b.trim()).map(b => `<li>${b.trim()}</li>`).join('\n');
                if (!proj.title && !bulletHTML) return '';

                return `
                <div class="project-item">
                    <div class="project-header">
                        <span class="project-title">${proj.title || ''}${proj.subtitle ? ` | ${proj.subtitle}` : ''}</span>
                        ${proj.startDate || proj.endDate ? `<span class="project-date">${proj.startDate ? `${proj.startDate} – ` : ''}${proj.endDate || 'Present'}</span>` : ''}
                    </div>
                    <div class="project-desc">
                        ${bulletHTML ? `<ul>\n${bulletHTML}\n</ul>` : ''}
                    </div>
                </div>`;
            }).join('\n');
            if (htmlChunks) sections.push({ title: sec.label, html: htmlChunks });

        } else if (sec.type === 'edu-repeater') {
            htmlChunks = secData.map(edu => {
                if (!edu.degree && !edu.school) return '';
                return `
                <div class="edu-item" style="margin-bottom: 0.8rem;">
                    <div class="edu-degree">${edu.degree || ''}</div>
                    <div class="edu-college">${edu.school || ''}${edu.location ? `, ${edu.location}` : ''}</div>
                    ${edu.cgpa ? `<div class="edu-cgpa">CGPA: ${edu.cgpa}</div>` : ''}
                </div>`;
            }).join('\n');
            if (htmlChunks) sections.push({ title: sec.label, html: htmlChunks });
        }
    });

    const footerTagline = footer?.tagline || ('Full Stack Developer | Professional Resume | ' + new Date().getFullYear());

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>${personal?.fullName || 'Resume'}</title>
    <style>
        /* ----- PROFESSIONAL ATS-FRIENDLY RESUME · BLACK & WHITE THEME · NO ICONS ----- */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #f0f2f5;
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.48;
            color: #000000;
            padding: 2rem 1rem;
        }

        .resume {
            max-width: 950px;
            margin: 0 auto;
            background: white;
            padding: 2rem 2.2rem;
            border: 1px solid #000000;
            box-shadow: none;
        }

        .name {
            font-size: 2.3rem;
            font-weight: 700;
            letter-spacing: -0.3px;
            color: #000000;
            margin-bottom: 0.3rem;
            text-transform: uppercase;
        }

        .target-role {
            font-size: 0.85rem;
            font-weight: 600;
            color: #000000;
            margin: 0.2rem 0 0.2rem;
            letter-spacing: 0.3px;
        }

        .title-line {
            font-size: 1rem;
            font-weight: 500;
            color: #000000;
            margin: 0.25rem 0 0.5rem;
            border-bottom: 1px solid #cccccc;
            padding-bottom: 0.5rem;
        }

        .contact-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin: 0.5rem 0 1.2rem 0;
            font-size: 0.8rem;
            color: #000000;
            border-bottom: 1px solid #dddddd;
            padding-bottom: 0.7rem;
        }
        .contact-row span, .contact-row a {
            color: #000000;
            text-decoration: none;
        }
        .contact-row a {
            text-decoration: underline;
            text-decoration-thickness: 0.5px;
            text-underline-offset: 2px;
        }
        .contact-row a:hover {
            text-decoration: underline;
            text-decoration-thickness: 1px;
        }
        .separator {
            color: #888888;
            margin: 0 0.2rem;
        }

        .section {
            margin-bottom: 1.4rem;
        }
        .section-title {
            font-size: 0.95rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #000000;
            border-bottom: 1.5px solid #000000;
            padding-bottom: 0.2rem;
            margin-bottom: 0.7rem;
        }

        .summary-text {
            font-size: 0.85rem;
            line-height: 1.5;
            color: #111111;
            margin-bottom: 0.2rem;
        }

        .skills-grid {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }
        .skill-line {
            font-size: 0.82rem;
            line-height: 1.45;
        }
        .skill-cat {
            font-weight: 700;
            color: #000000;
            display: inline-block;
            min-width: 145px;
        }
        .skill-items {
            display: inline;
            color: #222222;
        }

        .exp-item, .project-item {
            margin-bottom: 1.3rem;
        }
        .exp-header {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0.1rem;
        }
        .exp-role {
            font-weight: 700;
            font-size: 0.88rem;
            color: #000000;
        }
        .exp-company {
            font-weight: 600;
            color: #000000;
        }
        .exp-date {
            font-size: 0.72rem;
            font-weight: normal;
            color: #444444;
        }
        .exp-desc {
            margin-top: 0.3rem;
            padding-left: 0rem;
        }
        .exp-desc ul, .cert-list, .achievements-list {
            list-style: none;
            padding-left: 0;
        }
        .exp-desc li, .cert-list li, .achievements-list li {
            font-size: 0.82rem;
            margin-bottom: 0.45rem;
            position: relative;
            padding-left: 1.2rem;
            line-height: 1.45;
            color: #222222;
        }
        .exp-desc li::before, .cert-list li::before, .achievements-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #000000;
            font-weight: bold;
            font-size: 0.85rem;
        }

        .project-header {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0.2rem;
        }
        .project-title {
            font-weight: 700;
            font-size: 0.88rem;
            color: #000000;
        }
        .project-date {
            font-size: 0.72rem;
            color: #444444;
        }
        .project-desc {
            margin-top: 0.2rem;
        }
        .project-desc ul {
            list-style: none;
            padding-left: 0;
        }
        .project-desc li {
            font-size: 0.82rem;
            margin-bottom: 0.4rem;
            position: relative;
            padding-left: 1.2rem;
            line-height: 1.45;
            color: #222222;
        }
        .project-desc li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #000000;
            font-weight: bold;
        }

        .edu-degree {
            font-weight: 700;
            font-size: 0.88rem;
            color: #000000;
        }
        .edu-college {
            font-weight: 500;
            font-size: 0.82rem;
            color: #222222;
            margin: 0.15rem 0 0.1rem;
        }
        .edu-cgpa {
            font-size: 0.78rem;
            color: #333333;
            margin-bottom: 0.2rem;
        }

        hr {
            display: none;
        }

        .footer-tagline {
            margin-top: 1rem;
            font-size: 0.68rem;
            color: #555555;
            text-align: left;
            border-top: 1px solid #cccccc;
            padding-top: 0.6rem;
        }

        @media (max-width: 650px) {
            .resume {
                padding: 1.2rem;
            }
            .exp-header, .project-header {
                flex-direction: column;
                gap: 0.2rem;
            }
            .skill-cat {
                display: block;
                margin-bottom: 0.15rem;
            }
            .skill-items {
                display: block;
                margin-left: 0.5rem;
            }
        }

        a {
            text-decoration: underline;
            text-decoration-thickness: 0.5px;
            text-underline-offset: 2px;
            color: #000000;
        }
        a:hover {
            text-decoration: underline;
            text-decoration-thickness: 1px;
        }

        @media print {
            body { background: #fff; padding: 0; }
            .resume { border: none; padding: 1.5rem; max-width: 100%; box-shadow: none; }
        }
    </style>
</head>
<body>
<div class="resume">
    ${personal.fullName ? `<div class="name">${personal.fullName}</div>` : ''}
    ${personal.targetRole || personal.openTo ? `<div class="target-role">Target Role: ${personal.targetRole || ''} ${personal.openTo ? `| Open to ${personal.openTo}` : ''}</div>` : ''}
    ${personal.professionalTitle || personal.currentRole || personal.subhead ? `<div class="title-line">${[personal.professionalTitle, personal.currentRole, personal.subhead].filter(Boolean).join(' | ')}</div>` : ''}
    
    <div class="contact-row">
        ${contactStr}
    </div>

    ${sections.map(sec => `
    <div class="section">
        <div class="section-title">${sec.title}</div>
        ${sec.html}
    </div>`).join('\n')}

    <div class="footer-tagline">
        ${footerTagline}
    </div>
</div>
</body>
</html>`;
}
