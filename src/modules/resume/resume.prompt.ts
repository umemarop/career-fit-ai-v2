export const buildResumeProfileDraftPrompt = (rawText: string): string => {
  return `
You are a resume parsing assistant.

Analyze the following resume text and return ONLY valid JSON.
Do not include markdown, explanations, or extra text.

Return JSON in this exact structure:

{
  "skills": ["string"],
  "experienceLevel": "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD" | null,
  "workEligibility": "string or null",
  "location": "string or null",
  "targetRole": "string or null",
  "desiredRoles": ["string"],
  "careerGoals": "string or null",
  "preferredJobType": "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE" | null,
  "remotePreference": "REMOTE" | "HYBRID" | "ONSITE" | "FLEXIBLE" | null
}

Rules:
- Return only JSON.
- All fields shown in the JSON structure are required.
- Do not omit any field.
- Use null only for unknown nullable fields.
- Use an empty array when there are no items.
- Do not invent facts that are not present in the resume.
- skills must be short, normalized skill names.
- desiredRoles should be inferred only from explicit resume titles, summaries, projects, or experience.
- targetRole should be the most likely primary role based on the resume.
- careerGoals should be null unless explicitly stated.
- workEligibility should be null unless explicitly stated.
- location should be null unless explicitly stated.
- experienceLevel must be one of: ENTRY, JUNIOR, MID, SENIOR, LEAD, or null.
- preferredJobType must be one of: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, or null.
- remotePreference must be one of: REMOTE, HYBRID, ONSITE, FLEXIBLE, or null.

Resume text:
${rawText}
`.trim();
};
