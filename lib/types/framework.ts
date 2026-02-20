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
  id:        string;
  companyId: string;
  year:      number;
  framework: AssessmentFramework;
  status:    string;
  progress:  string;
  dueDate:   null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentFramework {
  id:            string;
  code:          string;
  name:          string;
  description:   string;
  version:       string;
  effectiveDate: Date;
}