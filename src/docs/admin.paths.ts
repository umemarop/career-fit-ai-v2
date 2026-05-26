export const adminPaths = {
  "/api/v2/admin/stats": {
    get: {
      tags: ["Admin"],
      summary: "Get admin statistics",
      description: "Requires authentication, verified email, and ADMIN role.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Admin statistics retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/AdminStats" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Admin role or email verification required" },
      },
    },
  },

  "/api/v2/admin/users": {
    get: {
      tags: ["Admin"],
      summary: "Get users",
      description: "Requires authentication, verified email, and ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "keyword", in: "query", schema: { type: "string" } },
        {
          name: "role",
          in: "query",
          schema: { $ref: "#/components/schemas/Role" },
        },
        { name: "verified", in: "query", schema: { type: "boolean" } },
        {
          name: "status",
          in: "query",
          schema: { $ref: "#/components/schemas/UserStatus" },
        },
        { name: "page", in: "query", schema: { type: "integer", example: 1 } },
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
              "email_asc",
              "email_desc",
              "role_asc",
              "role_desc",
            ],
          },
        },
      ],
      responses: {
        200: {
          description: "Users retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      users: {
                        type: "array",
                        items: { $ref: "#/components/schemas/AdminUser" },
                      },
                      meta: { $ref: "#/components/schemas/PaginationMeta" },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Admin role or email verification required" },
      },
    },
  },

  "/api/v2/admin/users/{id}": {
    get: {
      tags: ["Admin"],
      summary: "Get user by id",
      description: "Requires authentication, verified email, and ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: {
          description: "User retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/AdminUser" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Admin role or email verification required" },
        404: { description: "User not found" },
      },
    },
  },

  "/api/v2/admin/users/{id}/role": {
    patch: {
      tags: ["Admin"],
      summary: "Update user role",
      description: "Requires authentication, verified email, and ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateAdminUserRoleInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "User role updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/AdminUser" },
                },
              },
            },
          },
        },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        403: { description: "Admin role or email verification required" },
        404: { description: "User not found" },
      },
    },
  },

  "/api/v2/admin/users/{id}/status": {
    patch: {
      tags: ["Admin"],
      summary: "Update user status",
      description:
        "Enable or disable a user account. Requires authentication, verified email, and ADMIN role.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateAdminUserStatusInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "User status updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/AdminUser" },
                },
              },
            },
          },
        },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        403: { description: "Admin role or email verification required" },
        404: { description: "User not found" },
      },
    },
  },
};
