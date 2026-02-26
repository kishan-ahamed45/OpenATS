export interface Candidate {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  role: string;
  tags: string;
  appliedOn: string;
  email: string;
  phone: string;
  linkedin: string;
}

const KEY = 'openats_candidates'

export function loadCandidates(): Candidate[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveCandidate(c: Candidate) {
  const all = loadCandidates()
  all.unshift(c)
  localStorage.setItem(KEY, JSON.stringify(all))
}
