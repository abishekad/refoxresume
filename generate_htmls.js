import fs from 'fs';
import path from 'path';
import resumeTemplates from './src/data/templateRegistry.js';

const outDir = './public/temp_htmls';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

resumeTemplates.forEach(template => {
  if (template.renderHTML && template.createDefaultFormData) {
    const defaultData = template.createDefaultFormData();
    
    defaultData.layout = template.sections;
    defaultData.personal = {
      ...defaultData.personal,
      fullName: "JOHN DOE",
      professionalTitle: "Full Stack Developer & Software Engineer",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      location: "New York, USA",
      github: "github.com/johndoe",
      linkedin: "linkedin.com/in/johndoe"
    };
    
    defaultData.summary = "Passionate engineer with experience in building scalable web applications. Recognized for improving system efficiency by 40% using modern stack solutions.";
    
    defaultData.skills = {
      languages: "JavaScript, TypeScript, Python, Java",
      frontend: "React, Next.js, Redux, Tailwind CSS",
      backend: "Node.js, Express, Django, Spring Boot",
      aiAutomation: "TensorFlow, PyTorch, OpenAI API",
      cloudDatabases: "AWS, Azure, PostgreSQL, MongoDB",
      devopsTools: "Docker, Kubernetes, GitHub Actions"
    };
    
    defaultData.experience = [
      {
        jobTitle: "Senior Software Engineer",
        company: "TechNova Solutions",
        startDate: "Jan 2021",
        endDate: "Present",
        duration: "3 Yrs",
        bullets: ["Led the transition to a microservices architecture improving uptime to 99.99%.", "Mentored a team of 5 junior developers on React and Node.js best practices.", "Reduced application load time by 35% through image optimization."]
      },
      {
        jobTitle: "Software Developer",
        company: "Innovate Inc.",
        startDate: "Jun 2018",
        endDate: "Dec 2020",
        bullets: ["Developed core features for the product dashboard serving 10k users.", "Integrated payment gateway processing $1M+ daily transactions.", "Wrote 100+ comprehensive automation unit tests using Jest."]
      }
    ];
    
    defaultData.projects = [
      { title: "E-Commerce Platform", description: "Built a fully responsive e-commerce site using Next.js and Stripe." },
      { title: "AI Customer Support Chatbot", description: "Integrated large language models to resolve 50% of customer support inquiries." },
      { title: "FinTech Dashboard Analytics", description: "Visualized real-time crypto trading volume using D3.js and WebSockets." }
    ];
    
    defaultData.education = [
      { degree: "Bachelor of Engineering (B.E) in Computer Science Engineering", school: "St. Joseph's College of Engineering", location: "Sriperumbudur", cgpa: "8.4/10", date: "2025", coursework: "Data Structures, Cloud Computing, AI Fundamentals, Web Technologies" }
    ];
    
    defaultData.keyMetrics = [
      { text: "<span class='metric'>500+ concurrent users</span> supported on mobility platform backend" },
      { text: "<span class='metric'>10,000+ daily ride requests</span> handled during peak hours" },
      { text: "<span class='metric'>30% improvement</span> in pricing efficiency via dynamic pricing engine" },
      { text: "<span class='metric'>40% lower API latency</span> (from ~280ms to ~165ms) after concurrency optimizations" }
    ];
    
    defaultData.achievements = [
      { text: "<span class='metric'>Published mobile app</span> on Play Store with real-time ride coordination and dynamic pricing live in production." },
      { text: "Reduced infrastructure cost by <span class='metric'>25%</span> through optimized cloud resource allocation on AWS and GCP." },
      { text: "Successfully integrated AI prompt engineering for automated customer support workflows (n8n automation)." }
    ];
    
    let htmlString = template.renderHTML(defaultData);
    
    const thickCSS = `
      <style>
        body * {
          -webkit-text-stroke: 0.3px rgba(0,0,0,0.6) !important;
          font-weight: 500 !important;
        }
        body h1, body h2, body h3, body h4, body .name, body .section-title {
          -webkit-text-stroke: 0.8px rgba(0,0,0,0.8) !important;
          font-weight: 900 !important;
        }
      </style>
    `;
    htmlString = htmlString.replace('</head>', thickCSS + '</head>');
    
    fs.writeFileSync(path.join(outDir, `template-${template.id}.html`), htmlString);
    console.log(`Generated template-${template.id}.html`);
  }
});
