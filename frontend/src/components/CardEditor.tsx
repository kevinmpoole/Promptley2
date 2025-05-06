import React from "react"
import { CardType } from "../types/CardTypes"

export type AttributeField = {
  key: string
  label: string
  type: string
  required?: boolean
  options?: string[]
  children?: AttributeField[]
}

interface CardEditorProps {
  cardType: CardType
  schema: AttributeField[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
}

export const CardEditor: React.FC<CardEditorProps> = ({
  schema,
  values,
  onChange
}) => {
  const renderField = (field: AttributeField) => {
    const value = values[field.key] ?? ""

    if (field.type === "group" && field.children) {
      return (
        <fieldset key={field.key} className="mb-4 border p-4 rounded border-gray-300">
          <legend className="text-sm font-medium text-gray-700 mb-2">{field.label}</legend>
          {field.children.map(renderField)}
        </fieldset>
      )
    }

    if (field.type === "select") {
      return (
        <div key={field.key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
          >
            <option value="">Select</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )
    }

    return (
      <div key={field.key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {schema.map(renderField)}

      {/* If thumbnail is already attached, show preview */}
      {values.thumbnail && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Thumbnail</label>
          <img
            src={values.thumbnail.startsWith("/thumbnails/") ? values.thumbnail : `/thumbnails/${values.thumbnail}`}
            alt="Thumbnail"
            className="w-32 h-32 object-cover border rounded"
          />
        </div>
      )}
    </div>
  )
}
