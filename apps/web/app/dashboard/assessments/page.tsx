"use client"

import * as React from "react"
import Link from "next/link"
import {
  Search01Icon,
  PlusSignIcon,
  EyeIcon,
  PencilEdit01Icon,
  MoreVerticalIcon,
  Copy01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ASSESSMENTS = [
  { id: 1, title: "Frontend Developer L01", status: "Active", difficulty: "Easy", questions: 10, duration: 120 },
  { id: 2, title: "Frontend Developer L01", status: "Active", difficulty: "Easy", questions: 10, duration: 120 },
  { id: 3, title: "Frontend Developer L01", status: "Active", difficulty: "Easy", questions: 10, duration: 120 },
  { id: 4, title: "Frontend Developer L01", status: "Active", difficulty: "Easy", questions: 10, duration: 120 },
  { id: 5, title: "Frontend Developer L01", status: "Active", difficulty: "Easy", questions: 10, duration: 120 },
  { id: 6, title: "Frontend Developer L01", status: "Active", difficulty: "Easy", questions: 10, duration: 120 },
]

export default function AssessmentsPage() {
  const [copiedId, setCopiedId] = React.useState<number | null>(null)

  const copyPreviewLink = (id: number) => {
    const url = `${window.location.origin}/assessment/${id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
        <h1 className="text-[28px] font-medium text-slate-900 leading-none">Assessments</h1>
        <Link href="/dashboard/assessments/new">
          <Button className="bg-[#355872] hover:bg-[#355872]/90 text-white rounded-lg h-10 px-5 flex items-center gap-2 border-none shadow-none text-sm font-medium transition-colors">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2.5} />
            <span>Add New Assessment</span>
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="px-8 py-4 flex items-center gap-4">
        <div className="relative w-72">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none"
          />
          <Input
            placeholder="Search"
            className="pl-10 h-10 bg-white border-slate-200 shadow-none rounded-lg text-sm placeholder:text-slate-400 focus-visible:border-slate-300"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Select>
            <SelectTrigger className="w-36 h-10 bg-white border-slate-200 shadow-none rounded-lg text-slate-500 text-sm focus:ring-0 px-4">
              <SelectValue placeholder="Inactive" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg border-slate-200">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" className="text-slate-500 font-medium text-sm h-10 px-3 hover:bg-transparent hover:text-slate-900">
            Clear All
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ASSESSMENTS.map((assessment) => (
            <div
              key={assessment.id}
              className="border border-slate-200 rounded-xl bg-white p-6 flex flex-col gap-4 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">
                  {assessment.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#E6F4EA] text-[#1E8E3E] border-none shadow-none font-medium text-[11px] px-2.5 py-0.5 rounded-full">
                    {assessment.status}
                  </Badge>
                  <Badge className="bg-[#EEF2FF] text-[#4338CA] border-none shadow-none font-medium text-[11px] px-2.5 py-0.5 rounded-full">
                    {assessment.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Meta */}
              <p className="text-[13px] text-slate-500 font-medium">
                {assessment.questions} Questions · {assessment.duration} Minutes
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  onClick={() => copyPreviewLink(assessment.id)}
                  className={`text-[13px] font-medium h-9 px-5 rounded-lg shadow-none border-none gap-2 transition-all active:scale-[0.98] ${
                    copiedId === assessment.id
                      ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                      : "bg-[#355872] hover:bg-[#355872]/90 text-white"
                  }`}
                >
                  <HugeiconsIcon
                    icon={copiedId === assessment.id ? CheckmarkCircle01Icon : EyeIcon}
                    className="size-3.5"
                    strokeWidth={2.5}
                  />
                  {copiedId === assessment.id ? "Link Copied!" : "Preview"}
                </Button>
                <Button
                  variant="outline"
                  className="text-slate-600 text-[13px] font-medium h-9 px-4 rounded-lg shadow-none border-slate-200 hover:bg-slate-50 hover:text-slate-900 gap-2 transition-all"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 ml-auto"
                >
                  <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
