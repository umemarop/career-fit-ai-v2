export const jobAnalysisPaths = {
  "/api/v2/job-analysis/public": {
    post: {
      tags: ["Job Analysis"],
      summary: "Analyze a job description publicly",
      description:
        "Public job analysis endpoint for guests. This endpoint does not require authentication, does not use the user's profile or resume, does not return a fit score or recommendation, and does not save analysis history.",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateJobAnalysisInput",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Public job analysis completed successfully",
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
                    $ref: "#/components/schemas/GuestJobAnalysisResponse",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid job description",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/v2/job-analysis": {
    get: {
      tags: ["Job Analysis"],
      summary: "Get my job analyses",
      description:
        "Retrieve paginated job analyses for the authenticated and email-verified user. This endpoint requires email verification because analysis history belongs to a verified user account.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "recommendation",
          in: "query",
          schema: {
            $ref: "#/components/schemas/Recommendation",
          },
        },

        {
          name: "keyword",
          in: "query",
          schema: {
            type: "string",
          },
        },

        {
          name: "page",
          in: "query",
          schema: {
            type: "integer",
            example: 1,
          },
        },

        {
          name: "limit",
          in: "query",
          schema: {
            type: "integer",
            example: 10,
          },
        },

        {
          name: "sort",
          in: "query",
          schema: {
            type: "string",
            enum: ["latest", "fitScore_desc", "fitScore_asc"],
          },
        },
      ],

      responses: {
        200: {
          description: "Job analyses retrieved successfully",

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
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/JobAnalysis",
                    },
                  },

                  meta: {
                    $ref: "#/components/schemas/PaginationMeta",
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Unauthorized",
        },

        403: {
          description: "Email verification required",
        },
      },
    },

    post: {
      tags: ["Job Analysis"],
      summary: "Analyze a job description for authenticated user",
      description:
        "Analyze a job description using the authenticated and email-verified user's profile. This endpoint returns a personalized fit score, recommendation, and analysis result, and saves the analysis history.",
      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateJobAnalysisInput",
            },
          },
        },
      },

      responses: {
        201: {
          description: "Job analysis completed successfully",

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
                    $ref: "#/components/schemas/JobAnalysis",
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Unauthorized",
        },

        403: {
          description: "Email verification required",
        },
      },
    },
  },

  "/api/v2/job-analysis/{id}": {
    get: {
      tags: ["Job Analysis"],
      summary: "Get job analysis by id",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          $ref: "#/components/parameters/IdParam",
        },
      ],

      responses: {
        200: {
          description: "Job analysis retrieved successfully",

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
                    $ref: "#/components/schemas/JobAnalysis",
                  },
                },
              },
            },
          },
        },

        404: {
          description: "Job analysis not found",
        },
      },
    },
  },
};
