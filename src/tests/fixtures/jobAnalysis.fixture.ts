export const validJobDescription = `
We are looking for a Backend Developer with experience in Node.js,
TypeScript, PostgreSQL, REST APIs, authentication, and cloud deployment.
The candidate will build APIs, maintain database models, and improve backend reliability.
`;

export const mockGuestJobAnalysisAIResponse = {
  jobTitle: "Backend Developer",
  companyName: null,
  location: "Brisbane",
  requiredSkills: ["Node.js", "TypeScript", "PostgreSQL"],
  preferredSkills: ["Cloud deployment"],
  responsibilities: ["Build APIs", "Maintain database models"],
  summary: "Backend role focused on APIs and database work.",
  preparationTips: [
    "Review REST API design",
    "Prepare backend project examples",
  ],
  warnings: ["Cloud experience may be expected"],
};

export const mockUserJobAnalysisAIResponse = {
  jobTitle: "Backend Developer",
  companyName: null,
  location: "Brisbane",
  fitScore: 82,
  recommendation: "APPLY",
  result: {
    matchedSkills: ["Node.js", "TypeScript", "PostgreSQL"],
    missingSkills: ["Cloud deployment"],
    strengths: ["Backend API experience"],
    risks: ["Limited cloud deployment experience"],
    resumeTips: ["Highlight API and database projects"],
    actionPlan: ["Prepare one backend project story"],
  },
};

export const invalidAIResponse = {
  wrongField: "invalid",
};
