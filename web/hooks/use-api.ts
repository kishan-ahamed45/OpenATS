"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serverFetch } from "@/lib/auth-action";
import type { Job, JobDetail, PipelineStage, CurrentUser, ChatMessage, CustomQuestion } from "@/types";

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
