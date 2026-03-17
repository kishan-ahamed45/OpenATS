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

export type Candidate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  resumeUrl: string | null;
  jobId: number;
  currentStageId: number | null;
  appliedAt: string;
  updatedAt: string;
  stageName: string | null;
  jobTitle: string | null;

}

export type CandidateDetail = Candidate & {
  answers: {
    id: number;
    candidateId: number;
    questionId: number;
    questionTitle?: string | null;
    answerText: string | null;
    createdAt: string;
  }[];
  selections: {
    id: number;
    candidateId: number;
    questionId: number;
    questionTitle?: string | null;
    optionId: number;
    optionLabel?: string | null;
    createdAt: string;
  }[];
  history: {
    id: number;
    candidateId: number;
    stageId: number;
    movedBy: number | null;
    movedAt: string;
  }[];
  offer: {
    id: number;
    status: string;
    salary: string | null;
    currency: string | null;
    payFrequency: string | null;
    startDate: string | null;
    expiryDate: string | null;
    sentAt: string | null;
    renderedHtml: string | null;
  } | null;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "super_admin" | "admin" | "recruiter" | "hiring_manager" | "interviewer";
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TemplateBodyBlock = {
  type: "heading" | "text" | "button" | "image";
  content: string;
};

export type Template = {
  id: number;
  name: string;
  type: "offer" | "rejection" | "assessment_invite" | "general";
  subject: string;
  bodyJson: TemplateBodyBlock[];
  createdAt: string;
  updatedAt: string;
};

export type Offer = {
  id: number;
  candidateId: number;
  jobId: number;
  templateId: number | null;
  salary: number | null;
  currency: string | null;
  payFrequency: "hourly" | "daily" | "weekly" | "monthly" | "yearly" | null;
  startDate: string | null;
  expiryDate: string | null;
  status: "draft" | "sent" | "pending" | "accepted" | "declined" | "withdrawn";
  renderedHtml: string | null;
  createdAt: string;
  updatedAt: string;
};