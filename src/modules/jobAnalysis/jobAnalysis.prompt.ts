import type {
  BuildGuestAnalysisPromptInput,
  BuildUserAnalysisPromptInput,
} from "./jobAnalysis.types.js";

export const buildGuestAnalysisPrompt = ({
  jobDescription,
}: BuildGuestAnalysisPromptInput): string => {
  return `
You are a career assistant.

Analyze the following job description and return ONLY valid JSON.
Do not include markdown, explanations, or extra text.

Return JSON in this exact structure:

{
  "jobTitle": "string",
  "companyName": "string or null",
  "location": "string or null",
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "responsibilities": ["string"],
  "summary": "string",
  "preparationTips": ["string"],
  "warnings": ["string"]
}

Rules:
- All fields shown in the JSON structure are required.
- Do not omit any field.
- Use null only for unknown nullable fields.
- If companyName or location cannot be found, use null.
- If jobTitle cannot be found, use "Unknown Job Title".
- Keep array items short and practical.
- Do not invent companyName or location if not present.
- Return only JSON.

Job description:
${jobDescription}
`.trim();
};

export const buildUserAnalysisPrompt = ({
  jobDescription,
  profile,
}: BuildUserAnalysisPromptInput): string => {
  return `
You are a career fit analysis assistant.

Analyze the job description against the user's profile and return ONLY valid JSON.
Do not include markdown, explanations, or extra text.

Return JSON in this exact structure:

{
  "jobTitle": "string",
  "companyName": "string or null",
  "location": "string or null",
  "fitScore": 0,
  "recommendation": "APPLY",
  "result": {
    "matchedSkills": ["string"],
    "missingSkills": ["string"],
    "strengths": ["string"],
    "risks": ["string"],
    "resumeTips": ["string"],
    "actionPlan": ["string"]
  }
}

Recommendation rules:
- recommendation must match the fitScore range exactly.
- APPLY: fitScore is 75 to 100
- CONSIDER: fitScore is 50 to 74
- NOT_RECOMMENDED: fitScore is 0 to 49

Scoring guidelines:
- Compare required job skills with the user's skills.
- Consider experienceLevel, workEligibility, location, and targetRole.
- Do not overestimate the score.
- fitScore must be an integer between 0 and 100.

Rules:
- All fields shown in the JSON structure are required.
- Do not omit any field.
- Use null only for unknown nullable fields.
- recommendation must be one of: APPLY, CONSIDER, NOT_RECOMMENDED.
- If companyName or location cannot be found, use null.
- If jobTitle cannot be found, use "Unknown Job Title".
- Keep all array items short and practical.
- Return only JSON.

User profile:
${JSON.stringify(profile, null, 2)}

Job description:
${jobDescription}
`.trim();
};
