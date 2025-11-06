import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Copy, Trash2 } from 'lucide-react'
import { cn } from '@/utils/index'
import { Layer } from '@/types/index'
import { useAppStore } from '@/store/index'
import { Input } from '@/components/ui/Input'
import { NumberInput } from '@/components/ui/NumberInput'
import { Button } from '@/components/ui/Button'

interface DataTableProps {
  layers: Layer[]
  onAddLayer: () => void
}

/**
 * DataTable component following WUFI Cloud UI/UX v2.1 Part 2 specification
 *
 * Features:
 * - Drag-and-drop reordering using @dnd-kit
 * - Inline editing for layer name and thickness
 * - Material column (clickable teal link)
 * - Actions: Duplicate, Delete
 * - Selected row highlighting (teal background, 2px left border)
 * - Validation on blur
 * - Auto-save on changes
 * - Sticky header on scroll
 *
 * Columns:
 * 1. [Drag Handle] - 24px
 * 2. [#] - 32px
 * 3. [Layer Name] - flexible, min 120px
 * 4. [Material] - flexible
 * 5. [Thickness] - 80px, right-aligned
 * 6. [λ (dry)] - 60px, right-aligned, monospace
 * 7. [Actions] - 80px
 */
export function DataTable({ layers, onAddLayer }: DataTableProps) {
  const selectedLayerId = useAppStore((state) => state.ui.selectedLayerId)
  const { selectLayer, updateLayer, deleteLayer, reorderLayers, duplicateLayer, openModal } =
    useAppStore((state) => state.actions)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = layers.findIndex((l) => l.id === active.id)
      const newIndex = layers.findIndex((l) => l.id === over.id)

      reorderLayers(oldIndex, newIndex)
    }
  }

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div
        className="grid grid-cols-[24px_32px_minmax(120px,1fr)_minmax(150px,1fr)_80px_60px_80px] gap-2 px-4 py-3 border-b border-neutral-200 font-bold text-xs sticky top-0 bg-neutral-100 z-10"
        style={{ color: '#5E5A58' }}
      >
        <div></div> {/* Drag handle */}
        <div className="text-center">#</div>
        <div>Layer Name</div>
        <div>Material</div>
        <div className="text-right">Thickness [m]</div>
        <div className="text-right">λ [W/mK]</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Table Body with DnD */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={layers.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {layers.map((layer, index) => (
            <SortableRow
              key={layer.id}
              layer={layer}
              index={index}
              isSelected={selectedLayerId === layer.id}
              onSelect={() => selectLayer(layer.id)}
              onUpdate={(updates) => updateLayer(layer.id, updates)}
              onDuplicate={() => duplicateLayer(layer.id)}
              onDelete={() => {
                if (layers.length === 1) {
                  // Show warning toast - can't delete last layer
                  console.warn('Cannot delete the last layer')
                } else {
                  deleteLayer(layer.id)
                }
              }}
              onMaterialClick={() => {
                selectLayer(layer.id)
                openModal('material-database')
              }}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Table Footer */}
      <div className="px-4 py-3 border-t border-neutral-200">
        <Button variant="secondary" onClick={onAddLayer}>
          + Add Layer
        </Button>
      </div>
    </div>
  )
}

interface SortableRowProps {
  layer: Layer
  index: number
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Layer>) => void
  onDuplicate: () => void
  onDelete: () => void
  onMaterialClick: () => void
}

function SortableRow({
  layer,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  onMaterialClick,
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: layer.id,
  })

  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(layer.name || '')

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleNameBlur = () => {
    setIsEditingName(false)
    if (editedName !== layer.name) {
      onUpdate({ name: editedName })
    }
  }

  const handleThicknessChange = (value: number | null) => {
    if (value !== null && value !== layer.thickness) {
      onUpdate({ thickness: value })
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'grid grid-cols-[24px_32px_minmax(120px,1fr)_minmax(150px,1fr)_80px_60px_80px] gap-2 px-4 py-3 border-b border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer',
        isSelected && 'bg-bluegreen bg-opacity-10 border-l-2 border-l-bluegreen'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div className="flex items-center" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing" style={{ color: '#BDB2AA' }} />
      </div>

      {/* Row Number */}
      <div className="flex items-center justify-center text-sm font-mono" style={{ color: '#5E5A58' }}>
        {index + 1}
      </div>

      {/* Layer Name (editable) */}
      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
        {isEditingName ? (
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNameBlur()
              }
            }}
            className="text-sm"
            autoFocus
          />
        ) : (
          <span
            className="text-sm cursor-text"
            style={{ color: '#33302F' }}
            onClick={() => setIsEditingName(true)}
          >
            {layer.name || 'Untitled Layer'}
          </span>
        )}
      </div>

      {/* Material (clickable link) */}
      <div
        className="flex items-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          onMaterialClick()
        }}
      >
        <span
          className="text-sm font-medium hover:underline"
          style={{ color: '#4AB79F' }}
        >
          {layer.material.name}
        </span>
      </div>

      {/* Thickness (editable) */}
      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
        <NumberInput
          value={layer.thickness}
          onChange={handleThicknessChange}
          min={0.001}
          max={10}
          decimals={3}
          unit="m"
          className="text-sm text-right"
        />
      </div>

      {/* λ (dry) - read-only */}
      <div className="flex items-center justify-end text-sm font-mono" style={{ color: '#5E5A58' }}>
        {layer.material.thermalConductivity.toFixed(3)}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onDuplicate}
          className="p-1 rounded hover:bg-neutral-100 transition-colors"
          title="Duplicate layer"
        >
          <Copy className="w-4 h-4" style={{ color: '#4AB79F' }} />
        </button>
        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-red-50 transition-colors"
          title="Delete layer"
        >
          <Trash2 className="w-4 h-4" style={{ color: '#C04343' }} />
        </button>
      </div>
    </div>
  )
}
