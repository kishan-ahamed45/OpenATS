"use client";

import { useState, useEffect, useRef } from "react";
import type { Ref } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { GripVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface Candidate {
  id: string;
  name: string;
  time: string;
}

interface Stage {
  id: string;
  title: string;
  color: string;
  candidates: Candidate[];
}

const CARD_TYPE = "PIPELINE_CARD";

// ── Custom drag layer (angled floating card) ──────────────────────────────────
function CustomDragLayer() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem() as { name: string; time: string } | null,
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !currentOffset || !item) return null;

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        left: 0,
        top: 0,
        zIndex: 9999,
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
      }}
    >
      <div
        style={{ transform: "rotate(3deg)" }}
        className="bg-white border border-slate-300 shadow-xl px-3 py-2.5 rounded-lg flex items-center gap-2 w-[260px] opacity-95"
      >
        <GripVertical className="size-3.5 text-slate-300 shrink-0" />
        <div className="space-y-0.5 min-w-0">
          <p className="font-semibold text-[var(--theme-color)] text-[13px] leading-snug truncate">
            {item.name}
          </p>
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-tight">
            {item.time}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Draggable card with hover-index drop target ───────────────────────────────
function DraggableCard({
  candidate,
  stageId,
  index,
  onReorder,
}: {
  candidate: Candidate;
  stageId: string;
  index: number;
  onReorder: (
    fromStageId: string,
    fromIndex: number,
    toStageId: string,
    toIndex: number,
  ) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag({
    type: CARD_TYPE,
    item: {
      id: candidate.id,
      name: candidate.name,
      time: candidate.time,
      fromStageId: stageId,
      fromIndex: index,
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  useEffect(() => {
    dragPreviewRef(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreviewRef]);

  const [{ isOver, isAbove }, dropRef] = useDrop<
    { id: string; fromStageId: string; fromIndex: number },
    void,
    { isOver: boolean; isAbove: boolean }
  >({
    accept: CARD_TYPE,
    hover(dragItem, monitor) {
      if (!ref.current) return;
      if (dragItem.id === candidate.id) return;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const toIndex = hoverClientY < hoverMiddleY ? index : index + 1;
      onReorder(dragItem.fromStageId, dragItem.fromIndex, stageId, toIndex);
      dragItem.fromStageId = stageId;
      dragItem.fromIndex = toIndex > dragItem.fromIndex ? toIndex - 1 : toIndex;
    },
    collect: (monitor) => {
      if (!ref.current || !monitor.isOver())
        return { isOver: false, isAbove: false };
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset
        ? clientOffset.y - hoverBoundingRect.top
        : 0;
      return { isOver: monitor.isOver(), isAbove: hoverClientY < hoverMiddleY };
    },
  });

  dragRef(dropRef(ref));

  return (
    <div
      ref={ref as unknown as Ref<HTMLDivElement>}
      className={`bg-white px-3 py-2.5 rounded-lg flex items-center gap-2 group select-none transition-colors ${
        isDragging
          ? "border-2 border-dashed border-[var(--theme-color)] opacity-40 cursor-grabbing"
          : "border border-slate-200 hover:border-[var(--theme-color)]/40 cursor-grab"
      }`}
    >
      <GripVertical className="size-3.5 text-slate-300 shrink-0 group-hover:text-slate-400 transition-colors" />
      <div className="space-y-0.5 min-w-0">
        <p className="font-semibold text-slate-800 text-[13px] leading-snug group-hover:text-[var(--theme-color)] transition-colors truncate">
          {candidate.name}
        </p>
        <p className="text-slate-400 text-[10px] font-medium uppercase tracking-tight">
          {candidate.time}
        </p>
      </div>
    </div>
  );
}

// ── Droppable column ──────────────────────────────────────────────────────────
function DroppableColumn({
  stage,
  onDropToStage,
  onReorder,
}: {
  stage: Stage;
  onDropToStage: (
    cardId: string,
    fromStageId: string,
    toStageId: string,
  ) => void;
  onReorder: (
    fromStageId: string,
    fromIndex: number,
    toStageId: string,
    toIndex: number,
  ) => void;
}) {
  const [{ isOver, canDrop }, dropRef] = useDrop<
    { id: string; fromStageId: string; fromIndex: number },
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: CARD_TYPE,
    drop: (item) => {
      if (item.fromStageId !== stage.id) {
        onDropToStage(item.id, item.fromStageId, stage.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div className="w-[300px] min-h-[520px] flex flex-col shrink-0">
      <div className="flex items-center gap-2.5 px-0.5 mb-4 shrink-0">
        <div
          className="size-2 rounded-full"
          style={{ backgroundColor: stage.color }}
        />
        <h3 className="font-semibold text-slate-700 text-[15px]">
          {stage.title}
        </h3>
        <span className="ml-auto text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300 uppercase tracking-tighter">
          {stage.candidates.length} Cards
        </span>
      </div>

      <div
        ref={dropRef as unknown as Ref<HTMLDivElement>}
        className={`flex-1 rounded-xl p-3 space-y-2 overflow-y-auto custom-scrollbar-y transition-colors duration-150 ${
          isActive
            ? "bg-[var(--theme-color)]/5 border-2 border-dashed border-[var(--theme-color)]/40"
            : "bg-slate-50/60 border border-slate-200"
        }`}
      >
        {stage.candidates.length === 0 && (
          <div
            className={`h-20 flex items-center justify-center rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${
              isActive
                ? "border-[var(--theme-color)]/40 text-[var(--theme-color)]/60 bg-[var(--theme-color)]/5"
                : "border-slate-200 text-slate-300"
            }`}
          >
            {isActive ? "Drop here" : "No candidates"}
          </div>
        )}
        {stage.candidates.map((candidate, index) => (
          <DraggableCard
            key={candidate.id}
            candidate={candidate}
            stageId={stage.id}
            index={index}
            onReorder={onReorder}
          />
        ))}
      </div>
    </div>
  );
}

const INITIAL_STAGES: Stage[] = [
  {
    id: "screening",
    title: "Screening",
    color: "#4CAF50",
    candidates: [
      { id: "c1", name: "Chamal Senarathna", time: "32 minutes ago" },
      { id: "c2", name: "Lex Fridman", time: "45 minutes ago" },
      { id: "c3", name: "Nuwan Perera", time: "1 hour ago" },
      { id: "c4", name: "Sithum Jayasinghe", time: "2 hours ago" },
    ],
  },
  {
    id: "qualified",
    title: "Qualified",
    color: "#FF9800",
    candidates: [
      { id: "c5", name: "Risikeesan J.", time: "45 minutes ago" },
      { id: "c6", name: "Kishan Ahamed", time: "45 minutes ago" },
    ],
  },
  {
    id: "interviews",
    title: "Interviews",
    color: "#2196F3",
    candidates: [
      { id: "c7", name: "Chamal Senarathna", time: "32 minutes ago" },
    ],
  },
  {
    id: "offer",
    title: "Offer",
    color: "#4CAF50",
    candidates: [{ id: "c8", name: "Bhanuka H.", time: "45 minutes ago" }],
  },
  {
    id: "hired",
    title: "Hired",
    color: "#10B981",
    candidates: [{ id: "c9", name: "John Doe", time: "1 hour ago" }],
  },
  {
    id: "rejected",
    title: "Rejected",
    color: "#EF4444",
    candidates: [{ id: "c10", name: "Jane Smith", time: "2 hours ago" }],
  },
];

export default function HiringPipelinePage() {
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  useEffect(() => {
    if (!isDragging) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const EDGE = 120;
    const SPEED = 12;

    const onMouseMove = (e: MouseEvent) => {
      const container = scrollRef.current;
      if (!container) return;
      const { left, right } = container.getBoundingClientRect();

      const scroll = () => {
        if (!isDragging) return;
        if (e.clientX < left + EDGE) {
          container.scrollLeft -= SPEED;
        } else if (e.clientX > right - EDGE) {
          container.scrollLeft += SPEED;
        }
        animFrameRef.current = requestAnimationFrame(scroll);
      };

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(scroll);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging]);

  // Move between stages (drop on empty column area)
  const handleDropToStage = (
    cardId: string,
    fromStageId: string,
    toStageId: string,
  ) => {
    setStages((prev) => {
      const fromStage = prev.find((s) => s.id === fromStageId)!;
      const card = fromStage.candidates.find((c) => c.id === cardId)!;
      return prev.map((stage) => {
        if (stage.id === fromStageId)
          return {
            ...stage,
            candidates: stage.candidates.filter((c) => c.id !== cardId),
          };
        if (stage.id === toStageId)
          return { ...stage, candidates: [...stage.candidates, card] };
        return stage;
      });
    });
  };

  // Reorder within or across stages by index
  const handleReorder = (
    fromStageId: string,
    fromIndex: number,
    toStageId: string,
    toIndex: number,
  ) => {
    setStages((prev) => {
      const fromStage = prev.find((s) => s.id === fromStageId)!;
      const card = fromStage.candidates[fromIndex];
      if (!card) return prev;

      if (fromStageId === toStageId) {
        if (fromIndex === toIndex) return prev;
        const newCandidates = [...fromStage.candidates];
        newCandidates.splice(fromIndex, 1);
        newCandidates.splice(
          toIndex > fromIndex ? toIndex - 1 : toIndex,
          0,
          card,
        );
        return prev.map((s) =>
          s.id === fromStageId ? { ...s, candidates: newCandidates } : s,
        );
      }

      return prev.map((stage) => {
        if (stage.id === fromStageId)
          return {
            ...stage,
            candidates: stage.candidates.filter((_, i) => i !== fromIndex),
          };
        if (stage.id === toStageId) {
          const newCandidates = [...stage.candidates];
          newCandidates.splice(toIndex, 0, card);
          return { ...stage, candidates: newCandidates };
        }
        return stage;
      });
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height))] bg-white overflow-hidden w-full min-w-0">
      <CustomDragLayer />

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white shrink-0 w-full">
        <div className="px-8 pt-8 pb-6 overflow-hidden">
          <div className="flex items-center justify-between gap-4 max-w-full">
            <div className="space-y-4 min-w-0">
              <div className="flex items-center gap-4">
                <h1 className="text-[32px] font-semibold text-slate-900 leading-none truncate">
                  Intern - Software Engineer
                </h1>
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
                <span className="shrink-0 text-slate-400">
                  Posted On 18/02/26
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-slate-200" />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 w-full min-w-0 overflow-x-auto overflow-y-auto bg-slate-50/10 pipeline-scroll-container"
      >
        <div className="flex min-h-full p-8 gap-5 w-max items-stretch">
          {stages.map((stage) => (
            <DroppableColumn
              key={stage.id}
              stage={stage}
              onDropToStage={handleDropToStage}
              onReorder={handleReorder}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
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
  );
}
