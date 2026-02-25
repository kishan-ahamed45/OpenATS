"use client"

import * as React from "react"
import {
  Search01Icon,
  PlusSignIcon,
  CallIcon,
  Mail01Icon,
  Linkedin01Icon,
  SentIcon,
  ArrowUpRight01Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CANDIDATES = [
  {
    name: "Chamal Senarathna",
    status: "Screening Disqualified",
    statusColor: "bg-[#FEE4E2] text-[#B42318]",
    role: "Software Engineer - APIM",
    tags: "-",
    appliedOn: "Applied a minute ago",
    email: "chamals@gmail.com",
    phone: "+94 71 7110 160",
    linkedin: "in/chamalsena"
  },
  {
    name: "Nisal Periyapperuma",
    status: "Interview",
    statusColor: "bg-[#F4EBFF] text-[#7F56D9]",
    role: "VP - Software Engineering",
    tags: "-",
    appliedOn: "5 hours ago",
    email: "nisal@example.com",
    phone: "+94 77 1234 567",
    linkedin: "in/nisalp"
  },
  {
    name: "Bhanuka Harischandra",
    status: "Offer",
    statusColor: "bg-[#E6F4EA] text-[#1E8E3E]",
    role: "DevOps Intern",
    tags: "-",
    appliedOn: "1 day ago",
    email: "bhanuka@example.com",
    phone: "+94 76 9876 543",
    linkedin: "in/bhanukah"
  },
]

export default function ManageCandidatesPage() {
  const [selectedCandidate, setSelectedCandidate] = React.useState<typeof CANDIDATES[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  const handleRowClick = (candidate: typeof CANDIDATES[0]) => {
    setSelectedCandidate(candidate)
    setIsDetailOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Header Section */}
      <div className="px-8 py-4 flex items-center justify-between">
        <h1 className="text-[28px] font-medium text-slate-900 leading-none">Manage Candidates</h1>
        <Button 
          className="bg-[#355872] hover:bg-[#355872]/90 text-white rounded-lg h-10 px-4 flex items-center gap-2 border-none shadow-none text-sm font-medium transition-colors"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2.5} />
          <span>Create New Job</span>
        </Button>
      </div>

      {/* Filter Section */}
      <div className="border-y border-slate-200 px-8 py-3.5 flex items-center gap-4">
        <div className="relative w-80">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none"
          />
          <Input
            placeholder="Search Candidate"
            className="pl-11 h-10! bg-white border-slate-200 shadow-none rounded-lg text-sm placeholder:text-slate-300 focus-visible:border-slate-300 transition-colors"
          />
        </div>

        <Select>
          <SelectTrigger className="w-52 h-10! bg-white border-slate-200 shadow-none rounded-lg text-slate-500 text-sm focus:ring-0 px-4">
            <SelectValue placeholder="Job Position" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-slate-200">
            <SelectItem value="se">Software Engineer</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-44 h-10! bg-white border-slate-200 shadow-none rounded-lg text-slate-500 text-sm focus:ring-0 px-4">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-slate-200">
            <SelectItem value="screening">Stage</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-44 h-10! bg-white border-slate-200 shadow-none rounded-lg text-slate-500 text-sm focus:ring-0 px-4">
            <SelectValue placeholder="Applied Date" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-slate-200">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" className="text-slate-600 font-medium text-sm h-10 px-4 hover:bg-transparent hover:text-slate-900 border-none ml-2">
          Clear All
        </Button>
      </div>

      {/* Table Section */}
      <div className="px-8 py-6">
        <div className="border border-slate-200 rounded-xl bg-white shadow-none overflow-hidden text-[#355872]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
                <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm">Candidate Name</TableHead>
                <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm">Stage Status</TableHead>
                <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm">Applied for</TableHead>
                <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm">Tags</TableHead>
                <TableHead className="h-13 px-8 font-semibold text-slate-900 text-sm">Applied on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CANDIDATES.map((candidate, index) => (
                <TableRow 
                  key={index}
                  className="border-b border-slate-200 last:border-0 font-medium cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => handleRowClick(candidate)}
                >
                  <TableCell className="h-13 px-8 py-0 font-medium text-[#355872]">
                    {candidate.name}
                  </TableCell>
                  <TableCell className="h-13 px-8 py-0">
                    <Badge className={`${candidate.statusColor} hover:${candidate.statusColor} border-none shadow-none font-medium px-2.5 py-0.5 rounded-full text-[12px]`}>
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="h-13 px-8 py-0 text-[#355872]/80 font-normal">
                    {candidate.role}
                  </TableCell>
                  <TableCell className="h-13 px-8 py-0 text-slate-400 font-normal">
                    {candidate.tags}
                  </TableCell>
                  <TableCell className="h-13 px-8 py-0 text-slate-500 font-normal">
                    {candidate.appliedOn}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-8 py-3.5 border-t border-slate-200 bg-white">
            <span className="text-sm font-medium text-slate-400">
              Showing 1-6 of 1,258 results
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-10 px-6 rounded-lg bg-white border-slate-200 text-[#355872] font-semibold text-sm hover:bg-slate-50 hover:text-slate-900 shadow-none gap-2 transition-all active:scale-95"
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

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent showCloseButton={true} className="w-[95vw] sm:max-w-[1320px] p-0 flex flex-row gap-0 border-l border-slate-200 shadow-none overflow-hidden bg-white">
          {selectedCandidate && (
            <>
              {/* Left Section: Header + CV Preview */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Candidate Header Info - Responsive Refinement */}
                <div className="px-6 lg:px-10 py-6 lg:py-10 border-b border-slate-100 shrink-0 bg-white">
                  <div className="flex items-start sm:items-center gap-6 min-w-0">
                    <Avatar className="size-14 lg:size-16 rounded-full shrink-0">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCandidate.name}`} />
                      <AvatarFallback>{selectedCandidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight truncate">{selectedCandidate.name}</h2>
                        <Badge className={`${selectedCandidate.statusColor} hover:${selectedCandidate.statusColor} border-none shadow-none font-medium px-2 py-0.5 rounded-full text-[10px] lg:text-[11px] uppercase tracking-wider whitespace-nowrap`}>
                          {selectedCandidate.status}
                        </Badge>
                      </div>
                      <p className="text-slate-500 font-medium text-xs lg:text-[14px]">
                        {selectedCandidate.role} <span className="mx-1 opacity-30">•</span> Applied 4 days ago
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 lg:pt-3">
                        <div className="flex items-center gap-2 text-slate-500 text-[12px] lg:text-[13px] font-medium transition-colors hover:text-[#355872] cursor-pointer whitespace-nowrap">
                          <HugeiconsIcon icon={CallIcon} className="size-3.5 lg:size-4 text-slate-400" />
                          <span>{selectedCandidate.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[12px] lg:text-[13px] font-medium transition-colors hover:text-[#355872] cursor-pointer whitespace-nowrap">
                          <HugeiconsIcon icon={Mail01Icon} className="size-3.5 lg:size-4 text-slate-400" />
                          <span>{selectedCandidate.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[12px] lg:text-[13px] font-medium transition-colors hover:text-[#355872] cursor-pointer whitespace-nowrap">
                          <HugeiconsIcon icon={Linkedin01Icon} className="size-3.5 lg:size-4 text-slate-400" />
                          <span>{selectedCandidate.linkedin}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PDF Preview Area - Only this part scrolls */}
                <div className="flex-1 bg-slate-50 p-8 overflow-y-auto flex flex-col items-center custom-scrollbar-y relative group/cv">
                  <div className="bg-slate-200/40 rounded-xl w-full max-w-4xl h-[1200px] border border-slate-200 flex flex-col items-center justify-center text-slate-400 font-semibold shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200/10 to-transparent pointer-events-none" />
                    <div className="text-4xl opacity-10 font-bold uppercase tracking-[0.2em] transform -rotate-12 select-none">CV PREVIEW (PDF)</div>
                  </div>
                </div>
              </div>

              {/* Right Section: Activity & Tabs - Starting from the top */}
              <div className="w-[500px] border-l border-slate-100 flex flex-col bg-white overflow-hidden shadow-none">
                {/* Top Header for Activity Panel - Contains View CV Button */}
                <div className="h-20 shrink-0 flex items-center justify-start px-6">
                  <Button 
                    className="bg-[#355872] hover:bg-[#355872]/90 text-white font-medium text-[12px] gap-2 px-5 h-10 rounded-[10px] shadow-none border-none transition-all active:scale-[0.98]"
                  >
                    <span>View CV in New Tab</span>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" strokeWidth={2.5} />
                  </Button>
                </div>
                
                <Tabs defaultValue="notes" className="flex-1 flex flex-col overflow-hidden m-0">
                  {/* Specialized Minimal Tabs Header - Enclosed in horizontal lines */}
                  <div className="py-3 border-y border-slate-100 px-6 bg-white">
                    <TabsList className="bg-transparent h-fit w-full justify-start gap-2 p-0">
                      <TabsTrigger 
                        value="notes" 
                        className="data-[state=active]:bg-white data-[state=active]:border-[#355872] data-[state=active]:text-[#355872] border border-slate-200 rounded-[10px] px-5 py-2 text-[14px] font-medium text-slate-600 shadow-none transition-all h-[40px] bg-white cursor-pointer"
                      >
                        Internal Notes
                      </TabsTrigger>
                      <TabsTrigger 
                        value="messages"
                        className="data-[state=active]:bg-white data-[state=active]:border-[#355872] data-[state=active]:text-[#355872] border border-slate-200 rounded-[10px] px-5 py-2 text-[14px] font-medium text-slate-600 shadow-none transition-all h-[40px] bg-white cursor-pointer"
                      >
                        Messages
                      </TabsTrigger>
                      <TabsTrigger 
                        value="scores"
                        className="data-[state=active]:bg-white data-[state=active]:border-[#355872] data-[state=active]:text-[#355872] border border-slate-200 rounded-[10px] px-5 py-2 text-[14px] font-medium text-slate-600 shadow-none transition-all h-[40px] bg-white cursor-pointer"
                      >
                        Assessments Score
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="notes" className="flex-1 flex flex-col p-0 m-0 overflow-hidden outline-none">
                    <div className="flex-1 overflow-y-auto p-6 space-y-0 divide-y divide-slate-50 custom-scrollbar-y">
                      {/* Note Item 1 */}
                      <div className="py-6 first:pt-0">
                        <div className="flex gap-4 group">
                          <Avatar className="size-10 rounded-full shrink-0">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Narendra" />
                            <AvatarFallback>NM</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[15px] font-bold text-slate-900 leading-none">Narendra Modi</span>
                              <span className="text-[12px] text-slate-400 font-medium">5 minutes ago</span>
                            </div>
                            <p className="text-[14px] text-slate-600 font-normal leading-relaxed">
                              Big Data, Machine Learning Artificial Intelligence
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Note Item 2 */}
                      <div className="py-6">
                        <div className="flex gap-4 group">
                          <Avatar className="size-10 rounded-full shrink-0">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anura" />
                            <AvatarFallback>AK</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[15px] font-bold text-slate-900 leading-none">Anura Kumara Dissanayake</span>
                              <span className="text-[12px] text-slate-400 font-medium whitespace-nowrap">a few minutes ago</span>
                            </div>
                            <p className="text-[14px] text-slate-600 font-normal leading-relaxed italic opacity-80">
                              "this guy dont know how to center div"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Input - Pinned to bottom */}
                    <div className="p-6 border-t border-slate-100 shrink-0 bg-white">
                      <div className="relative">
                        <Input 
                          placeholder="Write your note here..." 
                          className="h-12 pr-14 bg-white border-slate-200 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-[#355872] shadow-none placeholder:text-slate-400"
                        />
                        <Button size="icon" className="absolute right-1 top-1 size-10 rounded-lg bg-[#355872] hover:bg-[#355872]/90 shadow-none transition-all active:scale-95 flex items-center justify-center">
                          <HugeiconsIcon icon={SentIcon} className="size-5 text-white rotate-[-45deg]" strokeWidth={2.5} />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="messages" className="flex-1 p-8 text-center outline-none">
                    <p className="text-slate-400 text-sm italic">No communications logs found.</p>
                  </TabsContent>

                  <TabsContent value="scores" className="flex-1 p-8 text-center outline-none">
                    <p className="text-slate-400 text-sm italic">No assessment scores available.</p>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
