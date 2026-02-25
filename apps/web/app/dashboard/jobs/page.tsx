"use client"

import * as React from "react"
import {
  Search01Icon,
  PlusSignIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const JOBS = [
  {
    name: "Software Engineer - Internship",
    type: "Full Time",
    department: "API Management",
    location: "Kegalle, Srilanka",
    createdAt: "14/02/2026",
  },
  {
    name: "Software Engineer - Internship",
    type: "Full Time",
    department: "API Management",
    location: "Colombo, Srilanka",
    createdAt: "14/02/2026",
  },
  {
    name: "Software Engineer - Internship",
    type: "Full Time",
    department: "API Management",
    location: "Colombo, Srilanka",
    createdAt: "14/02/2026",
  },
  {
    name: "Software Engineer - Internship",
    type: "Full Time",
    department: "API Management",
    location: "Colombo, Srilanka",
    createdAt: "14/02/2026",
  },
  {
    name: "Software Engineer - Internship",
    type: "Full Time",
    department: "API Management",
    location: "Colombo, Srilanka",
    createdAt: "14/02/2026",
  },
  {
    name: "Software Engineer - Internship",
    type: "Full Time",
    department: "API Management",
    location: "Colombo, Srilanka",
    createdAt: "14/02/2026",
  },
]

import Link from "next/link"

export default function ManageJobsPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Header Section */}
      <div className="px-8 py-4 flex items-center justify-between">
        <h1 className="text-[28px] font-medium text-slate-900 leading-none">Manage Jobs</h1>
        <Link 
          href="/dashboard/jobs/new"
          className="bg-[#355872] hover:bg-[#355872]/90 text-white rounded-lg h-10 px-4 flex items-center gap-2 border-none shadow-none text-sm font-medium transition-colors"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2.5} />
          <span>Create New Job</span>
        </Link>
      </div>

      {/* Filter Section with Top and Bottom Lines */}
      <div className="border-y border-slate-200 px-8 py-3.5 flex items-center gap-4">
        <div className="relative w-80">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none"
          />
          <Input
            placeholder="Search"
            className="pl-11 h-10! bg-white border-slate-200 shadow-none rounded-lg text-sm placeholder:text-slate-300 focus-visible:border-slate-300 transition-colors"
          />
        </div>

        <Select>
          <SelectTrigger className="w-52 h-10! bg-white border-slate-200 shadow-none rounded-lg text-slate-500 text-sm focus:ring-0 px-4">
            <SelectValue placeholder="Departments" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-slate-200">
            <SelectItem value="api">API Management</SelectItem>
            <SelectItem value="eng">Engineering</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-44 h-10! bg-white border-slate-200 shadow-none rounded-lg text-slate-500 text-sm focus:ring-0 px-4">
            <SelectValue placeholder="Job Types" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-slate-200">
            <SelectItem value="fulltime">Full Time</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-44 h-10! bg-white border-slate-200 shadow-none rounded-lg text-slate-500 text-sm focus:ring-0 px-4">
            <SelectValue placeholder="Inactive" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-slate-200">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" className="text-slate-600 font-medium text-sm h-10 px-4 hover:bg-transparent hover:text-slate-900 border-none ml-4">
          Clear All
        </Button>
      </div>

      {/* Table Section */}
      <div className="px-8 py-6">
        <div className="border border-slate-200 rounded-xl bg-white shadow-none overflow-hidden text-[#355872]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
              <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm">Job Name</TableHead>
              <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm">Job Type</TableHead>
              <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm text-center lg:text-left">Department Name</TableHead>
              <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm">Location</TableHead>
              <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {JOBS.map((job, index) => (
              <TableRow key={index} className="border-b border-slate-200 last:border-0 font-medium">
                <TableCell className="h-13 px-8 py-0">
                  <Link href={`/dashboard/jobs/${index + 1}`} className="text-[#355872] font-medium hover:underline decoration-1 underline-offset-4 cursor-pointer">
                    {job.name}
                  </Link>
                </TableCell>
                <TableCell className="h-13 px-8 py-0 text-[#355872] font-normal">
                  {job.type}
                </TableCell>
                <TableCell className="h-13 px-8 py-0 text-[#355872] font-normal">
                  {job.department}
                </TableCell>
                <TableCell className="h-13 px-8 py-0 text-[#355872] font-normal">
                  {job.location}
                </TableCell>
                <TableCell className="h-13 px-8 py-0 text-[#355872] font-normal">
                  {job.createdAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Improved Pagination / Footer */}
        <div className="flex items-center justify-between px-8 py-3.5 border-t border-slate-200 bg-white">
          <span className="text-sm font-medium text-slate-400">
            Showing 1-6 of 1,258 results
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-10 px-6 rounded-lg bg-white border-slate-200 text-[#355872] font-semibold text-sm hover:bg-slate-50 hover:text-slate-900 shadow-none gap-2"
            >
              Previous
            </Button>
            <Button
              className="h-10 px-8 rounded-lg bg-[#355872] hover:bg-[#355872]/90 text-white font-semibold text-sm shadow-none transition-all active:scale-[0.98] border-none"
            >
              Next
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
