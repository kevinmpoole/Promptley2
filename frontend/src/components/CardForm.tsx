import React from "react";

type AttributeField = {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  children?: AttributeField[];
};

type Props = {
  fields: AttributeField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

const CardForm: React.FC<Props> = ({ fields, values, onChange }) => {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-1">
          <label className="block text-sm font-medium text-gray-800">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === "select" && field.options ? (
            <select
              value={values[field.key] || ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="w-full px-2 py-1 border rounded bg-white"
            >
              <option value="">Select...</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={values[field.key] || ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="w-full px-2 py-1 border rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CardForm;
