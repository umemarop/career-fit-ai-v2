export const healthPaths = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Health check",
      description: "Check whether the API server is running.",
      responses: {
        200: {
          description: "Server is healthy",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "ok",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/": {
    get: {
      tags: ["Health"],
      summary: "API root",
      description:
        "Returns basic API information and available endpoint groups.",
      responses: {
        200: {
          description: "API root response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },
                  message: {
                    type: "string",
                    example: "CareerFit API v2 is running 🚀",
                  },
                  version: {
                    type: "string",
                    example: "v2",
                  },
                  endpoints: {
                    type: "object",
                    properties: {
                      auth: {
                        type: "string",
                        example: "/api/v2/auth",
                      },
                      sessions: {
                        type: "string",
                        example: "/api/v2/sessions",
                      },
                      profile: {
                        type: "string",
                        example: "/api/v2/profile",
                      },
                      jobAnalysis: {
                        type: "string",
                        example: "/api/v2/job-analysis",
                      },
                      application: {
                        type: "string",
                        example: "/api/v2/application",
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
};
