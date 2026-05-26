export const applicationPaths = {
  "/api/v2/applications": {
    post: {
      tags: ["Application"],
      summary: "Create application",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateApplicationInput" },
          },
        },
      },
      responses: {
        201: {
          description: "Application created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/Application" },
                },
              },
            },
          },
        },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
      },
    },

    get: {
      tags: ["Application"],
      summary: "Get my applications",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "status",
          in: "query",
          schema: { $ref: "#/components/schemas/ApplicationStatus" },
        },
        {
          name: "keyword",
          in: "query",
          schema: { type: "string" },
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer", example: 1 },
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", example: 10 },
        },
        {
          name: "sort",
          in: "query",
          schema: {
            type: "string",
            enum: [
              "latest",
              "oldest",
              "appliedAt_desc",
              "appliedAt_asc",
              "jobTitle_asc",
              "companyName_asc",
            ],
          },
        },
      ],
      responses: {
        200: {
          description: "Applications retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Application" },
                  },
                  meta: { $ref: "#/components/schemas/PaginationMeta" },
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

  "/api/v2/applications/{id}": {
    get: {
      tags: ["Application"],
      summary: "Get application by id",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: {
          description: "Application retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/Application" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
        404: { description: "Application not found" },
      },
    },

    patch: {
      tags: ["Application"],
      summary: "Update application",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateApplicationInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Application updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/Application" },
                },
              },
            },
          },
        },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
        404: { description: "Application not found" },
      },
    },

    delete: {
      tags: ["Application"],
      summary: "Delete application",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        204: { description: "Application deleted successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
        404: { description: "Application not found" },
      },
    },
  },

  "/api/v2/applications/{id}/status": {
    patch: {
      tags: ["Application"],
      summary: "Update application status",
      description: "Requires authentication and verified email.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateApplicationStatusInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Application status updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/Application" },
                },
              },
            },
          },
        },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        403: { description: "Email verification required" },
        404: { description: "Application not found" },
      },
    },
  },
};
