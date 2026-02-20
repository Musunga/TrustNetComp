export interface LoginRequest {
  email: string;
  password: string;
}


export interface LoginResponseI {
  token: string;
  refreshToken: string;
  user: UserI;
  memberships: MembershipI[];
  activeMembership: MembershipI | null;
  selectedCompanyId: string | null;
  requiresCompanySelection: boolean;
  message: string;
}

export interface AuthSessionI {
  user: UserI;
  memberships: MembershipI[];
  activeMembership: MembershipI | null;
  selectedCompanyId: string | null;
  requiresCompanySelection: boolean;
  message: string;
}

export interface MembershipI {
  id:      string;
  status:  string;
  company: CompanyI;
  roles:   RoleI[];
}

export interface CompanyI {
  id:           string;
  name:         string;
  phoneNumber:  string;
  companyEmail: string;
  country:      string;
  city:         string;
}

export interface RoleI {
  id:   string;
  code: string;
  name: string;
}

export interface UserI {
  id:          string;
  email:       string;
  name:        string;
  firstName:   string;
  lastName:    string;
  jobTitle:    string;
  phoneNumber: string;
  timezone:    string;
  bio:         string;
}
