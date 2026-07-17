// API Routes Constants (paths are used with api client; rewrites proxy /api/* when BASE_URL is set)
export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    REFRESH_TOKEN: "/api/auth/refresh",
  },

  // Locations
  LOCATIONS: {
    COUNTRIES: "/api/locations/countries",
    CITIES: (countryId: number | string) => `/api/locations/countries/${countryId}/cities`,
  },

  // Users
  USERS: {
    LIST: "/api/users",
    CREATE: "/api/users",
    GET: (id: string | number) => `/api/users/${id}`,
    UPDATE: (id: string | number) => `/api/users/${id}`,
    DELETE: (id: string | number) => `/api/users/${id}`,
    PROFILE: "/api/users/profile",
    COMPANY_PROFILE: (companyId: string | number) => `/api/users/${companyId}/profile`,
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
    SUMMARY: (id: string | number) => `/api/assessments/${id}/summary`,
    UPDATE: (id: string | number) => `/api/assessments/${id}`,
    DELETE: (id: string | number) => `/api/assessments/${id}`,
    REPORT_DATA: (id: string | number) => `/api/assessments/${id}/report-data`,
    ASSISTED_REQUEST: "/api/assessments/assisted-request",
  },

  ASSISTED_ASSESSMENTS: {
    REQUEST: "/api/assisted-assessments",
    ALL_REQUESTS: "/api/assisted-assessments/all-requests",
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

  // Wallet
  WALLET: {
    FEATURE_PRICING: "/api/wallet/config/feature-pricing",
    GET_BY_COMPANY: (companyId: string | number) => `/api/wallet/${companyId}`,
    TRANSACTIONS: (companyId: string | number) => `/api/wallet/${companyId}/transactions`,
    LOAD_MOBILE_MONEY: (companyId: string | number) =>
      `/api/wallet/${companyId}/load/mobile-money`,
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
    ASSIGN: (controlProgressId: string) =>
      `/api/compliance-progress/${controlProgressId}/assign`,
    SUBMIT_ASSESSMENT: "/api/compliance-progress/submit-assessment",
    USER_TASKS: (userId: string, companyId: string) =>
      `/api/compliance-progress/user/${userId}/company/${companyId}`,
  },

  // User roles (assignable roles for invitations; company admins see company-scoped subset in UI)
  USER_ROLES: {
    LIST: "/api/user-roles",
  },

  CERTIFICATES: {
    GET: (id: string) => `/api/certificates/${id}`,
  },

  // Invitations
  INVITATIONS: {
    CREATE: "/api/invitations",
    BY_COMPANY: (companyId: string) =>
      `/api/invitations/company/${companyId}`,
    DELETE: (invitationId: string) => `/api/invitations/${invitationId}`,
    RESEND: (invitationId: string) => `/api/invitations/${invitationId}/resend`,
    ACCEPT:  `/api/auth/accept-invite`,
  },
} as const;
