export const profilePaths = {
  "/api/v2/profile/me": {
    get: {
      tags: ["Profile"],
      summary: "Get my profile",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Profile retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      profile: { $ref: "#/components/schemas/Profile" },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
      },
    },
  },

  "/api/v2/profile": {
    put: {
      tags: ["Profile"],
      summary: "Create or update my profile",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpsertProfileInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Profile saved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      profile: { $ref: "#/components/schemas/Profile" },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
      },
    },

    delete: {
      tags: ["Profile"],
      summary: "Delete my profile",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      responses: {
        204: { description: "Profile deleted successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
      },
    },
  },

  "/api/v2/profile/avatar": {
    patch: {
      tags: ["Profile"],
      summary: "Upload or replace profile avatar",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["avatar"],
              properties: {
                avatar: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Avatar updated successfully" },
        400: { description: "Avatar image is required or invalid file" },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
      },
    },

    delete: {
      tags: ["Profile"],
      summary: "Delete profile avatar",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Avatar deleted successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
      },
    },
  },

  "/api/v2/profile/autofill/resume": {
    post: {
      tags: ["Profile"],
      summary: "Generate profile draft from my saved resume",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Profile draft generated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      profileDraft: {
                        $ref: "#/components/schemas/ResumeProfileDraft",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
      },
    },
  },

  "/api/v2/profile/autofill/resume/upload": {
    post: {
      tags: ["Profile"],
      summary: "Generate profile draft from uploaded resume",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
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
        201: { description: "Profile draft generated from uploaded resume" },
        400: { description: "Resume file is required or invalid file" },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
      },
    },
  },
};
