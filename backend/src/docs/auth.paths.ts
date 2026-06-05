export const authPaths = {
  "/api/v2/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "Register a new user",
      description: "Create a new user account.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
                      accessToken: {
                        type: "string",
                        example: "jwt-access-token",
                      },
                      refreshToken: {
                        type: "string",
                        example: "refresh-token",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error or duplicate email",
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

  "/api/v2/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Login user",
      description: "Authenticate a user and return access/refresh tokens.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "User logged in successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
                      accessToken: {
                        type: "string",
                        example: "jwt-access-token",
                      },
                      refreshToken: {
                        type: "string",
                        example: "refresh-token",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Invalid email or password",
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
  "/api/v2/auth/google/url": {
    get: {
      tags: ["Authentication"],
      summary: "Get Google OAuth login URL",
      description:
        "Generate a Google OAuth URL that the frontend can use to redirect the user to Google login.",
      responses: {
        200: {
          description: "Google OAuth URL generated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GoogleAuthUrlResponse",
              },
            },
          },
        },
        429: {
          description: "Too many authentication requests",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v2/auth/google/callback": {
    get: {
      tags: ["Authentication"],
      summary: "Handle Google OAuth callback",
      description:
        "Exchange the Google authorization code for Google tokens, verify the ID token, create or link a CareerFit user, issue a CareerFit access token, and set the refresh token cookie.",
      parameters: [
        {
          name: "code",
          in: "query",
          required: true,
          description: "Authorization code returned by Google.",
          schema: {
            type: "string",
            example: "4/0AbCDxyz...",
          },
        },
      ],
      responses: {
        200: {
          description: "Google login completed successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthSuccessResponse",
              },
            },
          },
        },
        400: {
          description: "Missing or invalid Google authorization code",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Invalid Google token or unverified Google email",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        403: {
          description: "Account is disabled",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        429: {
          description: "Too many authentication requests",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v2/auth/me": {
    get: {
      tags: ["Authentication"],
      summary: "Get current user",
      description: "Return the currently authenticated user.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Current user retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
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

    delete: {
      tags: ["Authentication"],
      summary: "Delete current account",
      description:
        "Soft delete the currently authenticated user account, revoke all refresh/auth tokens, and clear the refresh token cookie.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Account deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  message: {
                    type: "string",
                    example: "Account deleted successfully",
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
        404: {
          description: "User not found",
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
  "/api/v2/auth/refresh": {
    post: {
      tags: ["Authentication"],
      summary: "Refresh access token",
      description:
        "Issue a new access token using a refresh token from the request body or cookie.",
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RefreshTokenInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Token refreshed successfully",
        },
        401: {
          description: "Invalid or expired refresh token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v2/auth/verify-email": {
    get: {
      tags: ["Authentication"],
      summary: "Verify email",
      parameters: [
        {
          name: "token",
          in: "query",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Email verified successfully",
        },
        400: {
          description: "Invalid or expired verification token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/api/v2/auth/resend-verification": {
    post: {
      tags: ["Authentication"],
      summary: "Resend verification email",
      description:
        "Send a new email verification link to the currently authenticated user. Only unverified users can request a new verification email.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Verification email sent successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  message: {
                    type: "string",
                    example: "Verification email sent successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Email is already verified",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v2/auth/forgot-password": {
    post: {
      tags: ["Authentication"],
      summary: "Request password reset email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ForgotPasswordInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Password reset email requested",
        },
      },
    },
  },

  "/api/v2/auth/reset-password": {
    post: {
      tags: ["Authentication"],
      summary: "Reset password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ResetPasswordInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Password reset successfully",
        },
      },
    },
  },

  "/api/v2/auth/change-password": {
    patch: {
      tags: ["Authentication"],
      summary: "Change password",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ChangePasswordInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Password changed successfully",
        },
        401: {
          description: "Unauthorized or invalid current password",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v2/auth/logout": {
    post: {
      tags: ["Authentication"],
      summary: "Logout current session",
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RefreshTokenInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Logged out successfully",
        },
      },
    },
  },

  "/api/v2/auth/logout-others": {
    post: {
      tags: ["Authentication"],
      summary: "Logout other sessions",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Other sessions logged out successfully",
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v2/auth/logout-all": {
    post: {
      tags: ["Authentication"],
      summary: "Logout all sessions",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "All sessions logged out successfully",
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
};
