"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// ─── Mock data ─────────────────────────────────────────────────────────────

type QuestionType = "single" | "multi" | "text"

interface Question {
  id: number
  type: QuestionType
  text: string
  hint: string
  options?: string[]
}

const ASSESSMENT = {
  title: "Software Engineering Fundamentals",
  description: "Comprehensive Assessment Covering Core Software Engineering Concepts And Best Practices",
  timeLimit: 25 * 60,
  candidateId: "WSO2-SSE422",
  questions: [
    {
      id: 1, type: "single" as QuestionType,
      text: "What Is The Primary Goal Of SOLID Principles In Software Design?",
      hint: "Select the best answer",
      options: ["To make code run faster", "To make software more maintainable, flexible and scalable", "To reduce the number of lines of code", "To eliminate the need for testing"],
    },
    {
      id: 2, type: "single" as QuestionType,
      text: "Which data structure follows the LIFO (Last In, First Out) principle?",
      hint: "Select the best answer",
      options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    },
    {
      id: 3, type: "multi" as QuestionType,
      text: "Which of the following are creational design patterns in software engineering?",
      hint: "Select all that apply — multiple answers may be correct",
      options: ["Singleton", "Observer", "Factory Method", "Abstract Factory", "Decorator", "Builder"],
    },
    {
      id: 4, type: "single" as QuestionType,
      text: "Which principle states that a class should have only one reason to change?",
      hint: "Select the best answer",
      options: ["Open/Closed Principle", "Liskov Substitution Principle", "Single Responsibility Principle", "Interface Segregation Principle"],
    },
    {
      id: 5, type: "multi" as QuestionType,
      text: "Which of the following are valid HTTP methods used in RESTful APIs?",
      hint: "Select all that apply — multiple answers may be correct",
      options: ["GET", "PUSH", "POST", "PATCH", "FETCH", "DELETE", "PUT"],
    },
    {
      id: 6, type: "text" as QuestionType,
      text: "Explain the difference between horizontal scaling and vertical scaling in distributed systems.",
      hint: "Write a detailed answer — minimum 2 sentences",
    },
    {
      id: 7, type: "single" as QuestionType,
      text: "What is the time complexity of binary search?",
      hint: "Select the best answer",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    },
    {
      id: 8, type: "text" as QuestionType,
      text: "Describe what a race condition is and provide a real-world example of how it can occur in concurrent programming.",
      hint: "Be specific about the cause and impact",
    },
    {
      id: 9, type: "single" as QuestionType,
      text: "In which design pattern does an object notify its dependents of state changes?",
      hint: "Select the best answer",
      options: ["Singleton", "Factory", "Observer", "Adapter"],
    },
    {
      id: 10, type: "multi" as QuestionType,
      text: "Which of the following are key principles of the Agile Manifesto?",
      hint: "Select all that apply — multiple answers may be correct",
      options: ["Individuals and interactions over processes and tools", "Comprehensive documentation over working software", "Responding to change over following a plan", "Contract negotiation over customer collaboration", "Working software over comprehensive documentation"],
    },
  ] as Question[],
}

// ─── Style constants ────────────────────────────────────────────────────────

