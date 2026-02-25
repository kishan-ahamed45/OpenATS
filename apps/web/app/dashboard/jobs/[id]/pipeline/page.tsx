"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Search01Icon
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function HiringPipelinePage() {
  const stages = [
    {
      id: "screening",
      title: "Screening",
      color: "#4CAF50",
      candidates: [
        { name: "Chamal Senarathna", time: "32 minutes ago" },
        { name: "Lex Fridman", time: "45 minutes ago" },
        { name: "Chamal Senarathna", time: "32 minutes ago" },
        { name: "Lex Fridman", time: "45 minutes ago" },
      ]
    },
    {
      id: "qualified",
      title: "Qualified",
      color: "#FF9800",
      candidates: [
        { name: "Risikeesan", time: "45 minutes ago" },
        { name: "Kishan Ahamed", time: "45 minutes ago" },
      ]
    },
    {
      id: "interviews",
      title: "Interviews",
      color: "#2196F3",
      candidates: [
        { name: "Chamal Senarathna", time: "32 minutes ago" },
      ]
    },
    {
      id: "offer",
      title: "Offer",
      color: "#4CAF50",
      candidates: [
        { name: "Bhanuka H", time: "45 minutes ago" },
      ]
    },
    {
      id: "hired",
      title: "Hired",
      color: "#10B981",
      candidates: [
        { name: "John Doe", time: "1 hour ago" },
      ]
    },
    {
      id: "rejected",
      title: "Rejected",
      color: "#EF4444",
      candidates: [
        { name: "Jane Smith", time: "2 hours ago" },
      ]
    }
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height))] bg-white overflow-hidden w-full min-w-0">
      {/* Header Area - Pinned to visible width */}
      <div className="px-8 pt-10 pb-6 shrink-0 w-full overflow-hidden border-b border-transparent">
        <div className="flex items-center justify-between gap-4 max-w-full">
          <div className="space-y-4 min-w-0">
            <div className="flex items-center gap-4">
              <h1 className="text-[32px] font-semibold text-slate-900 leading-none truncate">Intern - Software Engineer</h1>
              <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium px-3 py-1 rounded-full text-xs shadow-none shrink-0">
                Active Job
              </Badge>
            </div>
            
            <div className="flex items-center text-sm font-medium text-slate-500 gap-2 truncate whitespace-nowrap opacity-80">
              <span className="shrink-0">Full Time</span>
              <span className="text-slate-300 shrink-0">-</span>
              <span className="shrink-0">Development</span>
              <span className="text-slate-300 shrink-0">-</span>
              <span className="shrink-0 truncate">Colombo, Srilanka</span>
              <span className="text-slate-300 shrink-0">-</span>
              <span className="shrink-0 text-slate-400">Posted On 18/02/26</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar - Properly anchored within the visible area */}
      <div className="border-y border-slate-100 bg-white shrink-0 w-full z-10">
        <div className="px-8 py-4 flex items-center justify-between gap-6 overflow-hidden">
          <h2 className="text-[20px] font-semibold text-slate-800 tracking-tight shrink-0">10 Total Candidates</h2>
          
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <div className="relative min-w-0">
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 z-10" />
              <Input 
                placeholder="Search" 
                className="pl-11 h-10 w-[200px] sm:w-[260px] md:w-[320px] border-slate-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-slate-300 transition-all outline-none shadow-none"
              />
            </div>
            <Button className="bg-[#355872] hover:bg-[#355872]/90 text-white rounded-lg h-10 px-6 font-medium shadow-none transition-transform active:scale-[0.98] whitespace-nowrap shrink-0">
              <span>Add New Candidate</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board Area - Independent Horizontal Scrolling */}
      <div className="flex-1 w-full min-w-0 overflow-x-auto overflow-y-hidden bg-slate-50/10 pipeline-scroll-container">
        <div className="flex h-full p-8 gap-6 w-max items-start">
          {stages.map((stage) => (
            <div key={stage.id} className="w-[320px] h-full flex flex-col shrink-0">
              <div className="flex items-center gap-2.5 px-0.5 mb-4 shrink-0">
                <div className="size-2 rounded-full" style={{ backgroundColor: stage.color }} />
                <h3 className="font-semibold text-slate-700 text-[15px]">{stage.title}</h3>
                <span className="ml-auto text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100 uppercase tracking-tighter">
                  {stage.candidates.length} Cards
                </span>
              </div>
              
              <div className="flex-1 bg-[#F8FFF8] border border-[#B7B7B7] rounded-none p-3 space-y-4 overflow-y-auto custom-scrollbar-y shadow-sm">
                {stage.candidates.map((candidate, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-5 rounded-xl shadow-none space-y-2 hover:border-[#355872]/30 hover:shadow-md transition-all cursor-pointer group">
                    <p className="font-bold text-slate-900 text-[15px] leading-snug group-hover:text-[#355872] transition-colors">{candidate.name}</p>
                    <p className="text-slate-400 text-[11px] font-medium uppercase tracking-tight">{candidate.time}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        /* FORCING HORIZONTAL SCROLLBAR VISIBILITY */
        .pipeline-scroll-container {
          scrollbar-width: auto !important;
          -ms-overflow-style: auto !important;
        }
        .pipeline-scroll-container::-webkit-scrollbar {
          display: block !important;
          height: 10px !important;
          width: 0px !important;
        }
        .pipeline-scroll-container::-webkit-scrollbar-track {
          background: #f8fafc !important;
          border-top: 1px solid #e2e8f0 !important;
        }
        .pipeline-scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1 !important;
          border-radius: 10px !important;
          border: 2px solid #f8fafc !important;
        }
        .pipeline-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8 !important;
        }

        /* VERTICAL SCROLLBAR FOR COLUMNS */
        .custom-scrollbar-y::-webkit-scrollbar {
          display: block !important;
          width: 4px !important;
        }
        .custom-scrollbar-y::-webkit-scrollbar-thumb {
          background: #e2e8f0 !important;
          border-radius: 10px !important;
        }
      `}</style>
    </div>
  )
}
