// DeepSeek API Service — via OpenRouter
// Uses OpenRouter as a proxy to DeepSeek for enhanced reliability and safety.

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are RefoxAI, an expert ATS resume writer who creates FAANG-ready, professional resumes. When the user describes themselves (name, education, skills, projects, experience, etc.), you generate a complete, polished resume in JSON format.

RULES:
1. Write in professional, ATS-optimized language — recruiters and ATS parsers must love it.
2. Use strong action verbs: Developed, Architected, Spearheaded, Implemented, Engineered, Optimized, Led, etc.
3. Include quantified metrics where possible (e.g., "improved performance by 40%", "served 10K+ daily users").
4. For freshers with no work experience, generate impressive project descriptions and emphasize academic achievements, skills, and relevant coursework.
5. If the user provides only basic details, intelligently expand them into professional content.
6. For follow-up requests (e.g., "make summary more technical", "add 2 more projects"), modify ONLY the relevant sections and return them.
7. ALWAYS return valid JSON. No markdown, no code fences, no explanation text — ONLY the JSON object.

RESPONSE FORMAT:
Always include "_action" field:
- "full" — when generating a complete resume (first message or full regeneration)
- "partial" — when modifying specific sections (follow-up messages)

FULL RESUME JSON SCHEMA:
{
  "_action": "full",
  "personal": {
    "fullName": "string",
    "subhead": "string (professional headline, e.g. 'Full Stack Developer & Cloud Architect')",
    "currentRole": "string (e.g. 'SOFTWARE ENGINEER')",
    "professionalTitle": "string (e.g. 'Full Stack Developer')",
    "location": "string (city, country)",
    "phone": "string (keep user's phone or leave empty)",
    "email": "string (keep user's email or leave empty)",
    "github": "string (keep as provided or leave empty)",
    "linkedin": "string (keep as provided or leave empty)",
    "website": "string (keep as provided or leave empty)"
  },
  "summary": "string — 2-3 powerful sentences. Include years of experience, core strengths, and a key achievement with a metric.",
  "skills": [
    { "category": "string (e.g. Languages, Frontend, Backend, Cloud)", "items": "string (comma-separated skills)" }
  ],
  "experience": [
    {
      "jobTitle": "string",
      "company": "string",
      "companyNote": "",
      "location": "string",
      "startDate": "string (e.g. Jan 2024)",
      "endDate": "string (e.g. Present)",
      "duration": "string (e.g. 1 yr 3 mos)",
      "bullets": ["string — each bullet is an achievement with action verb + metric"]
    }
  ],
  "projects": [
    {
      "title": "string",
      "subtitle": "string (tech stack used)",
      "startDate": "string",
      "endDate": "string",
      "bullets": ["string — what you built, impact, tech used"],
      "description": "string — one-line summary"
    }
  ],
  "education": [
    {
      "degree": "string (e.g. B.Tech in Computer Science)",
      "school": "string",
      "location": "string",
      "date": "string (graduation date)",
      "cgpa": "string (e.g. 8.5/10)",
      "coursework": "string (comma-separated relevant courses)",
      "details": "string (honors, societies, activities)"
    }
  ],
  "achievements": [
    { "text": "string" }
  ],
  "certifications": [
    { "name": "string", "issuer": "string" }
  ],
  "keyMetrics": [
    { "text": "string (a key impact metric)" }
  ],
  "footer": {
    "tagline": "string (e.g. Name | Title Resume | Year)"
  }
}

PARTIAL UPDATE SCHEMA (for follow-up modifications):
{
  "_action": "partial",
  "summary": "updated summary string",
  "skills": [/* updated skills array */]
  // ... only include sections that changed
}

IMPORTANT:
- Generate 4-6 skill categories for a complete resume.
- Generate 3-4 bullet points per experience/project entry.
- For freshers, focus heavily on projects (2-3 projects) and skills.
- Make the summary punchy and compelling — this is the first thing recruiters read.`;


/**
 * Send a chat message to DeepSeek via OpenRouter.
 * Supports multi-turn conversation by passing full message history.
 * 
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @returns {Promise<string>} - AI response content
 */
export async function sendChatMessage(messages) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DeepSeek API key not configured. Please add VITE_DEEPSEEK_API_KEY to your .env file.');
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://refoxresume.vercel.app',
      'X-Title': 'RefoxAI Resume Builder',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3-0324',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0]?.message?.content) {
    throw new Error('Invalid response from AI. Please try again.');
  }

  return data.choices[0].message.content;
}


/**
 * Parse AI response JSON and add UUIDs to array items.
 * Returns a clean object ready to merge into form state.
 * 
 * @param {string} jsonString - Raw JSON string from AI
 * @returns {{ action: string, data: object }} - Parsed resume data with UUIDs
 */
export function parseResumeResponse(jsonString) {
  let parsed;
  
  // Handle potential markdown code fences (safety net)
  let cleaned = jsonString.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Failed to parse AI response. Please try again with a clearer description.');
  }

  const action = parsed._action || 'full';
  delete parsed._action;

  // Add crypto.randomUUID() to all array items that need IDs
  const arrayFields = ['skills', 'experience', 'projects', 'education', 'achievements', 'certifications', 'keyMetrics'];
  
  arrayFields.forEach(field => {
    if (parsed[field] && Array.isArray(parsed[field])) {
      parsed[field] = parsed[field].map(item => ({
        id: crypto.randomUUID(),
        ...item,
      }));
    }
  });

  // Ensure experience bullets are arrays
  if (parsed.experience) {
    parsed.experience = parsed.experience.map(exp => ({
      ...exp,
      bullets: Array.isArray(exp.bullets) ? exp.bullets : (exp.bullets ? [exp.bullets] : ['']),
    }));
  }

  // Ensure project bullets are arrays
  if (parsed.projects) {
    parsed.projects = parsed.projects.map(proj => ({
      ...proj,
      bullets: Array.isArray(proj.bullets) ? proj.bullets : (proj.bullets ? [proj.bullets] : ['']),
    }));
  }

  return { action, data: parsed };
}


/**
 * Merge AI-generated data into existing form state.
 * For "full" action, replaces everything except layout.
 * For "partial" action, only merges the provided sections.
 * 
 * @param {object} currentForm - Current form state
 * @param {object} aiData - Parsed AI data
 * @param {string} action - "full" or "partial"
 * @returns {object} - Merged form state
 */
export function mergeIntoForm(currentForm, aiData, action) {
  if (action === 'full') {
    // Replace all content fields but preserve layout
    return {
      ...currentForm,
      ...aiData,
      layout: currentForm.layout, // preserve layout structure
    };
  }

  // Partial merge — only override the sections AI returned
  const merged = { ...currentForm };
  Object.keys(aiData).forEach(key => {
    if (key !== 'layout') {
      merged[key] = aiData[key];
    }
  });

  return merged;
}
