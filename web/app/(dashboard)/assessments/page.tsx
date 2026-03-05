"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search01Icon,
  PlusSignIcon,
  Delete02Icon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  Time01Icon,
  QuestionIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeButton } from "@/components/theme-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const INITIAL_ASSESSMENTS = [
  {
    id: "a1",
    title: "Frontend Developer L01",
    status: "Active",
    difficulty: "Easy",
    questions: 10,
    duration: 120,
  },
  {
    id: "a2",
    title: "Backend Engineer Assessment",
    status: "Active",
    difficulty: "Medium",
    questions: 15,
    duration: 90,
  },
  {
    id: "a3",
    title: "UI/UX Designer Challenge",
    status: "Inactive",
    difficulty: "Easy",
    questions: 8,
    duration: 60,
  },
  {
    id: "a4",
    title: "DevOps Engineer – Level 2",
    status: "Active",
    difficulty: "Hard",
    questions: 20,
    duration: 180,
  },
  {
    id: "a5",
    title: "Data Analyst Screening",
    status: "Active",
    difficulty: "Medium",
    questions: 12,
    duration: 75,
  },
  {
    id: "a6",
    title: "Mobile Developer L01",
    status: "Inactive",
    difficulty: "Easy",
    questions: 10,
    duration: 120,
  },
];

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-500",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "bg-blue-50 text-blue-600",
  Medium: "bg-amber-50 text-amber-600",
  Hard: "bg-red-50 text-red-600",
};

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS);
  const [deleteTarget, setDeleteTarget] = useState<
    (typeof INITIAL_ASSESSMENTS)[0] | null
  >(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPreviewLink = (id: string) => {
    const url = `${window.location.origin}/assessment/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setAssessments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="px-8 py-4 flex items-center justify-between">
        <h1 className="text-[28px] font-medium text-slate-900 leading-none">
          Assessments
        </h1>
        <ThemeButton
          asChild
          href="/assessments/new"
          className="h-10 px-4 gap-2 text-sm shadow-none border-none"
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            className="size-4"
            strokeWidth={2.5}
          />
          <span>New Assessment</span>
        </ThemeButton>
      </div>

      <div className="border-y border-slate-200 px-8 py-3.5 flex items-center gap-4">
        <div className="relative w-80">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none"
          />
          <Input
            placeholder="Search assessments…"
            className="pl-11 h-10! bg-white border-slate-200 shadow-none rounded-lg text-sm placeholder:text-slate-300 transition-[border-color] duration-200 ease-in-out"
          />
        </div>
        <Select>
          <SelectTrigger className="w-36 h-10! bg-white border-slate-200 shadow-none rounded-lg text-slate-500 text-sm focus:ring-0 px-4">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-slate-200">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-36 h-10! bg-white border-slate-200 shadow-none rounded-lg text-slate-500 text-sm focus:ring-0 px-4">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-slate-200">
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          className="text-slate-600 font-medium text-sm h-10 px-4 hover:bg-transparent hover:text-slate-900 border-none ml-2"
        >
          Clear All
        </Button>
      </div>

      <div className="px-8 py-6">
        {assessments.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
            No assessments found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assessments.map((a) => (
              <div
                key={a.id}
                className="flex flex-col border border-slate-200 rounded-lg bg-white"
              >
                {/* Card body */}
                <div className="flex flex-col gap-2.5 px-5 pt-5 pb-4">
                  {/* Title */}
                  <Link
                    href={`/assessments/${a.id}`}
                    className="text-[15px] font-semibold text-slate-800 leading-snug hover:underline underline-offset-4 decoration-1 truncate"
                  >
                    {a.title}
                  </Link>

                  {/* Badges + stats in one row */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center text-[12px] font-medium px-2.5 py-1 rounded-md ${STATUS_STYLES[a.status] ?? "bg-slate-100 text-slate-500"}`}
                    >
                      {a.status}
                    </span>
                    <span
                      className={`inline-flex items-center text-[12px] font-medium px-2.5 py-1 rounded-md ${DIFFICULTY_STYLES[a.difficulty] ?? "bg-slate-100 text-slate-500"}`}
                    >
                      {a.difficulty}
                    </span>
                    <span className="ml-auto flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[12px] text-slate-400">
                        <HugeiconsIcon
                          icon={QuestionIcon}
                          className="size-3.5"
                        />
                        {a.questions}
                      </span>
                      <span className="flex items-center gap-1 text-[12px] text-slate-400">
                        <HugeiconsIcon icon={Time01Icon} className="size-3.5" />
                        {a.duration}m
                      </span>
                    </span>
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-t border-slate-100">
                  <ThemeButton
                    className="h-8 px-6 text-[12px] font-medium shadow-none border-none rounded-md"
                    onClick={() => {}}
                  >
                    Edit
                  </ThemeButton>
                  <button
                    onClick={() => copyPreviewLink(a.id)}
                    className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium border ${
                      copiedId === a.id
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={
                        copiedId === a.id ? CheckmarkCircle01Icon : Copy01Icon
                      }
                      className="size-3.5"
                    />
                    {copiedId === a.id ? "Copied!" : "Copy link"}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(a)}
                    className="ml-auto inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent className="max-w-sm rounded-xl border-slate-200 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[17px] font-semibold text-slate-900">
              Delete Assessment?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-slate-500 leading-relaxed">
              <strong className="text-slate-700">{deleteTarget?.title}</strong>{" "}
              will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-9 px-5 rounded-lg border-slate-200 text-slate-600 text-[13px] font-medium shadow-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="h-9 px-5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium shadow-none border-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
