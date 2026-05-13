export interface Framework {
  id: string | number;
  code: string;
  name: string;
  description?: string;
}

export interface FrameworkSelectBody {
  companyId: string;
  frameworkCode: string;
  year: number;
}

export interface FrameworkResponse {
   frameworks: Framework[];
}


export interface FrameworkCompanyResponse {
  frameworks: Assessment[];
}

export interface Assessment {
  id: string
  companyId: string
  year: number
  framework: AssessmentFramework
  status: string
  progress: string
  dueDate: null
  createdAt: Date
  updatedAt: Date
  /** Company–framework enrollment id when returned separately from assessment `id`; used for assisted requests. */
  companyFrameworkId?: string
}

export interface AssessmentFramework {
  id:            string;
  code:          string;
  name:          string;
  description:   string;
  version:       string;
  effectiveDate: Date | string;
  certificateId?: string | null;
}