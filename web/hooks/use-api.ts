"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serverFetch } from "@/lib/auth-action";
import type {
  Job, JobDetail, PipelineStage, CurrentUser, ChatMessage,
  CustomQuestion, Company, Department, Assessment, AssessmentQuestion,
  Candidate, CandidateDetail,
} from "@/types";

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => serverFetch<{ data: Job[] }>("/jobs"),
  });
}

export function useJob(id: number) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => serverFetch<{ data: JobDetail }>(`/jobs/${id}`),
    enabled: !!id,
  });
}

export function usePipeline(jobId: number) {
  return useQuery({
    queryKey: ["jobs", jobId, "pipeline"],
    queryFn: () => serverFetch<{ data: PipelineStage[] }>(`/jobs/${jobId}/pipeline`),
    enabled: !!jobId,
  });
}

export function useCreateStage(jobId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; position: number; stageType?: string }) =>
      serverFetch<{ data: PipelineStage }>(`/jobs/${jobId}/pipeline`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "pipeline"] });
    },
  });
}

export function useUpdateStage(jobId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stageId, data }: { stageId: number; data: { name?: string; stageType?: string; position?: number } }) =>
      serverFetch<{ data: PipelineStage }>(`/jobs/${jobId}/pipeline/${stageId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "pipeline"] });
    },
  });
}

export function useDeleteStage(jobId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stageId: number) =>
      serverFetch<{ data: PipelineStage }>(`/jobs/${jobId}/pipeline/${stageId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "pipeline"] });
    },
  });
}

export function useCustomQuestions(jobId: number) {
  return useQuery({
    queryKey: ["jobs", jobId, "questions"],
    queryFn: () => serverFetch<{ data: CustomQuestion[] }>(`/jobs/${jobId}/questions`),
    enabled: !!jobId,
  });
}

export function useCreateQuestion(jobId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      questionType: "short_answer" | "long_answer" | "checkbox" | "radio";
      isRequired: boolean;
      position: number;
      options?: { label: string; isCorrect: boolean; position: number }[];
    }) =>
      serverFetch<{ data: CustomQuestion }>(`/jobs/${jobId}/questions`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "questions"] });
    },
  });
}

export function useUpdateQuestion(jobId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: number;
      data: {
        title?: string;
        questionType?: "short_answer" | "long_answer" | "checkbox" | "radio";
        isRequired?: boolean;
      };
    }) =>
      serverFetch<{ data: CustomQuestion }>(`/jobs/${jobId}/questions/${questionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "questions"] });
    },
  });
}

export function useDeleteQuestion(jobId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: number) =>
      serverFetch<{ data: CustomQuestion }>(`/jobs/${jobId}/questions/${questionId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "questions"] });
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => serverFetch<{ data: CurrentUser }>("/users/me"),
  });
}

export function useChatHistory(jobId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["chat", "job", jobId],
    queryFn: () => serverFetch<{ data: ChatMessage[] }>(`/chat/job/${jobId}`),
    enabled: enabled && !!jobId,
  });
}

export function useCompany() {
  return useQuery({
    queryKey: ["company"],
    queryFn: () => serverFetch<{ data: Company | null }>("/company"),
  });
}

export function useUpsertCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Company>) =>
      serverFetch<{ data: Company }>("/company", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => serverFetch<{ data: Department[] }>("/company/departments"),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) =>
      serverFetch<{ data: Department }>("/company/departments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      serverFetch<{ data: Department }>(`/company/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      serverFetch<{ data: Department }>(`/company/departments/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      departmentId: number;
      employmentType: string;
      location?: string;
      description?: string;
      skills?: string[];
      salaryType?: "fixed" | "range" | null;
      currency?: string | null;
      payFrequency?: string | null;
      salaryFixed?: number | null;
      salaryMin?: number | null;
      salaryMax?: number | null;
    }) =>
      serverFetch<{ data: Job }>("/jobs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useUpdateJob(jobId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Job>) =>
      serverFetch<{ data: Job }>(`/jobs/${jobId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: number) =>
      serverFetch<{ data: Job }>(`/jobs/${jobId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

// assessments

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: () => serverFetch<{ data: Assessment[] }>("/assessments"),
  });
}

export function useJobAssessments(jobId: number) {
  return useQuery({
    queryKey: ["jobs", jobId, "assessments"],
    queryFn: () =>
      serverFetch<{
        data: { id: number; assessmentId: number; triggerStageId: number; createdAt: string }[];
      }>(`/jobs/${jobId}/assessments`),
    enabled: !!jobId,
  });
}

export function useAttachAssessment(jobId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { assessmentId: number; triggerStageId: number }) =>
      serverFetch<{ data: any }>(`/jobs/${jobId}/assessments`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "assessments"] });
    },
  });
}

