import { useEffect, useState } from "react"
import { CardType } from "../types/CardTypes"
import { getSchemaForCardType } from "lib/schemaLoader"
import { useUniverse } from "lib/universeContext"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const FIELD_TYPES = ["text", "number", "select", "group"]

type AttributeField = {
  key: string
  label: string
  type: string
  required?: boolean
  options?: string[]
  children?: AttributeField[]
}

interface SchemaEditorProps {
  cardType: CardType
}

function SortableField({
  field,
  index,
  updateField,
  deleteField,
  addChildField,
  updateChildField,
  deleteChildField
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.key })

  return (
    <div
      ref={setNodeRef}
      className="border border-zinc-700 rounded-lg p-4 bg-zinc-800 space-y-3"
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <div className="flex gap-4 items-center cursor-move">
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField(index, { ...field, label: e.target.value })}
          placeholder="Label"
          className="flex-1 px-3 py-2 border border-zinc-700 rounded bg-zinc-900 text-white"
        />
        <input
          type="text"
          value={field.key}
          onChange={(e) => updateField(index, { ...field, key: e.target.value })}
          placeholder="Key"
          className="w-40 px-3 py-2 border border-zinc-700 rounded bg-zinc-900 text-white"
        />
        <select
          value={field.type}
          onChange={(e) => updateField(index, { ...field, type: e.target.value })}
          className="w-32 px-3 py-2 border border-zinc-700 rounded bg-zinc-900 text-white"
        >
          {FIELD_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button onClick={() => deleteField(index)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
      </div>

      {field.type === "select" && (
        <input
          type="text"
          placeholder="Comma-separated options"
          value={field.options?.join(", ") || ""}
          onChange={(e) => updateField(index, {
            ...field,
            options: e.target.value.split(",").map((s: string) => s.trim())
          })}
          className="w-full px-3 py-2 border border-zinc-700 rounded bg-zinc-900 text-white"
        />
      )}

      {field.type === "group" && (
        <div className="pl-4 mt-2 border-l-2 border-zinc-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-zinc-400">Subfields</span>
            <button onClick={() => addChildField(index)} className="text-xs text-blue-500 hover:underline">
              + Add Subfield
            </button>
          </div>
          {field.children?.map((child: any, j: number) => (
            <div key={j} className="bg-zinc-900 border border-zinc-700 rounded p-3 mb-2">
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={child.label}
                  onChange={(e) => updateChildField(index, j, { ...child, label: e.target.value })}
                  placeholder="Label"
                  className="flex-1 px-2 py-1 border border-zinc-700 rounded bg-zinc-900 text-white"
                />
                <input
                  type="text"
                  value={child.key}
                  onChange={(e) => updateChildField(index, j, { ...child, key: e.target.value })}
                  placeholder="Key"
                  className="w-32 px-2 py-1 border border-zinc-700 rounded bg-zinc-900 text-white"
                />
                <select
                  value={child.type}
                  onChange={(e) => updateChildField(index, j, { ...child, type: e.target.value })}
                  className="w-28 px-2 py-1 border border-zinc-700 rounded bg-zinc-900 text-white"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button onClick={() => deleteChildField(index, j)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SchemaEditor({ cardType }: SchemaEditorProps) {
  const [fields, setFields] = useState<AttributeField[]>([])
  const { universe } = useUniverse()

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    if (universe && cardType) {
      getSchemaForCardType(cardType, universe).then(setFields)
    }
  }, [cardType, universe])

  const saveSchema = async () => {
    const res = await fetch(`http://localhost:8000/api/universe/${universe}/schema/${cardType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    })
    alert(res.ok ? "✅ Schema Saved!" : "❌ Failed to save schema")
  }

  const updateField = (i: number, updated: AttributeField) => {
    const copy = [...fields]
    copy[i] = updated
    setFields(copy)
  }

  const addField = () => {
    setFields([...fields, { key: `field_${fields.length}`, label: "New Field", type: "text" }])
  }

  const addChildField = (parentIdx: number) => {
    const copy = [...fields]
    const parent = copy[parentIdx]
    if (parent.type === "group") {
      const child: AttributeField = {
        key: `child_${parent.children?.length || 0}`,
        label: "New Subfield",
        type: "text",
      }
      parent.children = [...(parent.children || []), child]
    }
    setFields(copy)
  }

  const updateChildField = (parentIdx: number, childIdx: number, updatedChild: AttributeField) => {
    const copy = [...fields]
    const parent = copy[parentIdx]
    if (parent.type === "group" && parent.children) {
      parent.children[childIdx] = updatedChild
    }
    setFields(copy)
  }

  const deleteField = (i: number) => {
    const copy = [...fields]
    copy.splice(i, 1)
    setFields(copy)
  }

  const deleteChildField = (parentIdx: number, childIdx: number) => {
    const copy = [...fields]
    const parent = copy[parentIdx]
    if (parent.type === "group" && parent.children) {
      parent.children.splice(childIdx, 1)
    }
    setFields(copy)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.key === active.id)
      const newIndex = fields.findIndex((f) => f.key === over.id)
      setFields((fields) => arrayMove(fields, oldIndex, newIndex))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold capitalize">{cardType} Schema Editor</h2>
        <button onClick={addField} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500">
          + Add Field
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map(f => f.key)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {fields.map((field, i) => (
              <SortableField
                key={field.key}
                field={field}
                index={i}
                updateField={updateField}
                deleteField={deleteField}
                addChildField={addChildField}
                updateChildField={updateChildField}
                deleteChildField={deleteChildField}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button onClick={saveSchema} className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded shadow">
        💾 Save Schema
      </button>
    </div>
  )
}
