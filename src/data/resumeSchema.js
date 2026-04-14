export const createDefaultFormData = () => ({
  personal: {
    fullName: 'John Doe',
    subhead: 'Full Stack Developer',
    currentRole: 'Software Engineer',
    targetRole: 'Senior Full Stack Developer',
    openTo: 'Full-time',
    professionalTitle: 'Full Stack Developer',
    location: 'San Francisco, CA',
    openToRemote: true,
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    website: 'johndoe.dev',
    github: 'github.com/johndoe',
    linkedin: 'linkedin.com/in/johndoe',
  },
  summary: 'Results-driven Full Stack Developer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud architectures. Proven track record of optimizing application performance by 40% and leading cross-functional teams to deliver enterprise-grade solutions on time.',
  skills: [
    { id: crypto.randomUUID(), category: 'Languages', items: 'JavaScript, TypeScript, Python, SQL' },
    { id: crypto.randomUUID(), category: 'Frontend', items: 'React.js, Next.js, HTML5/CSS3, Tailwind CSS' },
    { id: crypto.randomUUID(), category: 'Backend & APIs', items: 'Node.js, Express, Django' },
    { id: crypto.randomUUID(), category: 'AI & Automation', items: 'Retrieval Augmented Generation (RAG), OpenAI API' },
    { id: crypto.randomUUID(), category: 'Cloud & Databases', items: 'AWS (S3, EC2, Lambda), PostgreSQL, MongoDB' },
    { id: crypto.randomUUID(), category: 'DevOps & Tools', items: 'Git, Docker, GitHub Actions' },
  ],
  keyMetrics: [
    { id: crypto.randomUUID(), text: 'Increased user retention by 25% through UI redesign' },
    { id: crypto.randomUUID(), text: 'Reduced cloud infrastructure costs by 15% using serverless' },
  ],
  experience: [
    {
      id: crypto.randomUUID(),
      jobTitle: 'Software Engineer',
      company: 'TechNova Solutions',
      companyNote: '',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      duration: '3 yrs 4 mos',
      bullets: [
        'Spearheaded the migration of a legacy monolithic application to a React/Node.js microservices architecture, reducing page load times by 40%.',
        'Developed and integrated RESTful APIs supporting mobile and web platforms serving 10,000+ daily active users.',
        'Mentored 3 junior developers and instituted comprehensive code review guidelines.'
      ],
    },
    {
      id: crypto.randomUUID(),
      jobTitle: 'Frontend Web Developer',
      company: 'Creative Digital Inc.',
      companyNote: '',
      location: 'Remote',
      startDate: 'Aug 2018',
      endDate: 'Dec 2020',
      duration: '2 yrs 4 mos',
      bullets: [
        'Designed and implemented responsive web interfaces for 15+ high-profile e-commerce clients.',
        'Improved accessibility scoring across all company products to meet WCAG 2.1 AA standards.'
      ],
    }
  ],
  projects: [
    {
      id: crypto.randomUUID(),
      title: 'Smart E-Commerce Dashboard',
      subtitle: 'Full Stack App',
      location: '',
      startDate: 'Mar 2022',
      endDate: 'Jun 2022',
      bullets: [
        'Built a real-time analytics dashboard using React, WebSockets, and Node.js.',
        'Implemented secure role-based access control with JWT authentication.'
      ],
      description: 'A comprehensive vendor dashboard visualizing sales metrics in real-time.',
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      date: 'May 2018',
      details: 'Dean\'s List (2016-2018)\nPresident of the Web Development Society',
      cgpa: '3.8/4.0',
      coursework: 'Data Structures, Algorithms, Web Engineering',
    },
  ],
  achievements: [
    { id: crypto.randomUUID(), text: '1st Place Winner at Global Tech Hackathon 2021' },
    { id: crypto.randomUUID(), text: 'Published article on "Modern React Patterns" on Medium' },
  ],
  certifications: [
    { id: crypto.randomUUID(), name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services' },
  ],
  footer: {
    tagline: 'John Doe | Software Engineer Resume | 2024',
    skillsHighlight: '',
    yearsExperience: '',
  },
});

export const createGoogleFormData = () => ({
  ...createDefaultFormData(),
  personal: { ...createDefaultFormData().personal, targetRole: 'Google Software Engineer' },
});

export const createAmazonFormData = () => ({
  ...createDefaultFormData(),
  personal: { ...createDefaultFormData().personal, targetRole: 'Amazon SDE' },
});

export const createMetaFormData = () => ({
  ...createDefaultFormData(),
  personal: { ...createDefaultFormData().personal, targetRole: 'Meta Software Engineer' },
});

export const createAzureFormData = () => {
  const fd = createDefaultFormData();
  fd.personal.targetRole = 'Microsoft Azure Engineer';
  const cloudInd = fd.skills.findIndex(s => s.category.includes('Cloud'));
  if (cloudInd !== -1) fd.skills[cloudInd].items = 'Azure, CosmosDB';
  return fd;
};

export const createAppleFormData = () => {
  const fd = createDefaultFormData();
  fd.personal.targetRole = 'Apple Hardware Engineer';
  fd.skills.push({ id: crypto.randomUUID(), category: 'Hardware', items: 'Verilog, VHDL, PCB Design' });
  return fd;
};
