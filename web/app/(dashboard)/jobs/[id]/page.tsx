"use client";

import { useState, useEffect } from "react";
import type { Ref } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Link01Icon,
  PlusSignIcon,
  Settings02Icon,
  PencilEdit01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
  TextIcon,
  ParagraphIcon,
  Tick02Icon,
  CircleIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import {
  useJob,
  usePipeline,
  useCurrentUser,
  useChatHistory,
  useCreateStage,
  useUpdateStage,
  useDeleteStage,
  useCustomQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from "@/hooks/use-api";
import { useJobChat } from "@/hooks/use-job-chat";
import type { PipelineStage, JobDetail, CustomQuestion } from "@/types";

const STAGE_COLORS: Record<PipelineStage["stageType"], string> = {
  none: "bg-slate-400",
  source: "bg-blue-400",
  assessment: "bg-purple-500",
  interview: "bg-blue-500",
  offer: "bg-green-500",
  rejection: "bg-red-500",
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

const STATUS_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  draft:     { label: "Draft",     bg: "bg-amber-50",   text: "text-amber-600" },
  inactive:  { label: "Inactive",  bg: "bg-slate-100",  text: "text-slate-500" },
  published: { label: "Active Job",bg: "bg-[#E6F4EA]",  text: "text-[#1E8E3E]" },
  closed:    { label: "Closed",    bg: "bg-red-50",     text: "text-red-500"   },
  archived:  { label: "Archived",  bg: "bg-slate-100",  text: "text-slate-500" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatSalary(job: JobDetail) {
  if (!job.salaryType) return null;
  const fmt = (n: string | null) => (n ? Number(n).toLocaleString() : "");
  const freq = job.payFrequency ?? "";
  if (job.salaryType === "fixed") return `${job.currency} ${fmt(job.salaryFixed)}/${freq}`;
  return `${job.currency} ${fmt(job.salaryMin)}-${fmt(job.salaryMax)}/${freq}`;
}
import { useDragSort } from "@/hooks/use-drag-sort";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = Number(params.id);

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const { data: jobData, isLoading: jobLoading } = useJob(jobId);
  const { data: pipelineData } = usePipeline(jobId);
  const { data: meData } = useCurrentUser();
  const { data: chatHistoryData } = useChatHistory(jobId, isNotesOpen);
  const { liveMessages, sendMessage } = useJobChat(jobId, isNotesOpen);
  const { data: customQuestionsData } = useCustomQuestions(jobId);

  const createStageMutation = useCreateStage(jobId);
  const updateStageMutation = useUpdateStage(jobId);
  const deleteStageMutation = useDeleteStage(jobId);
  const createQuestionMutation = useCreateQuestion(jobId);
  const updateQuestionMutation = useUpdateQuestion(jobId);
  const deleteQuestionMutation = useDeleteQuestion(jobId);

  const job = jobData?.data;
  const me = meData?.data;
  const historyMessages = (chatHistoryData?.data ?? []).slice().reverse();
  const allMessages = [...historyMessages, ...liveMessages];

  const handleSendNote = () => {
    if (!noteText.trim() || !me) return;
    sendMessage(me.id, noteText.trim());
    setNoteText("");
  };

  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<"short_answer" | "long_answer" | "checkbox" | "radio">("short_answer");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);

  useEffect(() => {
    if (customQuestionsData?.data) {
      setQuestions(customQuestionsData.data);
    }
  }, [customQuestionsData]);

  // ── Inline edit state ────────────────────────────────────────────────────
  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [editingStageName, setEditingStageName] = useState("");

  const handleSaveStage = (stageId: number) => {
    if (!editingStageName.trim()) return;
    updateStageMutation.mutate(
      { stageId, data: { name: editingStageName.trim() } },
      { onSuccess: () => setEditingStageId(null) }
    );
  };

  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editQuestionType, setEditQuestionType] = useState<"short_answer" | "long_answer" | "checkbox" | "radio">("short_answer");
  const [editQuestionRequired, setEditQuestionRequired] = useState(false);

  const openEditQuestion = (q: CustomQuestion) => {
    setEditingQuestionId(q.id);
    setEditQuestionText(q.title);
    setEditQuestionType(q.questionType);
    setEditQuestionRequired(q.isRequired);
  };

  const handleSaveQuestion = (questionId: number) => {
    if (!editQuestionText.trim()) return;
    updateQuestionMutation.mutate(
      {
        questionId,
        data: {
          title: editQuestionText.trim(),
          questionType: editQuestionType,
          isRequired: editQuestionRequired,
        },
      },
      { onSuccess: () => setEditingQuestionId(null) }
    );
  };

  // ── Hiring Process stage state ───────────────────────────────────────────
  const [stages, setStages] = useState<(PipelineStage & { color: string })[]>([]);

  useEffect(() => {
    if (pipelineData?.data) {
      setStages(
        pipelineData.data.map((s) => ({
          ...s,
          color: STAGE_COLORS[s.stageType] ?? "bg-slate-400",
        }))
      );
    }
  }, [pipelineData]);

  // Configure Stage dialog
  const [configOpen, setConfigOpen] = useState(false);
  const [configStage, setConfigStage] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [configType, setConfigType] = useState<"offer" | "rejection" | "none">(
    "none",
  );
  const [configOfferTemplate, setConfigOfferTemplate] = useState("");
  const [configMode, setConfigMode] = useState("");
  const [configExpiry, setConfigExpiry] = useState("");
  const [configRejectTemplate, setConfigRejectTemplate] = useState("");

  const openConfigure = (stage: { id: number; name: string }) => {
    setConfigStage(stage);
    setConfigType("none");
    setConfigOfferTemplate("");
    setConfigMode("");
    setConfigExpiry("");
    setConfigRejectTemplate("");
    setConfigOpen(true);
  };

  const [addStageOpen, setAddStageOpen] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    createStageMutation.mutate(
      { name: newStageName.trim(), position: stages.length + 1, stageType: "none" },
      {
        onSuccess: () => {
          setNewStageName("");
          setAddStageOpen(false);
        },
      }
    );
  };

  function moveItem<T>(list: T[], from: number, to: number): T[] {
    const copy = [...list];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="px-8 pt-10 pb-0 max-w-5xl w-full">
        <div className="space-y-2.5 mb-6">
          <div className="flex items-center gap-4 cursor-default">
            <h1 className="text-[28px] font-medium text-slate-900 leading-none">
              {jobLoading ? "Loading..." : (job?.title ?? "Job Not Found")}
            </h1>
            {job && STATUS_BADGE[job.status] && (
              <Badge
                className={`${STATUS_BADGE[job.status].bg} ${STATUS_BADGE[job.status].text} hover:opacity-90 border-none font-medium px-3 py-1 rounded-full text-xs shadow-none`}
              >
                {STATUS_BADGE[job.status].label}
              </Badge>
            )}
          </div>

          {job && (
            <div className="flex items-center text-sm font-medium text-slate-500 gap-2 cursor-default">
              <span>{EMPLOYMENT_LABELS[job.employmentType]}</span>
              {job.location && (
                <>
                  <span className="text-slate-300">-</span>
                  <span>{job.location}</span>
                </>
              )}
              {formatSalary(job) && (
                <>
                  <span className="text-slate-300">-</span>
                  <span className="text-slate-600 font-semibold text-xs">
                    {formatSalary(job)}
                  </span>
                </>
              )}
            </div>
          )}

          <Link
            href={`/careers/${jobId}`}
            target="_blank"
            className="flex items-center gap-2 text-[var(--theme-color)] text-[15px] font-medium hover:underline cursor-pointer group w-fit"
          >
            <HugeiconsIcon icon={Link01Icon} className="size-4" />
            <span>openats.org/careers/{jobId}</span>
          </Link>
        </div>

        <div className="flex items-center gap-8 py-2 mb-6">
          <div className="flex items-baseline gap-2 cursor-default shrink-0">
            <span className="text-2xl font-medium text-slate-900 leading-none">
              0
            </span>
            <span className="text-slate-600 font-medium leading-none">
              Candidates
            </span>
          </div>
          <Link href={`/jobs/${jobId}/pipeline`}>
            <Button className="bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] text-white rounded-lg h-10 px-7 font-medium shadow-none border-none gap-2 transition-all active:scale-[0.98]">
              <span>Go To Hiring Pipeline</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4"
                strokeWidth={3}
              />
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full border-y border-slate-100 py-3 bg-white shadow-none">
          <div className="px-8 max-w-5xl w-full">
            <TabsList className="bg-transparent w-full justify-start rounded-none h-auto p-0 gap-3">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent !shadow-none border border-slate-200 data-[state=active]:border-[var(--theme-color)] rounded-lg px-6 h-[38px] text-slate-600 data-[state=active]:text-[var(--theme-color)] font-medium text-[15px] transition-all hover:bg-slate-50 flex items-center justify-center"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="hiring-team"
                className="data-[state=active]:bg-transparent !shadow-none border border-slate-200 data-[state=active]:border-[var(--theme-color)] rounded-lg px-6 h-[38px] text-slate-600 data-[state=active]:text-[var(--theme-color)] font-medium text-[15px] transition-all hover:bg-slate-50 flex items-center justify-center"
              >
                Hiring Team
              </TabsTrigger>
              <TabsTrigger
                value="hiring-process"
                className="data-[state=active]:bg-transparent !shadow-none border border-slate-200 data-[state=active]:border-[var(--theme-color)] rounded-lg px-6 h-[38px] text-slate-600 data-[state=active]:text-[var(--theme-color)] font-medium text-[15px] transition-all hover:bg-slate-50 flex items-center justify-center"
              >
                Hiring Process
              </TabsTrigger>
              <button
                onClick={() => setIsNotesOpen(true)}
                className="border border-slate-200 rounded-lg px-6 h-[38px] text-slate-600 font-medium text-[15px] transition-all hover:bg-slate-50 inline-flex items-center justify-center whitespace-nowrap"
              >
                Internal Notes
              </button>
              <TabsTrigger
                value="custom-questions"
                className="data-[state=active]:bg-transparent !shadow-none border border-slate-200 data-[state=active]:border-[var(--theme-color)] rounded-lg px-6 h-[38px] text-slate-600 data-[state=active]:text-[var(--theme-color)] font-medium text-[15px] transition-all hover:bg-slate-50 flex items-center justify-center"
              >
                Custom Questions
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="px-8 pb-20 w-full">
          <TabsContent
            value="overview"
            className="pt-10 animate-in fade-in duration-300 max-w-4xl"
          >
            {jobLoading ? (
              <p className="text-slate-400 text-[15px]">Loading...</p>
            ) : job?.description ? (
              <div
                className="text-slate-600 leading-relaxed text-[15px] [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:font-semibold [&_h2]:text-slate-800 [&_h2]:mb-2 [&_h3]:font-medium [&_h3]:text-slate-700 [&_h3]:mb-1"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            ) : (
              <p className="text-slate-400 text-[15px]">No description provided.</p>
            )}
          </TabsContent>

          <TabsContent
            value="hiring-team"
            className="pt-10 space-y-12 animate-in fade-in duration-300"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-medium text-[15px]">
                    Hiring Manager
                  </span>
                  <button className="flex items-center gap-2 text-[var(--theme-color)] hover:underline font-medium text-[14px]">
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      className="size-3.5"
                      strokeWidth={3}
                    />
                    <span>Add New Hiring Manager</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-full bg-[var(--theme-color)] flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                  <div className="w-full h-full bg-[var(--theme-color)]" />
                </div>
                <span className="text-slate-700 font-medium text-[15px]">
                  Chamal Senarathna
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-medium text-[15px]">
                    Interviewer
                  </span>
                  <button className="flex items-center gap-2 text-[var(--theme-color)] hover:underline font-medium text-[14px]">
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      className="size-3.5"
                      strokeWidth={3}
                    />
                    <span>Add New Interviewer</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-full bg-[var(--theme-color)] flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                  <div className="w-full h-full bg-[var(--theme-color)]" />
                </div>
                <span className="text-slate-700 font-medium text-[15px]">
                  Risikesan Jegatheesan
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="hiring-process"
            className="pt-10 space-y-6 animate-in fade-in duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-slate-900 font-semibold text-[17px]">
                  Hiring Pipeline Stages
                </h3>
                <p className="text-slate-500 text-[13px]">
                  Drag To Reorder Stages. Click To Edit Or Remove.
                </p>
              </div>
              <Button
                onClick={() => {
                  setNewStageName("");
                  setAddStageOpen(true);
                }}
                className="bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] text-white rounded-lg h-10 px-4 font-medium shadow-none border-none gap-2 text-sm"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  className="size-4"
                  strokeWidth={3}
                />
                <span>Add New Stage</span>
              </Button>
            </div>

            <div className="space-y-2 pt-4">
              {stages.map((stage, index) => {
                function StageDraggable() {
                  const { ref, isDragging, isOver } = useDragSort({
                    id: stage.id,
                    index,
                    type: "HIRING_STAGE",
                    onMove: (from, to) =>
                      setStages((prev) => moveItem(prev, from, to)),
                  });
                  return (
                    <div
                      ref={ref as Ref<HTMLDivElement>}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all group bg-white ${
                        isDragging
                          ? "opacity-40 border-slate-300"
                          : isOver
                            ? "border-[var(--theme-color)]/40 bg-[var(--theme-color)]/5"
                            : "border-slate-200/70 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <HugeiconsIcon
                          icon={DragDropVerticalIcon}
                          className="size-5 text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing shrink-0"
                        />
                        <div className={`size-2 rounded-full ${stage.color} shrink-0`} />
                        {editingStageId === stage.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              autoFocus
                              value={editingStageName}
                              onChange={(e) => setEditingStageName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveStage(stage.id);
                                if (e.key === "Escape") setEditingStageId(null);
                              }}
                              className="h-8 border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-slate-300 text-[14px] w-48"
                            />
                            <button
                              onClick={() => handleSaveStage(stage.id)}
                              disabled={updateStageMutation.isPending}
                              className="text-xs font-medium text-white bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] px-3 h-8 rounded-md disabled:opacity-50"
                            >
                              {updateStageMutation.isPending ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingStageId(null)}
                              className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 h-8 rounded-md border border-slate-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-700 font-medium text-[15px]">
                            {stage.name}
                          </span>
                        )}
                      </div>
                      {editingStageId !== stage.id && (
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              openConfigure({ id: stage.id, name: stage.name })
                            }
                            className="text-[var(--theme-color)]/60 hover:text-[var(--theme-color)] transition-colors"
                            title="Configure Stage"
                          >
                            <HugeiconsIcon
                              icon={Settings02Icon}
                              className="size-[18px]"
                            />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStageId(stage.id);
                              setEditingStageName(stage.name);
                            }}
                            className="text-[var(--theme-color)]/60 hover:text-[var(--theme-color)] transition-colors"
                          >
                            <HugeiconsIcon
                              icon={PencilEdit01Icon}
                              className="size-[18px]"
                            />
                          </button>
                          <button
                            onClick={() => deleteStageMutation.mutate(stage.id)}
                            disabled={deleteStageMutation.isPending}
                            className="text-red-400/80 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            <HugeiconsIcon
                              icon={Delete02Icon}
                              className="size-[18px]"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }
                return <StageDraggable key={stage.id} />;
              })}
            </div>
          </TabsContent>

          <TabsContent
            value="custom-questions"
            className="pt-10 space-y-8 animate-in fade-in duration-300"
          >
            <div className="flex flex-col gap-6">
              <button
                onClick={() => setIsAddingMode(true)}
                className="flex items-center gap-2 text-[var(--theme-color)] hover:underline font-medium text-[15px] w-fit"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  className="size-4"
                  strokeWidth={3}
                />
                <span>Add Custom Question</span>
              </button>

              <div className="space-y-3">
                {questions.map((q, index) => {
                  function QuestionDraggable() {
                    const { ref, isDragging, isOver } = useDragSort({
                      id: q.id,
                      index,
                      type: "CUSTOM_QUESTION",
                      onMove: (from, to) =>
                        setQuestions((prev) => moveItem(prev, from, to)),
                    });
                    return (
                      <div
                        ref={ref as Ref<HTMLDivElement>}
                        className={`group relative border rounded-lg bg-white transition-all ${
                          isDragging
                            ? "opacity-40 border-slate-300"
                            : isOver
                              ? "border-[var(--theme-color)]/40 bg-[var(--theme-color)]/5"
                              : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {editingQuestionId === q.id ? (
                          <div className="p-3 space-y-4 animate-in fade-in duration-150">
                            <div className="flex flex-wrap items-center gap-4">
                              <Select
                                value={editQuestionType}
                                onValueChange={(val) =>
                                  setEditQuestionType(val as "short_answer" | "long_answer" | "checkbox" | "radio")
                                }
                              >
                                <SelectTrigger className="w-[180px] h-10 border-slate-200 bg-white shadow-none text-slate-600 focus:ring-1 focus:ring-slate-300">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-slate-200 shadow-md">
                                  <SelectItem value="short_answer">
                                    <div className="flex items-center gap-2">
                                      <HugeiconsIcon icon={TextIcon} className="size-4" />
                                      <span>Short Answer</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="long_answer">
                                    <div className="flex items-center gap-2">
                                      <HugeiconsIcon icon={ParagraphIcon} className="size-4" />
                                      <span>Long Answer</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="checkbox">
                                    <div className="flex items-center gap-2">
                                      <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                                      <span>Checkbox</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="radio">
                                    <div className="flex items-center gap-2">
                                      <HugeiconsIcon icon={CircleIcon} className="size-4" />
                                      <span>Radio Button</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                autoFocus
                                placeholder="Enter the question here"
                                value={editQuestionText}
                                onChange={(e) => setEditQuestionText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveQuestion(q.id);
                                  if (e.key === "Escape") setEditingQuestionId(null);
                                }}
                                className="flex-1 h-10 border-slate-200 bg-white shadow-none focus-visible:ring-1 focus-visible:ring-slate-300 text-[15px]"
                              />
                              <div className="flex items-center gap-2 px-2">
                                <Checkbox
                                  id={`edit-required-${q.id}`}
                                  checked={editQuestionRequired}
                                  onCheckedChange={(v) => setEditQuestionRequired(!!v)}
                                  className="size-4 border-slate-300 data-[state=checked]:bg-[var(--theme-color)] data-[state=checked]:border-[var(--theme-color)]"
                                />
                                <Label
                                  htmlFor={`edit-required-${q.id}`}
                                  className="text-slate-600 font-medium text-[15px] cursor-pointer"
                                >
                                  Required
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingQuestionId(null)}
                                  className="h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 font-medium shadow-none"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  disabled={!editQuestionText.trim() || updateQuestionMutation.isPending}
                                  onClick={() => handleSaveQuestion(q.id)}
                                  className="h-10 px-6 bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] text-white shadow-none rounded-lg font-medium disabled:opacity-50"
                                >
                                  {updateQuestionMutation.isPending ? "Saving…" : "Save Changes"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                                {q.questionType === "short_answer" && (
                                  <HugeiconsIcon icon={TextIcon} className="size-4" />
                                )}
                                {q.questionType === "long_answer" && (
                                  <HugeiconsIcon icon={ParagraphIcon} className="size-4" />
                                )}
                                {q.questionType === "checkbox" && (
                                  <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                                )}
                                {q.questionType === "radio" && (
                                  <HugeiconsIcon icon={CircleIcon} className="size-4" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-slate-700 font-medium text-[15px]">
                                  {q.title}
                                </span>
                                {q.isRequired && (
                                  <span className="text-[11px] text-red-500 font-medium">Required</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => openEditQuestion(q)}
                                className="p-1.5 text-slate-400 hover:text-[var(--theme-color)] transition-colors"
                              >
                                <HugeiconsIcon
                                  icon={PencilEdit01Icon}
                                  className="size-[18px]"
                                />
                              </button>
                              <button
                                onClick={() => deleteQuestionMutation.mutate(q.id)}
                                disabled={deleteQuestionMutation.isPending}
                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                              >
                                <HugeiconsIcon
                                  icon={Delete02Icon}
                                  className="size-[18px]"
                                />
                              </button>
                              <button className="p-1.5 text-slate-300 cursor-grab active:cursor-grabbing">
                                <HugeiconsIcon
                                  icon={DragDropVerticalIcon}
                                  className="size-[18px]"
                                />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return <QuestionDraggable key={q.id} />;
                })}

                {isAddingMode && (
                  <div className="p-3 border border-slate-200 rounded-lg bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-wrap items-center gap-4">
                      <Select
                        defaultValue="short_answer"
                        onValueChange={(val) =>
                          setNewQuestionType(val as "short_answer" | "long_answer" | "checkbox" | "radio")
                        }
                      >
                        <SelectTrigger className="w-[180px] h-10 border-slate-200 bg-white shadow-none text-slate-600 focus:ring-1 focus:ring-slate-300">
                          <SelectValue placeholder="Question Type" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-200 shadow-md">
                          <SelectItem value="short_answer">
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon icon={TextIcon} className="size-4" />
                              <span>Short Answer</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="long_answer">
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon icon={ParagraphIcon} className="size-4" />
                              <span>Long Answer</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="checkbox">
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                              <span>Checkbox</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="radio">
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon icon={CircleIcon} className="size-4" />
                              <span>Radio Button</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Enter the question here"
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        className="flex-1 h-10 border-slate-200 bg-white shadow-none focus-visible:ring-1 focus-visible:ring-slate-300 text-[15px]"
                      />

                      {(newQuestionType === "radio" ||
                        newQuestionType === "checkbox" ||
                        newQuestionType === "boolean") && (
                        <Dialog>
                          <DialogTrigger
                            render={
                              <Button
                                variant="outline"
                                className="h-10 border-[var(--theme-color)] text-[var(--theme-color)] hover:bg-slate-50 font-medium px-4 shadow-none gap-2"
                              />
                            }
                          >
                            <HugeiconsIcon
                              icon={Settings02Icon}
                              className="size-4"
                            />
                            <span>Setup Options & Logic</span>
                          </DialogTrigger>
                          <DialogContent className="max-w-md border-slate-200">
                            <DialogHeader>
                              <DialogTitle className="text-slate-900">
                                Setup Question Logic
                              </DialogTitle>
                              <DialogDescription className="text-slate-500">
                                Add options and define the logic for this
                                question.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label className="text-slate-700">
                                  Options
                                </Label>
                                <div className="space-y-2">
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Option 1"
                                      className="h-9 border-slate-200 text-sm"
                                    />
                                    <Button
                                      variant="ghost"
                                      className="size-9 p-0 text-red-500"
                                    >
                                      <HugeiconsIcon
                                        icon={Delete02Icon}
                                        className="size-4"
                                      />
                                    </Button>
                                  </div>
                                  <button className="text-[var(--theme-color)] text-sm font-medium hover:underline flex items-center gap-1">
                                    <HugeiconsIcon
                                      icon={PlusSignIcon}
                                      className="size-3"
                                      strokeWidth={3}
                                    />
                                    <span>Add Another Option</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button className="bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] text-white font-medium px-5">
                                Save Logic
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      <div className="flex items-center gap-2 px-2">
                        <Checkbox
                          id="required"
                          checked={newQuestionRequired}
                          onCheckedChange={(v) => setNewQuestionRequired(!!v)}
                          className="size-4 border-slate-300 data-[state=checked]:bg-[var(--theme-color)] data-[state=checked]:border-[var(--theme-color)]"
                        />
                        <Label
                          htmlFor="required"
                          className="text-slate-600 font-medium text-[15px] cursor-pointer"
                        >
                          Required
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddingMode(false);
                            setNewQuestionText("");
                            setNewQuestionRequired(false);
                          }}
                          className="h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 font-medium shadow-none"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={!newQuestionText.trim() || createQuestionMutation.isPending}
                          className="h-10 px-6 bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] text-white shadow-none rounded-lg font-medium disabled:opacity-50"
                          onClick={() => {
                            if (!newQuestionText.trim()) return;
                            createQuestionMutation.mutate(
                              {
                                title: newQuestionText.trim(),
                                questionType: newQuestionType,
                                isRequired: newQuestionRequired,
                                position: questions.length + 1,
                              },
                              {
                                onSuccess: () => {
                                  setIsAddingMode(false);
                                  setNewQuestionText("");
                                  setNewQuestionRequired(false);
                                  setNewQuestionType("short_answer");
                                },
                              }
                            );
                          }}
                        >
                          {createQuestionMutation.isPending ? "Adding..." : "Add Question"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button className="bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] text-white rounded-lg h-10 px-6 font-medium shadow-none">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="!top-[18%] !translate-y-0 max-w-[780px] sm:max-w-[780px] rounded-lg border-slate-200 shadow-lg p-7 duration-0 data-open:zoom-in-100 data-closed:zoom-out-100">
          <DialogHeader className="mb-1">
            <DialogTitle className="text-[19px] font-semibold text-slate-900">
              Configure Stage
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-7 py-3.5 border-b border-slate-100">
            {(["offer", "rejection", "none"] as const).map((t) => (
              <label
                key={t}
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setConfigType(t)}
              >
                <div
                  className={`size-[17px] rounded-full border-2 flex items-center justify-center ${
                    configType === t
                      ? "border-[var(--theme-color)]"
                      : "border-slate-300"
                  }`}
                >
                  {configType === t && (
                    <div className="size-2.5 rounded-full bg-[var(--theme-color)]" />
                  )}
                </div>
                <span
                  className={`text-[15px] font-medium ${
                    configType === t
                      ? "text-[var(--theme-color)]"
                      : "text-slate-600"
                  }`}
                >
                  {t === "rejection"
                    ? "Rejecttion"
                    : t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </label>
            ))}
          </div>

          {configType === "offer" && (
            <div className="space-y-4 pt-1">
              <div>
                <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                  Select Offer Template
                </Label>
                <Select
                  value={configOfferTemplate}
                  onValueChange={(val) => setConfigOfferTemplate(val || "")}
                >
                  <SelectTrigger className="w-full h-10 border-slate-200 rounded-md shadow-none text-slate-400 focus:ring-0 text-sm">
                    <SelectValue placeholder="Software Engineering Offer Template" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-200 shadow-md">
                    <SelectItem value="se-offer">
                      Software Engineering Offer Template
                    </SelectItem>
                    <SelectItem value="design-offer">
                      Design Offer Template
                    </SelectItem>
                    <SelectItem value="ops-offer">
                      Operations Offer Template
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                    Mode ( Auto-Draft Or Auto-Send )
                  </Label>
                  <Select
                    value={configMode}
                    onValueChange={(val) => setConfigMode(val || "")}
                  >
                    <SelectTrigger className="w-full h-10 border-slate-200 rounded-md shadow-none text-slate-400 focus:ring-0 text-sm">
                      <SelectValue placeholder="Click here to select the mode" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-slate-200 shadow-md">
                      <SelectItem value="auto-draft">Auto-Draft</SelectItem>
                      <SelectItem value="auto-send">Auto-Send</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                    Expiry Days
                  </Label>
                  <Input
                    type="number"
                    value={configExpiry}
                    onChange={(e) => setConfigExpiry(e.target.value)}
                    className="h-10 border-slate-200 rounded-md shadow-none focus-visible:ring-0 focus-visible:border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {configType === "rejection" && (
            <div className="pt-1">
              <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                Select Rejection Email Template
              </Label>
              <Select
                value={configRejectTemplate}
                onValueChange={(val) => setConfigRejectTemplate(val || "")}
              >
                <SelectTrigger className="w-full h-10 border-slate-200 rounded-md shadow-none text-slate-400 focus:ring-0 text-sm">
                  <SelectValue placeholder="Software Engineering Offer Template" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-slate-200 shadow-md">
                  <SelectItem value="se-reject">
                    Software Engineering Rejection Template
                  </SelectItem>
                  <SelectItem value="generic-reject">
                    Generic Rejection Template
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="mt-5 gap-2">
            <Button
              variant="outline"
              onClick={() => setConfigOpen(false)}
              className="h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 font-medium shadow-none rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setConfigOpen(false)}
              className="h-10 px-6 bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] text-white font-medium shadow-none rounded-md border-none"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addStageOpen} onOpenChange={setAddStageOpen}>
        <DialogContent className="!top-[18%] !translate-y-0 max-w-[460px] rounded-lg border-slate-200 shadow-lg p-7 duration-0 data-open:zoom-in-100 data-closed:zoom-out-100">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-[19px] font-semibold text-slate-900">
              Add New Stage
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                Stage Name
              </Label>
              <Input
                autoFocus
                placeholder="e.g., First Interview , Technical Interview"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddStage()}
                className="h-10 border-slate-200 rounded-md shadow-none focus-visible:ring-0 focus-visible:border-slate-300 text-[14px] placeholder:text-slate-300"
              />
            </div>
            <div className="text-[13px] text-slate-500 space-y-0.5 pl-0.5">
              <p className="font-medium text-slate-600 mb-1">Tips:</p>
              <p>• Keep stage names short and descriptive</p>
              <p>• Use consistent naming conventions</p>
              <p>• Drag to reorder stages in the pipeline</p>
            </div>
          </div>

          <DialogFooter className="mt-5 gap-2">
            <Button
              variant="outline"
              onClick={() => setAddStageOpen(false)}
              className="h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 font-medium shadow-none rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStage}
              disabled={!newStageName.trim()}
              className="h-10 px-6 bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] text-white font-medium shadow-none rounded-md border-none disabled:opacity-50"
            >
              Add Stage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <SheetContent className="w-full sm:max-w-[540px] p-0 flex flex-col border-l border-slate-200 shadow-none">
          <SheetHeader className="p-5 border-b border-slate-100 bg-white">
            <SheetTitle className="text-lg font-semibold text-slate-900">
              Internal Notes
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
            {allMessages.length === 0 ? (
              <p className="text-slate-400 text-[13px] text-center pt-8">
                No notes yet. Be the first to add one.
              </p>
            ) : (
              allMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl space-y-3 w-full shadow-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[var(--theme-color)] flex items-center justify-center text-white text-[11px] font-semibold overflow-hidden shrink-0">
                      {msg.senderAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (msg.senderName?.[0] ?? "?").toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-semibold text-[13px] leading-tight">
                        {msg.senderName ?? "Unknown"}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {timeAgo(msg.sentAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-[13px] leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t border-slate-100 bg-white space-y-4">
            <div className="relative">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSendNote();
                }}
                placeholder="Add a note... (Ctrl+Enter to send)"
                className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl bg-white focus:ring-1 focus:ring-[var(--theme-color)]/20 focus:border-[var(--theme-color)] outline-none text-[14px] text-slate-700 transition-all resize-none shadow-none"
              />
            </div>
            <Button
              onClick={handleSendNote}
              disabled={!noteText.trim() || !me}
              className="w-full bg-[var(--theme-color)] hover:bg-[var(--theme-color-hover)] text-white rounded-lg h-11 font-medium shadow-none gap-2 border-none disabled:opacity-50"
            >
              <HugeiconsIcon
                icon={SentIcon}
                className="size-4 rotate-[-45deg]"
              />
              <span>Add Note</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
