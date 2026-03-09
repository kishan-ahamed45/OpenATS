export type Job = {
  id: number;
  slug: string;
  title: string;
  departmentId: number;
  employmentType: "full_time" | "part_time" | "contract" | "internship" | "freelance";
  location: string | null;
  description: string | null;
  salaryType: "fixed" | "range" | null;
  currency: string | null;
  payFrequency: string | null;
  salaryFixed: string | null;
  salaryMin: string | null;
  salaryMax: string | null;
  status: "draft" | "inactive" | "published" | "closed" | "archived";
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  skills: string[];
};

export type PipelineStage = {
  id: number;
  jobId: number;
  name: string;
  position: number;
  stageType: "none" | "source" | "assessment" | "interview" | "offer" | "rejection";
  offerTemplateId: number | null;
  offerMode: "auto_draft" | "auto_send" | null;
  offerExpiryDays: number | null;
  rejectionTemplateId: number | null;
  sourceTemplateId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type JobDetail = Job & {
  pipelineStages: PipelineStage[];
  hiringTeam: { id: number; jobId: number; userId: number; addedAt: string }[];
};

export type CurrentUser = {
  id: number;
  asgardeoUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: "super_admin" | "hiring_manager" | "interviewer";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CustomQuestion = {
  id: number;
  jobId: number;
  title: string;
  questionType: "short_answer" | "long_answer" | "checkbox" | "radio";
  isRequired: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
  options: {
    id: number;
    questionId: number;
    label: string;
    isCorrect: boolean;
    position: number;
  }[];
};

export type ChatMessage = {
  id: number;
  message: string | null;
  senderId: number;
  sentAt: string;
  isSystemMessage: boolean;
  senderName: string | null;
  senderAvatar: string | null;
};

export type Department = {
  id: number;
  name: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export type Company = {
  id: number;
  name: string;
  email: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AssessmentOption = {
  id: number;
  questionId: number;
  label: string;
  isCorrect: boolean;
  position: number;
}

export type AssessmentQuestion = {
  id: number;
  assessmentId: number;
  title: string;
  description: string;
  questionType: "short_answer" | "multiple_choice";
  points: number;
  position: number;
  createdAt: string;
  updatedAt: string;
  options?: AssessmentOption[];
}

export type Assessment = {
  id: number;
  title: string;
  description: string | null;
  timeLimit: number;
  passScore: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  questions?: AssessmentQuestion[];
}