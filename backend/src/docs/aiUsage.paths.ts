export const aiUsagePaths = {
  "/api/v2/ai-usage/public": {
    get: {
      tags: ["AI Usage"],
      summary: "Get public AI usage status",
      description:
        "Returns today's guest Job Analysis usage status based on the request IP address.",
      responses: {
        200: {
          description: "Public AI usage status",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },
                  data: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        example: "JOB_ANALYSIS",
                      },
                      limit: {
                        type: "number",
                        example: 3,
                      },
                      used: {
                        type: "number",
                        example: 1,
                      },
                      remaining: {
                        type: "number",
                        example: 2,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/v2/ai-usage/me": {
    get: {
      tags: ["AI Usage"],
      summary: "Get my AI usage status",
      description:
        "Returns today's authenticated user's AI usage status for Job Analysis and Resume Autofill.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Authenticated user's AI usage status",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },
                  data: {
                    type: "object",
                    properties: {
                      jobAnalysis: {
                        type: "object",
                        properties: {
                          limit: {
                            type: "number",
                            example: 10,
                          },
                          used: {
                            type: "number",
                            example: 3,
                          },
                          remaining: {
                            type: "number",
                            example: 7,
                          },
                        },
                      },
                      resumeAutofill: {
                        type: "object",
                        properties: {
                          limit: {
                            type: "number",
                            example: 5,
                          },
                          used: {
                            type: "number",
                            example: 1,
                          },
                          remaining: {
                            type: "number",
                            example: 4,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },
};
