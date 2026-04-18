const INDUSTRY_KEYWORDS = [
  // Tech & Software
  "react", "react.js", "node", "node.js", "javascript", "typescript", "python", "java", "c++", "c#",
  "agile", "scrum", "rest api", "graphql", "sql", "postgresql", "mysql", "mongodb", "aws", "azure", "gcp",
  "docker", "kubernetes", "ci/cd", "git", "redux", "next.js", "vue", "angular", "spring boot", "django",
  // Action verbs
  "developed", "designed", "implemented", "managed", "led", "created", "built", "optimized", "increased",
  "reduced", "collaborated", "orchestrated", "engineered", "achieved", "delivered", "resolved"
];

const NUMERIC_REGEX = /\d+%|\b\d+\b/g;

export function calculateATSScore(form) {
  if (!form) return 0;
  let score = 0;
  const maxScore = 100;
  
  // Weights out of 100
  const COMPLEP_WEIGHT = 30; // Completeness
  const KEYWORD_WEIGHT = 40; // Keyword presence
  const BULLET_WEIGHT = 30;  // Bullet strength (metrics + action verbs)

  // 1. SECTION COMPLETENESS (30 pts)
  let completePoints = 0;
  const checks = [
    { present: !!(form.personal?.fullName && form.personal?.email), pts: 10 },
    { present: !!(form.summary && form.summary.length > 50), pts: 5 },
    { present: !!(form.experience && form.experience.length > 0 && form.experience[0].jobTitle), pts: 10 },
    { present: !!(form.education && form.education.length > 0 && form.education[0].school), pts: 5 }
  ];
  checks.forEach(c => { if (c.present) completePoints += c.pts; });
  score += Math.min(completePoints, COMPLEP_WEIGHT);

  // Combine text from searchable areas
  let allText = (form.summary || "") + " ";
  if (form.experience) {
    form.experience.forEach(e => {
       allText += `${e.jobTitle} ${e.company} ${e.bullets?.join(' ')} `;
    });
  }
  if (form.skills && Array.isArray(form.skills)) {
     form.skills.forEach(s => allText += ` ${s.skillName} ${s.itemNames} `);
  } else if (typeof form.skills === 'string') {
     allText += ` ${form.skills} `;
  }

  const allTextLower = allText.toLowerCase();

  // 2. KEYWORD PRESENCE (40 pts)
  let keywordPoints = 0;
  let uniqueKeywordsMatched = 0;
  INDUSTRY_KEYWORDS.forEach(kw => {
    if (allTextLower.includes(kw.toLowerCase())) {
        uniqueKeywordsMatched++;
    }
  });

  // Cap at 10 unique keywords, 4 pts each
  keywordPoints = Math.min(uniqueKeywordsMatched * 4, KEYWORD_WEIGHT);
  score += keywordPoints;

  // 3. BULLET STRENGTH (30 pts)
  let bulletPoints = 0;
  if (form.experience && form.experience.length > 0) {
    let totalBullets = 0;
    let validBullets = 0;
    let metricsFound = 0;

    form.experience.forEach(e => {
        if (e.bullets && e.bullets.length) {
           e.bullets.forEach(b => {
              if (b.trim().length === 0) return;
              totalBullets++;
              if (b.length > 40) validBullets++; // point for good length
              if (NUMERIC_REGEX.test(b)) metricsFound++; // point for % or numbers
           });
        }
    });

    if (totalBullets > 0) {
       // Up to 15 points for length
       const lengthScore = (validBullets / totalBullets) * 15;
       // Up to 15 points for data/metrics
       const metricScore = Math.min((metricsFound / totalBullets) * 15, 15);
       
       bulletPoints = lengthScore + metricScore;
    }
  }
  score += Math.min(bulletPoints, BULLET_WEIGHT);

  return Math.max(0, Math.min(Math.round(score), maxScore));
}
