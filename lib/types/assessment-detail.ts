export interface ControlProgressStatus {
  id: string;
  code: string;
  name: string;
}

export interface ControlProgress {
  id: string;
  status: ControlProgressStatus;
  assignedTo: string | null;
  assignedToComment: string | null;
  reviewedBy: string | null;
  reviewedByComment: string | null;
  completionPercentage: number;
  attachedEvidence: unknown[];
  reviewerStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentControl {
  id: string;
  code: string;
  question: string;
  requiredEvidence: string[];
  orderIndex: number | null;
  progress: ControlProgress;
}

export interface AssessmentControlArea {
  id: string;
  code: string;
  name: string;
  description: string;
  orderIndex: number | null;
  controls: AssessmentControl[];
  progress: ControlProgress | null;
}

export interface AssessmentFunction {
  id: string;
  code: string;
  name: string;
  description: string;
  orderIndex: number;
  controlAreas: AssessmentControlArea[];
  progress: ControlProgress | null;
}

export interface AssessmentDetailFramework {
  id: string;
  code: string;
  name: string;
  description: string;
  version: string;
  effectiveDate: string;
}

export interface AssessmentDetail {
  id: string;
  companyId: string;
  year: number;
  framework: AssessmentDetailFramework;
  status: string;
  progress: string;
  dueDate: string | null;
  assignedTo: string | null;
  functions: AssessmentFunction[];
  createdAt: string;
  updatedAt: string;
}
