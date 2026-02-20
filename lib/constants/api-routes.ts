// API Routes Constants (paths are used with api client; rewrites proxy /api/* when BASE_URL is set)
export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    REFRESH_TOKEN: "/api/auth/refresh",
  },

  // Users
  USERS: {
    LIST: "/api/users",
    CREATE: "/api/users",
    GET: (id: string | number) => `/api/users/${id}`,
    UPDATE: (id: string | number) => `/api/users/${id}`,
    DELETE: (id: string | number) => `/api/users/${id}`,
    PROFILE: "/api/users/profile",
  },

  // Companies
  COMPANIES: {
    LIST: "/api/companies",
    CREATE: "/api/companies",
    GET: (id: string | number) => `/api/companies/${id}`,
    UPDATE: (id: string | number) => `/api/companies/${id}`,
    DELETE: (id: string | number) => `/api/companies/${id}`,
    MEMBERS_STATS: (companyId: string) =>
      `/api/companies/${companyId}/members/stats`,
    MEMBERS: (companyId: string) => `/api/companies/${companyId}/members`,
  },

  // Frameworks (compliance frameworks)
  FRAMEWORKS: {
    LIST: "/api/frameworks",
    CREATE: "/api/frameworks",
    GET: (id: string | number) => `/api/frameworks/${id}`,
    UPDATE: (id: string | number) => `/api/frameworks/${id}`,
    GET_COMPANY:(id: string | number)=>`/api/frameworks/company/${id}`,
    DELETE: (id: string | number) => `/api/frameworks/${id}`,
    SELECT: "/api/frameworks/select",
    PREVIEW: (id: string | number) => `/api/frameworks/preview/${id}`,
  },

  // Assessments
  ASSESSMENTS: {
    LIST: "/api/assessments",
    CREATE: "/api/assessments",
    GET: (id: string | number) => `/api/assessments/${id}`,
    UPDATE: (id: string | number) => `/api/assessments/${id}`,
    DELETE: (id: string | number) => `/api/assessments/${id}`,
    ASSISTED_REQUEST: "/api/assessments/assisted-request",
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/api/dashboard/stats",
    TASKS: "/api/dashboard/tasks",
    TEAM: "/api/dashboard/team",
  },

  // Billing
  BILLING: {
    LIST: "/api/billing",
    GET: (id: string | number) => `/api/billing/${id}`,
  },

  // Technical review
  TECHNICAL_REVIEW: {
    LIST: "/api/technical-review",
    GET: (id: string | number) => `/api/technical-review/${id}`,
  },

  // Compliance progress (control progress PATCH)
  COMPLIANCE_PROGRESS: {
    PATCH: (controlProgressId: string) =>
      `/api/compliance-progress/${controlProgressId}`,
  },

  // User roles
  USER_ROLES: {
    ROLES: "/api/user-roles/roles",
  },

  // Invitations
  INVITATIONS: {
    CREATE: "/api/invitations",
    BY_COMPANY: (companyId: string) =>
      `/api/invitations/company/${companyId}`,
    DELETE: (invitationId: string) => `/api/invitations/${invitationId}`,
    RESEND: (invitationId: string) => `/api/invitations/${invitationId}/resend`,
    ACCEPT: (invitationId: string) => `/api/invitations/${invitationId}/accept`,
  },
} as const;
