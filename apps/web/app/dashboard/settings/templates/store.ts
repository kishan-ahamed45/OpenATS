// Shared template store backed by localStorage so Create/Edit/Delete
// all persist across page navigations without a backend.

export type TemplateType = "offer" | "rejection" | "assessment" | "general"
export type BlockKind = "heading" | "text" | "button" | "image" | "divider" | "spacer"

export interface Block {
  id: string
  kind: BlockKind
  content: string
}

export interface Template {
  id: number
  name: string
  type: TemplateType
  subject: string
  blocks: Block[]
  editedAt: string
  createdBy: string
}

const KEY = "openats_templates"

const SEED: Template[] = [
  {
    id: 1, type: "offer", name: "Software Engineering Offer Letter",
    subject: "Your Offer Letter — {{job_title}} at {{company_name}}",
    blocks: [
      { id: "h1", kind: "heading", content: "Welcome aboard, {{candidate_name}}!" },
      { id: "t1", kind: "text",    content: "We are thrilled to offer you the position of {{job_title}} at {{company_name}}.\n\nYour compensation will be {{currency}} {{salary}} per month, starting {{start_date}}.\n\nPlease accept this offer by {{expiry_date}}." },
      { id: "b1", kind: "button",  content: "Accept Offer" },
    ],
    editedAt: "14/02/2026", createdBy: "Chamal Senarathna",
  },
  {
    id: 2, type: "rejection", name: "Standard Rejection Email",
    subject: "Your Application for {{job_title}} at {{company_name}}",
    blocks: [
      { id: "h1", kind: "heading", content: "Thank you for applying, {{candidate_name}}" },
      { id: "t1", kind: "text",    content: "After careful consideration, we have decided to move forward with other candidates.\n\nWe appreciate your interest in {{company_name}} and encourage you to apply for future openings." },
    ],
    editedAt: "10/02/2026", createdBy: "Risikesan Jegatheesan",
  },
  {
    id: 3, type: "assessment", name: "Technical Assessment Invite",
    subject: "Complete Your Assessment — {{job_title}}",
    blocks: [
      { id: "h1", kind: "heading", content: "Hi {{candidate_name}}, you're invited!" },
      { id: "t1", kind: "text",    content: "As part of the selection process for {{job_title}}, please complete your assessment:" },
      { id: "b1", kind: "button",  content: "Start Assessment" },
      { id: "t2", kind: "text",    content: "This link expires on {{expiry_date}}." },
    ],
    editedAt: "08/02/2026", createdBy: "Chamal Senarathna",
  },
  {
    id: 4, type: "general", name: "General Update Email",
    subject: "Update from {{company_name}}",
    blocks: [
      { id: "h1", kind: "heading", content: "Hello {{candidate_name}}," },
      { id: "t1", kind: "text",    content: "We wanted to reach out regarding your application for {{job_title}} at {{company_name}}." },
    ],
    editedAt: "12/02/2026", createdBy: "Kishan Ahamed",
  },
  {
    id: 5, type: "offer", name: "Backend Engineer Offer Letter",
    subject: "Your Offer — {{job_title}} at {{company_name}}",
    blocks: [
      { id: "h1", kind: "heading", content: "Congratulations, {{candidate_name}}!" },
      { id: "t1", kind: "text",    content: "We are excited to offer you the role of {{job_title}} at {{currency}} {{salary}}/month." },
      { id: "b1", kind: "button",  content: "View & Accept" },
    ],
    editedAt: "07/02/2026", createdBy: "Chamal Senarathna",
  },
]

function load(): Template[] {
  if (typeof window === "undefined") return SEED
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return SEED
    return JSON.parse(raw) as Template[]
  } catch {
    return SEED
  }
}

function persist(list: Template[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function getTemplates(): Template[] {
  return load()
}

export function getTemplate(id: number): Template | undefined {
  return load().find(t => t.id === id)
}

export function addTemplate(data: Omit<Template, "id">): Template {
  const list = load()
  const t: Template = { ...data, id: Date.now() }
  persist([...list, t])
  return t
}

export function updateTemplate(id: number, data: Omit<Template, "id">) {
  const list = load().map(t => t.id === id ? { ...data, id } : t)
  persist(list)
}

export function deleteTemplate(id: number) {
  persist(load().filter(t => t.id !== id))
}

export function duplicateTemplate(id: number) {
  const src = load().find(t => t.id === id)
  if (!src) return
  addTemplate({ ...src, name: `${src.name} (Copy)`, editedAt: "Just now" })
}
