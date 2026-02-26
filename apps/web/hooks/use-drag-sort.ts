/**
 * Shared drag-sort hook using react-dnd.
 *
 * Usage:
 *   const { dragRef, dropRef, isDragging, isOver } = useDragSort({ id, index, type, onMove })
 *
 * Combine refs:  ref={node => { dragRef(node); dropRef(node) }}
 */
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface UseDragSortOptions {
  /** Unique stable id for this item */
  id: string | number
  /** Current position in the list */
  index: number
  /** react-dnd item type string — use the same string for all items in the same list */
  type: string
  /** Called with (dragIndex, hoverIndex) to reorder the array in the parent */
  onMove: (dragIndex: number, hoverIndex: number) => void
}

export function useDragSort({ id, index, type, onMove }: UseDragSortOptions) {
  const ref = useRef<HTMLElement>(null)

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag({
    type,
    item: () => ({ id, index }),
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  })

  const [{ isOver }, dropRef] = useDrop<{ id: string | number; index: number }, void, { isOver: boolean }>({
    accept: type,
    collect: monitor => ({ isOver: monitor.isOver() }),
    hover(item, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return

      // Only trigger once mid-item
      const hoverRect = ref.current.getBoundingClientRect()
      const hoverMidY = (hoverRect.bottom - hoverRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const hoverClientY = clientOffset.y - hoverRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMidY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMidY) return

      onMove(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  // Merge drag + drop onto the same node
  dragRef(dropRef(ref))

  return { ref, isDragging, isOver, dragPreviewRef }
}
