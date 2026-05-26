export const resumePaths = {
  "/api/v2/resume/upload": {
    post: {
      tags: ["Resume"],
      summary: "Upload resume",
      description:
        "Upload or replace the authenticated user's resume. Requires authentication and verified email.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              required: ["resume"],

              properties: {
                resume: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Resume uploaded successfully",

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
                      resume: {
                        $ref: "#/components/schemas/Resume",
                      },
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Resume file is required or invalid file type",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
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

        403: {
          description: "Email verification required",

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

  "/api/v2/resume/me": {
    get: {
      tags: ["Resume"],
      summary: "Get my resume",
      description:
        "Retrieve the authenticated user's uploaded resume. Requires authentication and verified email.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Resume retrieved successfully",

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
                      resume: {
                        $ref: "#/components/schemas/Resume",
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

        403: {
          description: "Email verification required",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },

        404: {
          description: "Resume not found",

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

  "/api/v2/resume": {
    delete: {
      tags: ["Resume"],
      summary: "Delete my resume",
      description:
        "Delete the authenticated user's uploaded resume. Requires authentication and verified email.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Resume deleted successfully",

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
                    type: "null",
                    example: null,
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

        403: {
          description: "Email verification required",

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