export function useDetachAssessment(jobId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId: number) =>
      serverFetch<{ data: any }>(`/jobs/${jobId}/assessments/${attachmentId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "assessments"] });
    },
  });
}

export function useAssessment(id: number) {
  return useQuery({
    queryKey: ["assessments", id],
    queryFn: () => serverFetch<{ data: Assessment & { questions: (AssessmentQuestion & { options: { id: number; label: string; isCorrect: boolean; position: number }[] })[] } }>(`/assessments/${id}`),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string | null;
      timeLimit: number;
      passScore: number;
      createdBy?: number;
      questions?: any[];
    }) =>
      serverFetch<{ data: Assessment }>("/assessments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}

export function useUpdateAssessment(assessmentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Assessment>) =>
      serverFetch<{ data: Assessment }>(`/assessments/${assessmentId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessments", assessmentId] });
    },
  });
}
export function useDeleteAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assessmentId: number) =>
      serverFetch<{ data: Assessment }>(`/assessments/${assessmentId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}

export function useCreateAssessmentQuestion(assessmentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string | null;
      questionType: "short_answer" | "multiple_choice";
      points?: number;
      position: number;
      options?: { label: string; isCorrect?: boolean; position: number }[];
    }) =>
      serverFetch<{ data: AssessmentQuestion }>(`/assessments/${assessmentId}/questions`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments", assessmentId] });
    },
  });
}
export function useUpdateAssessmentQuestion(assessmentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: number;
      data: {
        title?: string;
        description?: string | null;
        questionType?: "short_answer" | "multiple_choice";
        points?: number;
        position?: number;
        options?: { label: string; isCorrect?: boolean; position: number }[];
      };
    }) =>
      serverFetch<{ data: AssessmentQuestion }>(`/assessments/${assessmentId}/questions/${questionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments", assessmentId] });
    },
  });
}
export function useDeleteAssessmentQuestion(assessmentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: number) =>
      serverFetch<{ data: AssessmentQuestion }>(`/assessments/${assessmentId}/questions/${questionId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments", assessmentId] });
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      offerId,
      data,
    }: {
      offerId: number;
      data: {
        salary?: number | null;
        currency?: string | null;
        payFrequency?: "hourly" | "daily" | "weekly" | "monthly" | "yearly" | null;
        startDate?: string | null;
        expiryDate?: string | null;
        status?: "draft" | "sent" | "pending" | "accepted" | "declined" | "withdrawn";
      };
    }) =>
      serverFetch<{ data: unknown }>(`/offers/${offerId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}

export function useCandidates(jobId?: number, filters?: { stageId?: number; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.stageId) params.set("stageId", String(filters.stageId));
  if (filters?.search) params.set("search", filters.search);
  const query = params.toString() ? `?${params.toString()}` : "";

  const path = jobId ? `/candidates/jobs/${jobId}${query}` : `/candidates${query}`;

  return useQuery({
    queryKey: ["candidates", jobId ?? "all", filters],
    queryFn: () => serverFetch<{ data: Candidate[] }>(path),
  });
}

export function useCandidate(id: number) {
  return useQuery({
    queryKey: ["candidates", id],
    queryFn: () => serverFetch<{ data: CandidateDetail }>(`/candidates/${id}`),
    enabled: !!id,
  });
}

export function useMoveCandidateStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newStageId }: { id: number; newStageId: number }) =>
      serverFetch<{ data: Candidate }>(`/candidates/${id}/stage`, {
        method: "PUT",
        body: JSON.stringify({ newStageId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}

export function useCandidateAssessments(candidateId: number) {
  return useQuery({
    queryKey: ["candidate-assessments", candidateId],
    queryFn: () =>
      serverFetch<{
        data: {
          id: number;
          assessmentId: number;
          assessmentTitle: string;
          token: string;
          status: string;
          scorePercentage: number | null;
          passed: boolean | null;
          startedAt: string | null;
          completedAt: string | null;
          expiresAt: string;
        }[];
      }>(`/assessment-execution/candidate/${candidateId}`),
    enabled: !!candidateId,
  });
}

export function useInviteToAssessment() {
  return useMutation({
    mutationFn: ({
      candidateId,
      assessmentId,
      expiryDays = 7,
    }: {
      candidateId: number;
      assessmentId: number;
      expiryDays?: number;
    }) =>
      serverFetch<{ data: { token: string } }>(`/assessment-execution/invite`, {
        method: "POST",
        body: JSON.stringify({ candidateId, assessmentId, expiryDays }),
      }),
  });
}

export function useDeleteCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      serverFetch<{ data: Candidate }>(`/candidates/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}