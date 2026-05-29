export const sessionPaths = {
  "/api/v2/sessions": {
    get: {
      tags: ["Session"],
      summary: "Get current user sessions",
      description: "Retrieve all active sessions for the authenticated user.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Sessions retrieved successfully",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },

                  results: {
                    type: "integer",
                    example: 2,
                  },

                  data: {
                    type: "object",

                    properties: {
                      sessions: {
                        type: "array",

                        items: {
                          $ref: "#/components/schemas/Session",
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

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/v2/sessions/{sessionId}": {
    delete: {
      tags: ["Session"],
      summary: "Revoke a session",
      description:
        "Revoke a specific session belonging to the authenticated user.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          $ref: "#/components/parameters/SessionIdParam",
        },
      ],

      responses: {
        204: {
          description: "Session revoked successfully",
        },

        401: {
          description: "Unauthorized",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },

        404: {
          description: "Session not found",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};
