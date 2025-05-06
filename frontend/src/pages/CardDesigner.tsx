// src/pages/CardDesigner.tsx
import { useEffect, useState } from "react"
import { CardType } from "../types/CardTypes"
import { getSchemaForCardType } from "lib/schemaLoader"
import { useUniverse } from "lib/universeContext"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
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

function SortableField({
  field,
  index,
  updateField,
  deleteField,
  addChildField,
  updateChildField,
  deleteChildField,
}: {
  field: AttributeField
  index: number
  updateField: any
  deleteField: any
  addChildField: any
  updateChildField: any
  deleteChildField: any
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.key })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="border border-zinc-700 rounded-lg p-4 bg-zinc-800 space-y-3 cursor-move"
    >
      <div className="flex gap-4 items-center">
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
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button onClick={() => deleteField(index)} className="text-red-500 hover:text-red-700 text-sm">
          ✕
        </button>
      </div>

      {field.type === "select" && (
        <input
          type="text"
          placeholder="Comma-separated options"
          value={field.options?.join(", ") || ""}
          onChange={(e) =>
            updateField(index, {
              ...field,
              options: e.target.value.split(",").map((s) => s.trim()),
            })
          }
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

          {field.children?.map((child, j) => (
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
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => deleteChildField(index, j)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CardDesigner() {
  const [selectedType, setSelectedType] = useState<CardType>("character")
  const [fields, setFields] = useState<AttributeField[]>([])
  const { universe } = useUniverse()

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    if (universe) getSchemaForCardType(selectedType, universe).then(setFields)
  }, [selectedType, universe])

  const saveSchema = async () => {
    const res = await fetch(`http://localhost:8000/api/universe/${universe}/schema/${selectedType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    })
    alert(res.ok ? "✅ Schema saved!" : "❌ Failed to save schema")
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
    <div className="flex p-6 gap-6 bg-zinc-950 text-white min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-40 bg-zinc-900 rounded-lg shadow p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase text-zinc-400 mb-2">Card Types</h2>
        {(["character", "world", "scene", "prop", "shot", "event"] as CardType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`w-full text-left px-3 py-2 rounded text-sm capitalize ${
              selectedType === type ? "bg-blue-600 text-white" : "hover:bg-zinc-800 text-zinc-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 bg-zinc-900 rounded-lg shadow p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Schema</h2>
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

        <button
          onClick={saveSchema}
          className="mt-8 px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded shadow"
        >
          💾 Save Schema
        </button>
      </div>
    </div>
  )
}
