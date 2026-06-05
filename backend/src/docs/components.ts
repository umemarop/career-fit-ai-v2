export const components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },

  parameters: {
    IdParam: {
      name: "id",
      in: "path",
      required: true,
      description: "Resource UUID",
      schema: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
    SessionIdParam: {
      name: "sessionId",
      in: "path",
      required: true,
      description: "Session UUID",
      schema: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
  },

  schemas: {
    ErrorResponse: {
      type: "object",
      properties: {
        status: { type: "string", example: "fail" },
        message: { type: "string", example: "Invalid request" },
      },
    },

    ValidationErrorResponse: {
      type: "object",
      properties: {
        status: { type: "string", example: "fail" },
        message: { type: "string", example: "Validation failed" },
        errors: {
          type: "object",
          additionalProperties: { type: "string" },
          example: {
            email: "Invalid email format",
            password: "Password must be at least 8 characters long",
          },
        },
      },
    },

    PaginationMeta: {
      type: "object",
      properties: {
        page: { type: "integer", example: 1 },
        limit: { type: "integer", example: 10 },
        totalItems: { type: "integer", example: 25 },
        totalPages: { type: "integer", example: 3 },
      },
    },

    Role: {
      type: "string",
      enum: ["USER", "ADMIN"],
      example: "USER",
    },

    UserStatus: {
      type: "string",
      enum: ["ACTIVE", "DISABLED"],
      example: "ACTIVE",
    },

    ExperienceLevel: {
      type: "string",
      enum: ["ENTRY", "JUNIOR", "MID", "SENIOR"],
      example: "JUNIOR",
    },

    WorkEligibility: {
      type: "string",
      enum: [
        "FULL_WORK_RIGHTS",
        "LIMITED_WORK_RIGHTS",
        "NEEDS_SPONSORSHIP",
        "NOT_SURE",
      ],
      example: "FULL_WORK_RIGHTS",
    },

    JobType: {
      type: "string",
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"],
      example: "FULL_TIME",
    },

    RemotePreference: {
      type: "string",
      enum: ["REMOTE", "HYBRID", "ONSITE", "FLEXIBLE"],
      example: "HYBRID",
    },

    Recommendation: {
      type: "string",
      enum: ["APPLY", "CONSIDER", "NOT_RECOMMENDED"],
      example: "APPLY",
    },

    ApplicationStatus: {
      type: "string",
      enum: [
        "SAVED",
        "APPLIED",
        "INTERVIEWING",
        "OFFER",
        "REJECTED",
        "WITHDRAWN",
      ],
      example: "SAVED",
    },

    User: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        email: { type: "string", format: "email", example: "user@example.com" },
        role: { $ref: "#/components/schemas/Role" },
        isEmailVerified: { type: "boolean", example: true },
        emailVerifiedAt: {
          type: "string",
          format: "date-time",
          nullable: true,
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        deletedAt: {
          type: "string",
          format: "date-time",
          nullable: true,
        },
      },
    },

    Profile: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        avatarUrl: {
          type: "string",
          nullable: true,
          example: "/uploads/avatars/avatar.webp",
        },
        skills: {
          type: "array",
          items: { type: "string" },
          example: ["TypeScript", "Node.js", "PostgreSQL"],
        },
        experienceLevel: { $ref: "#/components/schemas/ExperienceLevel" },
        workEligibility: {
          allOf: [{ $ref: "#/components/schemas/WorkEligibility" }],
          nullable: true,
        },
        location: {
          type: "string",
          nullable: true,
          example: "Brisbane, Australia",
        },
        targetRole: {
          type: "string",
          nullable: true,
          example: "Backend Developer",
        },
        desiredRoles: {
          type: "array",
          items: { type: "string" },
          example: ["Backend Developer", "Full Stack Developer"],
        },
        careerGoals: {
          type: "string",
          nullable: true,
          example: "Become a production-ready backend engineer.",
        },
        preferredJobType: {
          allOf: [{ $ref: "#/components/schemas/JobType" }],
          nullable: true,
        },
        remotePreference: {
          allOf: [{ $ref: "#/components/schemas/RemotePreference" }],
          nullable: true,
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },

    Resume: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        originalName: { type: "string", example: "resume.pdf" },
        fileUrl: {
          type: "string",
          nullable: true,
          example: "/uploads/resumes/resume.pdf",
        },
        mimeType: { type: "string", example: "application/pdf" },
        size: { type: "integer", example: 245000 },
        rawText: {
          type: "string",
          nullable: true,
          example: "Extracted resume text...",
        },
        parsedJson: {
          type: "object",
          nullable: true,
          additionalProperties: true,
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },

    Session: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        userAgent: { type: "string", nullable: true },
        ipAddress: { type: "string", nullable: true },
        browser: { type: "string", nullable: true, example: "Chrome" },
        os: { type: "string", nullable: true, example: "Windows" },
        deviceType: { type: "string", nullable: true, example: "desktop" },
        expiresAt: { type: "string", format: "date-time" },
        revokedAt: {
          type: "string",
          format: "date-time",
          nullable: true,
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        isCurrent: { type: "boolean", example: true },
      },
    },
    RegisterInput: {
      type: "object",
      required: ["email", "password", "confirmPassword"],
      properties: {
        email: { type: "string", format: "email", example: "user@example.com" },
        password: {
          type: "string",
          minLength: 8,
          example: "Password123",
        },
        confirmPassword: {
          type: "string",
          example: "Password123",
        },
      },
    },

    LoginInput: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email", example: "user@example.com" },
        password: { type: "string", example: "Password123" },
      },
    },

    RefreshTokenInput: {
      type: "object",
      properties: {
        refreshToken: {
          type: "string",
          description: "Optional if refresh token is provided via cookie.",
        },
      },
    },

    ForgotPasswordInput: {
      type: "object",
      required: ["email"],
      properties: {
        email: { type: "string", format: "email", example: "user@example.com" },
      },
    },

    ResetPasswordInput: {
      type: "object",
      required: ["token", "password", "confirmPassword"],
      properties: {
        token: { type: "string", example: "reset-token" },
        password: { type: "string", minLength: 8, example: "NewPassword123" },
        confirmPassword: { type: "string", example: "NewPassword123" },
      },
    },

    ChangePasswordInput: {
      type: "object",
      required: ["currentPassword", "password", "confirmPassword"],
      properties: {
        currentPassword: { type: "string", example: "OldPassword123" },
        password: { type: "string", minLength: 8, example: "NewPassword123" },
        confirmPassword: { type: "string", example: "NewPassword123" },
      },
    },

    AuthTokens: {
      type: "object",
      properties: {
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
    AuthSuccessResponse: {
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
          },
        },
      },
    },

    GoogleAuthUrlResponse: {
      type: "object",
      properties: {
        status: { type: "string", example: "success" },
        data: {
          type: "object",
          properties: {
            url: {
              type: "string",
              example:
                "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
            },
          },
        },
      },
    },
    UpsertProfileInput: {
      type: "object",
      required: ["skills", "experienceLevel"],
      properties: {
        skills: {
          type: "array",
          items: {
            type: "string",
          },
          example: ["TypeScript", "Node.js", "PostgreSQL"],
        },

        experienceLevel: {
          $ref: "#/components/schemas/ExperienceLevel",
        },

        workEligibility: {
          allOf: [
            {
              $ref: "#/components/schemas/WorkEligibility",
            },
          ],
          nullable: true,
        },

        location: {
          type: "string",
          nullable: true,
          example: "Brisbane, Australia",
        },

        targetRole: {
          type: "string",
          nullable: true,
          example: "Backend Developer",
        },

        desiredRoles: {
          type: "array",
          items: {
            type: "string",
          },
          example: ["Backend Developer", "Full Stack Developer"],
        },

        careerGoals: {
          type: "string",
          nullable: true,
          example: "Become a production-ready backend engineer.",
        },

        preferredJobType: {
          allOf: [
            {
              $ref: "#/components/schemas/JobType",
            },
          ],
          nullable: true,
        },

        remotePreference: {
          allOf: [
            {
              $ref: "#/components/schemas/RemotePreference",
            },
          ],
          nullable: true,
        },
      },
    },

    ResumeProfileDraft: {
      type: "object",
      properties: {
        skills: {
          type: "array",
          items: {
            type: "string",
          },
        },

        experienceLevel: {
          type: "string",
          nullable: true,
          enum: ["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"],
        },

        workEligibility: {
          type: "string",
          nullable: true,
        },

        location: {
          type: "string",
          nullable: true,
        },

        targetRole: {
          type: "string",
          nullable: true,
        },

        desiredRoles: {
          type: "array",
          items: {
            type: "string",
          },
        },

        careerGoals: {
          type: "string",
          nullable: true,
        },

        preferredJobType: {
          allOf: [
            {
              $ref: "#/components/schemas/JobType",
            },
          ],
          nullable: true,
        },

        remotePreference: {
          allOf: [
            {
              $ref: "#/components/schemas/RemotePreference",
            },
          ],
          nullable: true,
        },
      },
    },
    JobAnalysisResult: {
      type: "object",
      properties: {
        matchedSkills: {
          type: "array",
          items: {
            type: "string",
          },
          example: ["TypeScript", "Node.js"],
        },

        missingSkills: {
          type: "array",
          items: {
            type: "string",
          },
          example: ["AWS", "Docker"],
        },

        strengths: {
          type: "array",
          items: {
            type: "string",
          },
        },

        risks: {
          type: "array",
          items: {
            type: "string",
          },
        },

        resumeTips: {
          type: "array",
          items: {
            type: "string",
          },
        },

        actionPlan: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },

    GuestJobAnalysisResponse: {
      type: "object",
      properties: {
        jobTitle: {
          type: "string",
          example: "Backend Developer",
        },

        companyName: {
          type: "string",
          nullable: true,
          example: "Google",
        },

        location: {
          type: "string",
          nullable: true,
          example: "Sydney, Australia",
        },

        requiredSkills: {
          type: "array",
          items: {
            type: "string",
          },
        },

        preferredSkills: {
          type: "array",
          items: {
            type: "string",
          },
        },

        responsibilities: {
          type: "array",
          items: {
            type: "string",
          },
        },

        summary: {
          type: "string",
        },

        preparationTips: {
          type: "array",
          items: {
            type: "string",
          },
        },

        warnings: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },

    JobAnalysis: {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid",
        },

        jobTitle: {
          type: "string",
          example: "Backend Developer",
        },

        companyName: {
          type: "string",
          nullable: true,
          example: "Google",
        },

        location: {
          type: "string",
          nullable: true,
          example: "Sydney, Australia",
        },

        jobDescription: {
          type: "string",
        },

        fitScore: {
          type: "integer",
          minimum: 0,
          maximum: 100,
          example: 82,
        },

        recommendation: {
          $ref: "#/components/schemas/Recommendation",
        },

        result: {
          $ref: "#/components/schemas/JobAnalysisResult",
        },

        createdAt: {
          type: "string",
          format: "date-time",
        },

        updatedAt: {
          type: "string",
          format: "date-time",
        },
      },
    },

    CreateJobAnalysisInput: {
      type: "object",
      required: ["jobDescription"],
      properties: {
        jobDescription: {
          type: "string",
          minLength: 50,
          maxLength: 10000,
          example:
            "We are looking for a backend engineer with experience in Node.js, TypeScript, PostgreSQL, and AWS...",
        },
      },
    },
    Application: {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid",
        },

        userId: {
          type: "string",
          format: "uuid",
        },

        jobAnalysisId: {
          type: "string",
          format: "uuid",
          nullable: true,
        },

        jobTitle: {
          type: "string",
          example: "Backend Developer",
        },

        companyName: {
          type: "string",
          nullable: true,
          example: "Google",
        },

        location: {
          type: "string",
          nullable: true,
          example: "Sydney, Australia",
        },

        jobUrl: {
          type: "string",
          format: "uri",
          nullable: true,
          example: "https://example.com/jobs/backend-developer",
        },

        status: {
          $ref: "#/components/schemas/ApplicationStatus",
        },

        notes: {
          type: "string",
          nullable: true,
          example: "Need to tailor resume before applying.",
        },

        nextStep: {
          type: "string",
          nullable: true,
          example: "Follow up next week.",
        },

        appliedAt: {
          type: "string",
          format: "date-time",
          nullable: true,
        },

        createdAt: {
          type: "string",
          format: "date-time",
        },

        updatedAt: {
          type: "string",
          format: "date-time",
        },

        deletedAt: {
          type: "string",
          format: "date-time",
          nullable: true,
        },
      },
    },

    CreateApplicationInput: {
      type: "object",
      properties: {
        jobAnalysisId: {
          type: "string",
          format: "uuid",
          description:
            "Optional. If provided, creates an application from a job analysis.",
        },

        jobTitle: {
          type: "string",
          example: "Backend Developer",
          description:
            "Required when creating an application manually without jobAnalysisId.",
        },

        companyName: {
          type: "string",
          example: "Google",
        },

        location: {
          type: "string",
          example: "Sydney, Australia",
        },

        jobUrl: {
          type: "string",
          format: "uri",
          example: "https://example.com/jobs/backend-developer",
        },

        status: {
          $ref: "#/components/schemas/ApplicationStatus",
        },

        notes: {
          type: "string",
          example: "Interesting role.",
        },

        nextStep: {
          type: "string",
          example: "Apply this weekend.",
        },

        appliedAt: {
          type: "string",
          format: "date-time",
        },
      },
    },

    UpdateApplicationInput: {
      type: "object",
      minProperties: 1,
      properties: {
        jobTitle: {
          type: "string",
          example: "Senior Backend Developer",
        },

        companyName: {
          type: "string",
          nullable: true,
          example: "Google",
        },

        location: {
          type: "string",
          nullable: true,
          example: "Sydney, Australia",
        },

        jobUrl: {
          type: "string",
          format: "uri",
          nullable: true,
          example: "https://example.com/jobs/backend-developer",
        },

        notes: {
          type: "string",
          nullable: true,
          example: "Updated notes.",
        },

        nextStep: {
          type: "string",
          nullable: true,
          example: "Prepare for interview.",
        },

        appliedAt: {
          type: "string",
          format: "date-time",
          nullable: true,
        },
      },
    },

    UpdateApplicationStatusInput: {
      type: "object",
      required: ["status"],
      properties: {
        status: {
          $ref: "#/components/schemas/ApplicationStatus",
        },
      },
    },
    AdminStats: {
      type: "object",
      properties: {
        totalUsers: {
          type: "integer",
          example: 120,
        },

        verifiedUsers: {
          type: "integer",
          example: 95,
        },

        adminUsers: {
          type: "integer",
          example: 3,
        },

        activeUsers: {
          type: "integer",
          example: 110,
        },

        disabledUsers: {
          type: "integer",
          example: 10,
        },
      },
    },

    AdminUser: {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid",
        },

        email: {
          type: "string",
          format: "email",
          example: "user@example.com",
        },

        role: {
          $ref: "#/components/schemas/Role",
        },

        isEmailVerified: {
          type: "boolean",
          example: true,
        },

        emailVerifiedAt: {
          type: "string",
          format: "date-time",
          nullable: true,
        },

        createdAt: {
          type: "string",
          format: "date-time",
        },

        updatedAt: {
          type: "string",
          format: "date-time",
        },

        deletedAt: {
          type: "string",
          format: "date-time",
          nullable: true,
        },

        status: {
          $ref: "#/components/schemas/UserStatus",
        },
      },
    },

    UpdateAdminUserRoleInput: {
      type: "object",
      required: ["role"],
      properties: {
        role: {
          $ref: "#/components/schemas/Role",
        },
      },
    },

    UpdateAdminUserStatusInput: {
      type: "object",
      required: ["status"],
      properties: {
        status: {
          $ref: "#/components/schemas/UserStatus",
        },
      },
    },
  },
};
