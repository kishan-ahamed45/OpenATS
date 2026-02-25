"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
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
  ToggleOnIcon,
  SentIcon
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function JobDetailsPage() {
  const params = useParams()
  const id = params.id
  const [questions, setQuestions] = React.useState([
    { id: 1, text: "What Is Your Salary Expectation", type: "short-answer", required: true }
  ])
  const [isAddingMode, setIsAddingMode] = React.useState(false)
  const [newQuestionType, setNewQuestionType] = React.useState("short-answer")
  const [isNotesOpen, setIsNotesOpen] = React.useState(false)

  // ── Hiring Process stage state ───────────────────────────────────────────
  const [stages, setStages] = React.useState([
    { id: 1, name: "Screening",  color: "bg-green-500" },
    { id: 2, name: "Applied",    color: "bg-green-500" },
    { id: 3, name: "Interview",  color: "bg-blue-500"  },
    { id: 4, name: "Offer",      color: "bg-green-500" },
    { id: 5, name: "Rejected",   color: "bg-red-500"   },
  ])

  // Configure Stage dialog
  const [configOpen, setConfigOpen] = React.useState(false)
  const [configStage, setConfigStage] = React.useState<{ id: number; name: string } | null>(null)
  const [configType, setConfigType] = React.useState<"offer" | "rejection" | "none">("none")
  const [configOfferTemplate, setConfigOfferTemplate] = React.useState("")
  const [configMode, setConfigMode] = React.useState("")
  const [configExpiry, setConfigExpiry] = React.useState("")
  const [configRejectTemplate, setConfigRejectTemplate] = React.useState("")

  const openConfigure = (stage: { id: number; name: string }) => {
    setConfigStage(stage)
    setConfigType("none")
    setConfigOfferTemplate("")
    setConfigMode("")
    setConfigExpiry("")
    setConfigRejectTemplate("")
    setConfigOpen(true)
  }

  // Add New Stage dialog
  const [addStageOpen, setAddStageOpen] = React.useState(false)
  const [newStageName, setNewStageName] = React.useState("")

  const handleAddStage = () => {
    if (!newStageName.trim()) return
    setStages(prev => [...prev, { id: Date.now(), name: newStageName.trim(), color: "bg-green-500" }])
    setNewStageName("")
    setAddStageOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Header Area */}
      <div className="px-8 pt-10 pb-0 max-w-5xl w-full">
        {/* Header Section */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-center gap-4 cursor-default">
            <h1 className="text-[28px] font-medium text-slate-900 leading-none">Intern - Software Engineer</h1>
            <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium px-3 py-1 rounded-full text-xs shadow-none">
              Active Job
            </Badge>
          </div>
          
          <div className="flex items-center text-sm font-medium text-slate-500 gap-2 cursor-default">
            <span>Full Time</span>
            <span className="text-slate-300">-</span>
            <span>Development</span>
            <span className="text-slate-300">-</span>
            <span>Colombo, Srilanka</span>
            <span className="text-slate-300">-</span>
            <span className="text-slate-600 font-semibold text-xs py-0.5 px-0.5">USD 3000/4000</span>
          </div>

          <div className="flex items-center gap-2 text-[#355872] text-[15px] font-medium hover:underline cursor-pointer group w-fit">
            <HugeiconsIcon icon={Link01Icon} className="size-4" />
            <span>https://openats.org/careers/csQmkmA</span>
          </div>
        </div>

        {/* Action Bar - More Compact */}
        <div className="flex items-center gap-8 py-2 mb-6">
          <div className="flex items-baseline gap-2 cursor-default shrink-0">
            <span className="text-2xl font-medium text-slate-900 leading-none">0</span>
            <span className="text-slate-600 font-medium leading-none">Candidates</span>
          </div>
          <Link href={`/dashboard/jobs/${id}/pipeline`}>
            <Button className="bg-[#355872] hover:bg-[#355872]/90 text-white rounded-lg h-10 px-7 font-medium shadow-none border-none gap-2 transition-all active:scale-[0.98]">
              <span>Go To Hiring Pipeline</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" strokeWidth={3} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Section - Full Width Borders */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full border-y border-slate-100 py-3 bg-white shadow-none">
          <div className="px-8 max-w-5xl w-full">
            <TabsList className="bg-transparent w-full justify-start rounded-none h-auto p-0 gap-3">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-transparent !shadow-none border border-slate-200 data-[state=active]:border-[#355872] rounded-lg px-6 h-[38px] text-slate-600 data-[state=active]:text-[#355872] font-medium text-[15px] transition-all hover:bg-slate-50 flex items-center justify-center"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="hiring-team" 
                className="data-[state=active]:bg-transparent !shadow-none border border-slate-200 data-[state=active]:border-[#355872] rounded-lg px-6 h-[38px] text-slate-600 data-[state=active]:text-[#355872] font-medium text-[15px] transition-all hover:bg-slate-50 flex items-center justify-center"
              >
                Hiring Team
              </TabsTrigger>
              <TabsTrigger 
                value="hiring-process" 
                className="data-[state=active]:bg-transparent !shadow-none border border-slate-200 data-[state=active]:border-[#355872] rounded-lg px-6 h-[38px] text-slate-600 data-[state=active]:text-[#355872] font-medium text-[15px] transition-all hover:bg-slate-50 flex items-center justify-center"
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
                className="data-[state=active]:bg-transparent !shadow-none border border-slate-200 data-[state=active]:border-[#355872] rounded-lg px-6 h-[38px] text-slate-600 data-[state=active]:text-[#355872] font-medium text-[15px] transition-all hover:bg-slate-50 flex items-center justify-center"
              >
                Custom Questions
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        {/* Full-width Content Area */}
        <div className="px-8 pb-20 w-full">
          <TabsContent value="overview" className="pt-10 space-y-8 animate-in fade-in duration-300">
            <p className="text-slate-500 leading-relaxed text-[15px] cursor-default max-w-4xl">
              Surge Global Is A Digital Consultancy That Leverages Marketing, Data, And Technology To Help
              Businesses Grow. As Sri Lanka's Leading Digital Firm, We Employ The Best Content, Creative, Design &
              Engineering Talent The Country Has To Offer.
            </p>

            <div className="space-y-4">
              <h3 className="text-slate-500 font-medium text-[15px] cursor-default uppercase tracking-wide">Responsibilities</h3>
              <ul className="space-y-3">
                {[
                  "Direct The Engineering Team In The Conception, Planning, And Delivery Of Software Solutions That Align With The Business's Strategic Objectives.",
                  "Foster A Collaborative And Empowering Environment To Enhance Productivity, Innovation, And Teamwork."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-slate-500 text-[15px] cursor-default">
                    <span className="text-slate-300 select-none mt-1.5">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 cursor-default">
              <h3 className="text-slate-500 font-medium text-[15px] uppercase tracking-wide">Requirements</h3>
              <ul className="space-y-2">
                {[
                  "Bachelor's Or Master's Degree In Computer Science, Engineering, Or A Related Field.",
                  "Strong Technical Background With Experience In Software Development And Web Technologies."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-slate-500 text-[15px]">
                    <span className="text-slate-300 select-none mt-1.5">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="hiring-team" className="pt-10 space-y-12 animate-in fade-in duration-300">
            {/* Hiring Manager Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-medium text-[15px]">Hiring Manager</span>
                  <button className="flex items-center gap-2 text-[#355872] hover:underline font-medium text-[14px]">
                    <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" strokeWidth={3} />
                    <span>Add New Hiring Manager</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-full bg-[#355872] flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                  {/* Avatar or Initials */}
                  <div className="w-full h-full bg-[#355872]" />
                </div>
                <span className="text-slate-700 font-medium text-[15px]">Chamal Senarathna</span>
              </div>
            </div>

            {/* Interviewer Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-medium text-[15px]">Interviewer</span>
                  <button className="flex items-center gap-2 text-[#355872] hover:underline font-medium text-[14px]">
                    <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" strokeWidth={3} />
                    <span>Add New Interviewer</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-full bg-[#355872] flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                  <div className="w-full h-full bg-[#355872]" />
                </div>
                <span className="text-slate-700 font-medium text-[15px]">Risikesan Jegatheesan</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hiring-process" className="pt-10 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-slate-900 font-semibold text-[17px]">Hiring Pipeline Stages</h3>
                <p className="text-slate-500 text-[13px]">Drag To Reorder Stages. Click To Edit Or Remove.</p>
              </div>
              <Button
                onClick={() => { setNewStageName(""); setAddStageOpen(true) }}
                className="bg-[#355872] hover:bg-[#355872]/90 text-white rounded-lg h-10 px-4 font-medium shadow-none border-none gap-2 text-sm"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={3} />
                <span>Add New Stage</span>
              </Button>
            </div>

            <div className="space-y-3 pt-4">
              {stages.map((stage) => (
                <div key={stage.id} className="flex items-center justify-between p-4 border border-slate-200/60 rounded-lg hover:border-slate-300 transition-all group bg-white">
                  <div className="flex items-center gap-4">
                    <HugeiconsIcon icon={DragDropVerticalIcon} className="size-5 text-slate-300 group-hover:text-slate-400" />
                    <div className={`size-2 rounded-full ${stage.color}`} />
                    <span className="text-slate-700 font-medium text-[15px]">{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => openConfigure({ id: stage.id, name: stage.name })}
                      className="text-[#355872]/60 hover:text-[#355872] transition-colors"
                      title="Configure Stage"
                    >
                      <HugeiconsIcon icon={Settings02Icon} className="size-[18px]" />
                    </button>
                    <button className="text-[#355872]/60 hover:text-[#355872] transition-colors">
                      <HugeiconsIcon icon={PencilEdit01Icon} className="size-[18px]" />
                    </button>
                    <button
                      onClick={() => setStages(prev => prev.filter(s => s.id !== stage.id))}
                      className="text-red-400/80 hover:text-red-500 transition-colors"
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="size-[18px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          

          <TabsContent value="custom-questions" className="pt-10 space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col gap-6">
              <button 
                onClick={() => setIsAddingMode(true)}
                className="flex items-center gap-2 text-[#355872] hover:underline font-medium text-[15px] w-fit"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={3} />
                <span>Add Custom Question</span>
              </button>

              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id} className="group relative flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                        {q.type === 'short-answer' && <HugeiconsIcon icon={TextIcon} className="size-4" />}
                        {q.type === 'long-answer' && <HugeiconsIcon icon={ParagraphIcon} className="size-4" />}
                      </div>
                      <span className="text-slate-700 font-medium text-[15px]">{q.text}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="p-1.5 text-slate-400 hover:text-[#355872] transition-colors">
                        <HugeiconsIcon icon={PencilEdit01Icon} className="size-[18px]" />
                      </button>
                      <button 
                        onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="size-[18px]" />
                      </button>
                      <button className="p-1.5 text-slate-300 cursor-grab active:cursor-grabbing">
                        <HugeiconsIcon icon={DragDropVerticalIcon} className="size-[18px]" />
                      </button>
                    </div>
                  </div>
                ))}

                {isAddingMode && (
                  <div className="p-3 border border-slate-200 rounded-lg bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-wrap items-center gap-4">
                      <Select defaultValue="short-answer" onValueChange={setNewQuestionType}>
                        <SelectTrigger className="w-[180px] h-10 border-slate-200 bg-white shadow-none text-slate-600 focus:ring-1 focus:ring-slate-300">
                          <SelectValue placeholder="Question Type" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-200 shadow-md">
                          <SelectItem value="short-answer">
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon icon={TextIcon} className="size-4" />
                              <span>Short Answer</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="long-answer">
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
                          <SelectItem value="boolean">
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon icon={ToggleOnIcon} className="size-4" />
                              <span>Boolean</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Input 
                        placeholder="Enter the question here" 
                        className="flex-1 h-10 border-slate-200 bg-white shadow-none focus-visible:ring-1 focus-visible:ring-slate-300 text-[15px]" 
                      />

                      {(newQuestionType === 'radio' || newQuestionType === 'checkbox' || newQuestionType === 'boolean') && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="h-10 border-[#355872] text-[#355872] hover:bg-slate-50 font-medium px-4 shadow-none gap-2"
                            >
                              <HugeiconsIcon icon={Settings02Icon} className="size-4" />
                              <span>Setup Options & Logic</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md border-slate-200">
                            <DialogHeader>
                              <DialogTitle className="text-slate-900">Setup Question Logic</DialogTitle>
                              <DialogDescription className="text-slate-500">
                                Add options and define the logic for this question.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label className="text-slate-700">Options</Label>
                                <div className="space-y-2">
                                  <div className="flex gap-2">
                                    <Input placeholder="Option 1" className="h-9 border-slate-200 text-sm" />
                                    <Button variant="ghost" className="size-9 p-0 text-red-500"><HugeiconsIcon icon={Delete02Icon} className="size-4" /></Button>
                                  </div>
                                  <button className="text-[#355872] text-sm font-medium hover:underline flex items-center gap-1">
                                    <HugeiconsIcon icon={PlusSignIcon} className="size-3" strokeWidth={3} />
                                    <span>Add Another Option</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button className="bg-[#355872] hover:bg-[#355872]/90 text-white font-medium px-5">
                                Save Logic
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      <div className="flex items-center gap-2 px-2">
                        <Checkbox id="required" className="size-4 border-slate-300 data-[state=checked]:bg-[#355872] data-[state=checked]:border-[#355872]" />
                        <Label htmlFor="required" className="text-slate-600 font-medium text-[15px] cursor-pointer">Required</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddingMode(false)}
                          className="h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 font-medium shadow-none"
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="h-10 px-6 bg-[#355872] hover:bg-[#355872]/90 text-white shadow-none rounded-lg font-medium"
                          onClick={() => {
                            setIsAddingMode(false)
                          }}
                        >
                          Add Question
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button className="bg-[#355872] hover:bg-[#355872]/90 text-white rounded-lg h-10 px-6 font-medium shadow-none">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* ══ Configure Stage Dialog ══════════════════════════════════════════ */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="!top-[18%] !translate-y-0 max-w-[780px] sm:max-w-[780px] rounded-lg border-slate-200 shadow-lg p-7 duration-0 data-open:zoom-in-100 data-closed:zoom-out-100">
          <DialogHeader className="mb-1">
            <DialogTitle className="text-[19px] font-semibold text-slate-900">Configure Stage</DialogTitle>
          </DialogHeader>

          {/* Type radio row */}
          <div className="flex items-center gap-7 py-3.5 border-b border-slate-100">
            {(["offer", "rejection", "none"] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setConfigType(t)}>
                <div className={`size-[17px] rounded-full border-2 flex items-center justify-center ${
                  configType === t ? "border-[#355872]" : "border-slate-300"
                }`}>
                  {configType === t && <div className="size-2.5 rounded-full bg-[#355872]" />}
                </div>
                <span className={`text-[15px] font-medium ${
                  configType === t ? "text-[#355872]" : "text-slate-600"
                }`}>
                  {t === "rejection" ? "Rejecttion" : t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </label>
            ))}
          </div>

          {/* Offer fields */}
          {configType === "offer" && (
            <div className="space-y-4 pt-1">
              <div>
                <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">Select Offer Template</Label>
                <Select value={configOfferTemplate} onValueChange={setConfigOfferTemplate}>
                  <SelectTrigger className="w-full h-10 border-slate-200 rounded-md shadow-none text-slate-400 focus:ring-0 text-sm">
                    <SelectValue placeholder="Software Engineering Offer Template" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-200 shadow-md">
                    <SelectItem value="se-offer">Software Engineering Offer Template</SelectItem>
                    <SelectItem value="design-offer">Design Offer Template</SelectItem>
                    <SelectItem value="ops-offer">Operations Offer Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">Mode ( Auto-Draft Or Auto-Send )</Label>
                  <Select value={configMode} onValueChange={setConfigMode}>
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
                  <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">Expiry Days</Label>
                  <Input
                    type="number"
                    value={configExpiry}
                    onChange={e => setConfigExpiry(e.target.value)}
                    className="h-10 border-slate-200 rounded-md shadow-none focus-visible:ring-0 focus-visible:border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rejection fields */}
          {configType === "rejection" && (
            <div className="pt-1">
              <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">Select Rejection Email Template</Label>
              <Select value={configRejectTemplate} onValueChange={setConfigRejectTemplate}>
                <SelectTrigger className="w-full h-10 border-slate-200 rounded-md shadow-none text-slate-400 focus:ring-0 text-sm">
                  <SelectValue placeholder="Software Engineering Offer Template" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-slate-200 shadow-md">
                  <SelectItem value="se-reject">Software Engineering Rejection Template</SelectItem>
                  <SelectItem value="generic-reject">Generic Rejection Template</SelectItem>
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
              className="h-10 px-6 bg-[#355872] hover:bg-[#355872]/90 text-white font-medium shadow-none rounded-md border-none"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══ Add New Stage Dialog ════════════════════════════════════════════ */}
      <Dialog open={addStageOpen} onOpenChange={setAddStageOpen}>
        <DialogContent className="!top-[18%] !translate-y-0 max-w-[460px] rounded-lg border-slate-200 shadow-lg p-7 duration-0 data-open:zoom-in-100 data-closed:zoom-out-100">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-[19px] font-semibold text-slate-900">Add New Stage</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-[13px] font-medium text-slate-700 mb-1.5 block">Stage Name</Label>
              <Input
                autoFocus
                placeholder="e.g., First Interview , Technical Interview"
                value={newStageName}
                onChange={e => setNewStageName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddStage()}
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
              className="h-10 px-6 bg-[#355872] hover:bg-[#355872]/90 text-white font-medium shadow-none rounded-md border-none disabled:opacity-50"
            >
              Add Stage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <SheetContent className="w-full sm:max-w-[540px] p-0 flex flex-col border-l border-slate-200 shadow-none">
          <SheetHeader className="p-5 border-b border-slate-100 bg-white">
            <SheetTitle className="text-lg font-semibold text-slate-900">Internal Notes</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl space-y-3 w-full shadow-none">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[#355872] flex items-center justify-center text-white text-[10px] overflow-hidden">
                    <div className="w-full h-full bg-[#355872]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-semibold text-[13px] leading-tight">Chamal Senarathna</span>
                    <span className="text-slate-400 text-[11px]">2h ago</span>
                  </div>
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {i === 2 && <span className="text-[#355872] font-semibold mr-1">@Risikesan</span>}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                </p>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-slate-100 bg-white space-y-4">
            <div className="relative">
              <textarea 
                placeholder="Add a note... Type @ to mention team members"
                className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl bg-white focus:ring-1 focus:ring-[#355872]/20 focus:border-[#355872] outline-none text-[14px] text-slate-700 transition-all resize-none shadow-none"
              />
            </div>
            <Button className="w-full bg-[#355872] hover:bg-[#355872]/90 text-white rounded-lg h-11 font-medium shadow-none gap-2">
              <HugeiconsIcon icon={SentIcon} className="size-4 rotate-[-45deg]" />
              <span>Add Note</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