const DARK = "#2d4a60"
const LIGHT_BG = "#f0f2f5"
const WHITE = "#ffffff"
const BORDER = "#e2e8f0"
const TEXT_MAIN = "#0f172a"
const TEXT_MUTED = "#64748b"
const TEXT_LIGHT = "#94a3b8"
const EMERALD = "#22c55e"
const SELECTED_BG = "rgba(45,74,96,0.10)"

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0")
  const s = (secs % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function CheckIcon({ color = DARK, size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke={color} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function BigCheckIcon() {
  return (
    <svg width="68" height="68" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={EMERALD} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={selected ? 2.5 : 1.5} stroke={selected ? DARK : "#cbd5e1"} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      {selected && <circle cx="12" cy="12" r="5" fill={DARK} />}
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke={EMERALD} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="white" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke={TEXT_MUTED} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════

type Screen = "intro" | "quiz" | "submitted"

export default function AssessmentPage() {
  const [screen, setScreen] = React.useState<Screen>("intro")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [currentQ, setCurrentQ] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<number, string | string[]>>({})
  const [timeLeft, setTimeLeft] = React.useState(ASSESSMENT.timeLimit)
  const [quitOpen, setQuitOpen] = React.useState(false)

  const total = ASSESSMENT.questions.length
  const question = ASSESSMENT.questions[currentQ]

  const isAnswered = (q: Question) => {
    const a = answers[q.id]
    if (!a) return false
    if (Array.isArray(a)) return a.length > 0
    return a.trim().length > 0
  }
  const answered = ASSESSMENT.questions.filter(isAnswered).length

  const toggleMulti = (qId: number, opt: string) => {
    setAnswers(prev => {
      const cur = (prev[qId] as string[] | undefined) ?? []
      const already = cur.includes(opt)
      return { ...prev, [qId]: already ? cur.filter(x => x !== opt) : [...cur, opt] }
    })
  }

  // Timer
  React.useEffect(() => {
    if (screen !== "quiz") return
    if (timeLeft <= 0) { setScreen("submitted"); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [screen, timeLeft])

  const goNext = () => {
    if (currentQ < total - 1) setCurrentQ(q => q + 1)
    else setScreen("submitted")
  }
  const goPrev = () => { if (currentQ > 0) setCurrentQ(q => q - 1) }
  const startQuiz = () => { if (name.trim() && email.trim()) setScreen("quiz") }

  const progress = (currentQ / total) * 100

  // ═══ INTRO ══════════════════════════════════════════════════════════════
  if (screen === "intro") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: LIGHT_BG, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 16px" }}>
        <div style={{ width: "100%", maxWidth: 900, backgroundColor: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

          {/* Dark header */}
          <div style={{ backgroundColor: DARK, padding: "40px 40px" }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: WHITE, margin: 0, marginBottom: 8, lineHeight: 1.3 }}>
              {ASSESSMENT.title}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>
              {ASSESSMENT.description}
            </p>
          </div>

          <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Guidelines */}
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: TEXT_MAIN, margin: 0, marginBottom: 20 }}>Important Guidelines</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  `You Will Have ${Math.floor(ASSESSMENT.timeLimit / 60)} Minutes To Complete This Assessment. The Timer Will Automatically Submit When Time Expires.`,
                  "Answer All Questions To The Best Of Your Ability. You Can Navigate Between Questions Using The Previous/Next Buttons.",
                  "Read Each Question Carefully And Provide Complete Answers For Text And Coding Questions.",
                  "Once Submitted, Your Answers Cannot Be Changed. Review Your Responses Before Clicking Submit.",
                ].map((text, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <CheckIcon />
                    <span style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Before you begin */}
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: TEXT_MAIN, margin: 0, marginBottom: 20 }}>Before You Begin</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: TEXT_MAIN, display: "block", marginBottom: 6 }}>Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ width: "100%", height: 44, padding: "0 14px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: TEXT_MAIN, backgroundColor: WHITE, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: TEXT_MAIN, display: "block", marginBottom: 6 }}>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: "100%", height: 44, padding: "0 14px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: TEXT_MAIN, backgroundColor: WHITE, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={startQuiz}
              disabled={!name.trim() || !email.trim()}
              style={{
                width: "100%", height: 52, backgroundColor: name.trim() && email.trim() ? DARK : "#94a3b8",
                color: WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600,
                cursor: name.trim() && email.trim() ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "opacity 0.15s",
              }}
            >
              Start Quiz
              <PlayIcon />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═══ SUBMITTED ═══════════════════════════════════════════════════════════
  if (screen === "submitted") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: LIGHT_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
        <div style={{ width: "100%", maxWidth: 520, backgroundColor: WHITE, borderRadius: 16, border: `1.5px solid #bbf7d0`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "56px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>

          <BigCheckIcon />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: TEXT_MAIN, margin: 0 }}>Quiz Submitted!</h1>
            <p style={{ fontSize: 14, color: TEXT_MUTED, margin: 0, lineHeight: 1.7 }}>
              Thank You For Completing The {ASSESSMENT.title} Quiz, {name}.
            </p>
          </div>

          <div style={{ width: "100%", backgroundColor: "#f8fafc", borderRadius: 12, padding: "20px 32px", display: "flex", flexDirection: "column", gap: 8, textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: TEXT_MAIN, margin: 0 }}>
              Questions Answered:{" "}
              <span style={{ color: DARK }}>{answered} Out Of {total}</span>
            </p>
            <p style={{ fontSize: 13, color: TEXT_MUTED, margin: 0, lineHeight: 1.6 }}>
              Your Responses Have Been Recorded. We Will<br />
              Review Your Answers And Provide Feedback Soon.
            </p>
          </div>

          <p style={{ fontSize: 13, color: TEXT_LIGHT, margin: 0 }}>
            A confirmation email has been sent to {email}
          </p>
        </div>
      </div>
    )
  }

  // ═══ QUIZ ════════════════════════════════════════════════════════════════
  return (
    <div style={{ height: "100vh", backgroundColor: LIGHT_BG, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: WHITE, borderBottom: `1px solid ${BORDER}`, flexShrink: 0, padding: "16px 28px" }}>
        <div style={{ maxWidth: "100%" }}>
          {/* Row 1 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 700, color: TEXT_MAIN, margin: 0 }}>{ASSESSMENT.title}</h1>
              <p style={{ fontSize: 13, color: TEXT_MUTED, margin: "3px 0 0 0" }}>Candidate ID : {ASSESSMENT.candidateId}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* Quit button */}
              <button
                onClick={() => setQuitOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "7px 16px", border: "1px solid #fca5a5",
                  borderRadius: 8, backgroundColor: "#fff1f2", color: "#dc2626",
                  fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#ffe4e6" }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff1f2" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Quit Quiz
              </button>

              {/* Quit confirmation dialog */}
              <AlertDialog open={quitOpen} onOpenChange={setQuitOpen}>
                <AlertDialogContent className="max-w-sm rounded-2xl border-slate-200 shadow-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[17px] font-semibold text-slate-900">
                      Quit this quiz?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[13px] text-slate-500 leading-relaxed">
                      Your progress and all answers will be lost. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="h-9 px-5 rounded-lg border-slate-200 text-slate-600 text-[13px] font-medium shadow-none hover:bg-slate-50">
                      Stay in Quiz
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => { window.location.href = "/dashboard/assessments" }}
                      className="h-9 px-5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium shadow-none border-none"
                    >
                      Yes, Quit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Timer */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ClockIcon />
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: timeLeft < 120 ? "#ef4444" : TEXT_MAIN, margin: 0, lineHeight: 1 }}>
                    {formatTime(timeLeft)}
                  </p>
                  <p style={{ fontSize: 11, color: TEXT_LIGHT, margin: "3px 0 0 0" }}>Time Remaining</p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: TEXT_MUTED, marginBottom: 10 }}>
            <span>Question {currentQ + 1} Of {total}</span>
            <span>{answered} Answered</span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 8, backgroundColor: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, backgroundColor: DARK, borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>

      {/* ── Body: Question + Sidebar ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", gap: 0 }}>

        {/* Question area — scrolls internally */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px 28px 28px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", backgroundColor: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "36px 44px", display: "flex", flexDirection: "column", gap: 28 }}>

            {/* Question header */}
            <div>
              <span style={{ display: "inline-block", backgroundColor: "#e8f5e9", color: DARK, fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 99, marginBottom: 16 }}>
                Question {currentQ + 1}
              </span>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT_MAIN, margin: "0 0 8px 0", lineHeight: 1.45 }}>
                {question.text}
              </h2>
              <p style={{ fontSize: 14, color: TEXT_MUTED, margin: 0 }}>{question.hint}</p>
            </div>

            {/* Options — changes by question type */}
            {question.type === "text" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ display: "inline-block", backgroundColor: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>Text Answer</span>
                </div>
                <textarea
                  placeholder="Type your answer here..."
                  value={(answers[question.id] as string) ?? ""}
                  onChange={e => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                  rows={6}
                  style={{
                    width: "100%", padding: "14px 16px", border: `1px solid ${BORDER}`,
                    borderRadius: 12, fontSize: 15, color: TEXT_MAIN, backgroundColor: WHITE,
                    resize: "vertical", outline: "none", fontFamily: "inherit",
                    lineHeight: 1.6, boxSizing: "border-box", transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.target.style.borderColor = DARK)}
                  onBlur={e => (e.target.style.borderColor = BORDER)}
                />
                <p style={{ fontSize: 12, color: TEXT_LIGHT, margin: "8px 0 0 0" }}>
                  {((answers[question.id] as string) ?? "").trim().split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            )}

            {question.type === "single" && question.options && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {question.options.map((opt, i) => {
                  const selected = answers[question.id] === opt
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers(prev => ({ ...prev, [question.id]: opt }))}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 18px", borderRadius: 12, textAlign: "left",
                        border: selected ? `1.5px solid ${DARK}` : `1px solid ${BORDER}`,
                        backgroundColor: selected ? SELECTED_BG : WHITE,
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      <RadioCircle selected={selected} />
                      <span style={{ fontSize: 15, color: selected ? DARK : TEXT_MAIN, fontWeight: selected ? 600 : 400 }}>{opt}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {question.type === "multi" && question.options && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ display: "inline-block", backgroundColor: "#fef3c7", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>Multiple Select</span>
                </div>
                {question.options.map((opt, i) => {
                  const sel = (answers[question.id] as string[] | undefined) ?? []
                  const checked = sel.includes(opt)
                  return (
                    <button
                      key={i}
                      onClick={() => toggleMulti(question.id, opt)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 18px", borderRadius: 12, textAlign: "left",
                        border: checked ? `1.5px solid ${DARK}` : `1px solid ${BORDER}`,
                        backgroundColor: checked ? SELECTED_BG : WHITE,
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                        border: checked ? `2px solid ${DARK}` : `2px solid #cbd5e1`,
                        backgroundColor: checked ? DARK : WHITE,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}>
                        {checked && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: 15, color: checked ? DARK : TEXT_MAIN, fontWeight: checked ? 600 : 400 }}>{opt}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
              <button
                onClick={goPrev}
                disabled={currentQ === 0}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "11px 22px",
                  border: `1px solid ${BORDER}`, borderRadius: 10, backgroundColor: WHITE,
                  fontSize: 14, fontWeight: 600, color: TEXT_MUTED, cursor: currentQ === 0 ? "not-allowed" : "pointer",
                  opacity: currentQ === 0 ? 0.4 : 1, transition: "opacity 0.15s",
                }}
              >
                <ArrowLeft />
                Previous
              </button>

              <button
                onClick={goNext}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "11px 26px",
                  border: "none", borderRadius: 10, backgroundColor: DARK,
                  fontSize: 14, fontWeight: 600, color: WHITE, cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                {currentQ === total - 1 ? "Submit Quiz" : "Next Question"}
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right sidebar: Question Navigation ──────────────────────────── */}
        <div style={{
          width: 300, flexShrink: 0, backgroundColor: WHITE,
          borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column",
          overflowY: "auto", padding: "24px 22px", gap: 20,
        }}>
          {/* Header */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, marginBottom: 14 }}>
              Questions
            </p>
            {/* Grid of numbered buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {ASSESSMENT.questions.map((q, i) => {
                const isAns = isAnswered(q)
                const isCurrent = i === currentQ
                let bg = "#f1f5f9"
                let color = TEXT_MUTED
                let border = "1px solid transparent"
                if (isCurrent) { bg = DARK; color = WHITE; border = `1px solid ${DARK}` }
                else if (isAns) { bg = "#dcfce7"; color = "#16a34a"; border = "1px solid #86efac" }
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQ(i)}
                    style={{
                      width: "100%", aspectRatio: "1", borderRadius: 8, border,
                      backgroundColor: bg, color, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.15s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
            {[
              { bg: DARK, border: `1px solid ${DARK}`, color: WHITE, label: "Current" },
              { bg: "#dcfce7", border: "1px solid #86efac", color: "#16a34a", label: "Answered" },
              { bg: "#f1f5f9", border: "1px solid transparent", color: TEXT_MUTED, label: "Unanswered" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: item.bg, border: item.border, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Submit shortcut */}
          <div style={{ marginTop: "auto" }}>
            <button
              onClick={() => setScreen("submitted")}
              style={{
                width: "100%", padding: "12px 0", backgroundColor: DARK, color: WHITE,
                border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Submit Quiz
            </button>
            <p style={{ fontSize: 11, color: TEXT_LIGHT, textAlign: "center", margin: "8px 0 0 0" }}>
              {answered}/{total} answered
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
