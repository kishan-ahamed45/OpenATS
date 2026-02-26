'use client'

import * as React from 'react'
import { Archive01Icon, Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { getArchived, permanentlyDelete, type ArchiveType, type ArchiveEntry } from '@/lib/archive-store'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

const TYPE_LABELS: Record<ArchiveType, string> = {
  job: 'Jobs',
  candidate: 'Candidates',
  offer: 'Offers',
}

const TYPE_BADGE: Record<ArchiveType, string> = {
  job:       'bg-blue-50  text-blue-700  border border-blue-100',
  candidate: 'bg-violet-50 text-violet-700 border border-violet-100',
  offer:     'bg-emerald-50 text-emerald-700 border border-emerald-100',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ArchivePage() {
  const [items, setItems] = React.useState<ArchiveEntry[]>([])
  const [activeTab, setActiveTab] = React.useState<ArchiveType>('job')
  const [deleteTarget, setDeleteTarget] = React.useState<ArchiveEntry | null>(null)

  const refresh = React.useCallback(() => setItems(getArchived()), [])
  React.useEffect(() => {
    refresh()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [refresh])

  const confirmDelete = () => {
    if (!deleteTarget) return
    permanentlyDelete(deleteTarget.id, deleteTarget.type)
    refresh()
    setDeleteTarget(null)
  }

  const filtered = items.filter(i => i.type === activeTab)

  return (
    <div className='flex flex-1 flex-col bg-white'>
      {/* Header */}
      <div className='px-8 py-4 flex items-center justify-between'>
        <h1 className='text-[28px] font-medium text-slate-900 leading-none'>Archive</h1>
        <p className='text-sm text-slate-400'>{items.length} archived item{items.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Tab bar */}
      <div className='border-y border-slate-200 px-8 py-3.5 flex items-center gap-2'>
        {(['job', 'candidate', 'offer'] as ArchiveType[]).map(t => {
          const count = items.filter(i => i.type === t).length
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t
                  ? 'bg-[#355872] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {TYPE_LABELS[t]}
              {count > 0 && (
                <span className={`ml-2 text-xs font-semibold px-1.5 py-0.5 rounded-full ${activeTab === t ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className='px-8 py-6'>
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-52 gap-3 text-slate-400'>
            <HugeiconsIcon icon={Archive01Icon} className='size-10 opacity-30' />
            <p className='text-sm'>No archived {TYPE_LABELS[activeTab].toLowerCase()} yet.</p>
          </div>
        ) : (
          <div className='border border-slate-200 rounded-xl overflow-hidden'>
            {/* Table header */}
            <div className='grid grid-cols-[1fr_auto_auto_auto] items-center px-6 h-11 border-b border-slate-200 bg-slate-50/50'>
              <span className='text-xs font-semibold text-slate-700 uppercase tracking-wide'>Name</span>
              <span className='text-xs font-semibold text-slate-700 uppercase tracking-wide w-40 text-left pr-6'>Type</span>
              <span className='text-xs font-semibold text-slate-700 uppercase tracking-wide w-36 text-left pr-6'>Archived On</span>
              <span className='w-10' />
            </div>

            {/* Rows */}
            {filtered.map(entry => (
              <div key={`${entry.type}-${entry.id}`} className='grid grid-cols-[1fr_auto_auto_auto] items-center px-6 h-14 border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors'>
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-slate-800 truncate'>{entry.name}</p>
                  <p className='text-xs text-slate-400 truncate'>{entry.detail}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full w-40 text-left ${TYPE_BADGE[entry.type]}`}>
                  {TYPE_LABELS[entry.type].slice(0, -1)} {/* "Job", "Candidate", "Offer" */}
                </span>
                <span className='text-xs text-slate-400 w-36 pr-6'>{formatDate(entry.archivedAt)}</span>
                <button
                  onClick={() => setDeleteTarget(entry)}
                  className='flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors'
                  title='Permanently delete'
                >
                  <HugeiconsIcon icon={Delete02Icon} className='size-4' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Permanent Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent className='max-w-sm rounded-xl border-slate-200 shadow-lg'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-[17px] font-semibold text-slate-900'>Permanently Delete?</AlertDialogTitle>
            <AlertDialogDescription className='text-[13px] text-slate-500 leading-relaxed'>
              <strong className='text-slate-700'>{deleteTarget?.name}</strong> will be permanently removed and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='gap-2'>
            <AlertDialogCancel className='h-9 px-5 rounded-lg border-slate-200 text-slate-600 text-[13px] font-medium shadow-none'>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className='h-9 px-5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium shadow-none border-none'>
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
