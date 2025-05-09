import { CardType } from "../types/CardTypes";
import {
  buildEntityPrompt,
  buildWorldPrompt,
  buildScenePrompt,
  buildPropPrompt,
  buildShotPrompt,
  buildEventPrompt,
  buildFramePrompt,
} from "./builders/EntityPromptBuilder";

interface AttributeField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  children?: AttributeField[];
}

interface Card {
  name: string;
  cardType: CardType;
  world?: string;
  baseCharacterName?: string;
  isBase?: boolean;
  attributes?: Record<string, any>;
  thumbnail?: string;
  prompt?: string;
}

interface CardEditModalProps {
  name: string;
  cardType: CardType;
  worldId?: string | null;
  thumbnail?: string | null;
  thumbnailFile?: File | null;
  onThumbnailSelect?: (file: File) => void;
  prompt?: string;
  attributes?: Record<string, any>;
  fields: AttributeField[];
  allCards: Card[];
  onChange: (key: string, value: any) => void;
  onSave: (card: Card) => void;
  onClose: () => void;
  readOnly?: boolean;
  onCreateVariant?: (worldName: string) => void;
}

/* =========================
   Select the right prompt builder 
========================= */
const getPromptBuilder = (cardType: CardType) => {
  switch (cardType) {
    case "character":
      return buildEntityPrompt;
    case "world":
      return buildWorldPrompt;
    case "scene":
      return buildScenePrompt;
    case "prop":
      return buildPropPrompt;
    case "shot":
      return buildShotPrompt;
    case "event":
      return buildEventPrompt;
    case "frame":
      return buildFramePrompt;
    default:
      return (attributes: Record<string, any>) => "No prompt available.";
  }
};

export default function CardEditModal({
  name,
  cardType,
  worldId = null,
  thumbnail,
  thumbnailFile,
  onThumbnailSelect,
  prompt = "",
  attributes = {},
  fields,
  onChange,
  onSave,
  onClose,
  readOnly = false,
}: CardEditModalProps) {
  
  const previewURL = thumbnailFile ? URL.createObjectURL(thumbnailFile) : thumbnail;

  /* =========================
     Handle Prompt Regeneration
  ========================= */
  const handlePromptRegeneration = (updatedAttributes: Record<string, any>) => {
    // Get the right builder
    const promptBuilder = getPromptBuilder(cardType);

    // Regenerate the prompt with new attributes
    const generatedPrompt = promptBuilder({
      ...updatedAttributes,
      name: updatedAttributes.name || name,
    });

    // Sync the updated prompt to state
    onChange("prompt", generatedPrompt);
  };

  /* =========================
     Handle Attribute Change
  ========================= */
  const handleAttributeChange = (key: string, value: any) => {
    const updatedAttributes = { ...attributes, [key]: value };
    onChange(key, value);

    // 🔄 Update attributes and regenerate prompt
    handlePromptRegeneration(updatedAttributes);
  };

  /* =========================
     Save Handler
  ========================= */
  const handleSave = () => {
    const normalizedName = name.trim();
    const card: Card = {
      name: normalizedName,
      cardType,
      world: worldId || undefined,
      prompt: prompt || "",
      thumbnail: thumbnailFile?.name || thumbnail || undefined,
      attributes: {
        ...attributes,
        id: normalizedName.toLowerCase().replace(/\s+/g, "_"),
      },
    };
    onSave(card);
  };

  /* =========================
     Render Component
  ========================= */
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center">
      <div className="w-[600px] max-h-[95vh] overflow-y-auto bg-zinc-950 rounded-2xl border-4 border-blue-600 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-900">
          <h2 className="text-white text-xl font-bold">✏️ {name}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl">
            ✕
          </button>
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded">
            Save
          </button>
        </div>

        {/* Name Field */}
        <div className="p-4">
          <label className="block text-xs uppercase text-zinc-500 mb-1">Name</label>
          <input
            type="text"
            value={name || ""}
            onChange={(e) => {
              onChange("name", e.target.value); 
              handlePromptRegeneration({ ...attributes, name: e.target.value });
            }}
            className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded"
            placeholder="Enter the name for the card"
            disabled={readOnly}
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="p-4">
          <label className="block text-xs uppercase text-zinc-500 mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onThumbnailSelect?.(file);
              }
            }}
            className="w-full text-sm text-white"
          />
          {previewURL && (
            <img
              src={previewURL}
              alt="Thumbnail Preview"
              className="w-full h-[250px] object-cover mt-4 border border-zinc-700 rounded"
            />
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs uppercase text-zinc-500 mb-1">Card Prompt or Description</label>
            <textarea
              value={prompt}
              onChange={(e) => onChange("prompt", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded resize-none"
              rows={4}
              disabled
            />
          </div>

          {fields.map((field) => {
            if (field.key === "name") return null;
            return (
              <div key={field.key}>
                <label className="block text-xs uppercase text-zinc-500 mb-1">{field.label}</label>
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={attributes?.[field.key] ?? ""}
                  onChange={(e) =>
                    handleAttributeChange(
                      field.key,
                      field.type === "number" ? Number(e.target.value) : e.target.value
                    )
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded"
                  disabled={readOnly}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
