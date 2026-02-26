export type ArchiveType = 'job' | 'candidate' | 'offer'

export interface ArchiveEntry {
  id: string
  type: ArchiveType
  name: string       // primary display name
  detail: string     // secondary info (role, dept, etc.)
  archivedAt: string // ISO date string
}

const KEY = 'openats_archive'

function load(): ArchiveEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function save(entries: ArchiveEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function archiveItem(entry: Omit<ArchiveEntry, 'archivedAt'>) {
  const all = load()
  // avoid duplicates
  if (all.find(e => e.id === entry.id && e.type === entry.type)) return
  save([...all, { ...entry, archivedAt: new Date().toISOString() }])
}

export function getArchived(type?: ArchiveType): ArchiveEntry[] {
  const all = load()
  return type ? all.filter(e => e.type === type) : all
}

export function permanentlyDelete(id: string, type: ArchiveType) {
  save(load().filter(e => !(e.id === id && e.type === type)))
}
