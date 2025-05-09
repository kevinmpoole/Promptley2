import { useState } from "react";
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

interface CardViewerProps {
  name: string;
  cardType: CardType;
  universe: string;
  thumbnail?: string;
  attributes?: Record<string, any>;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onVariant?: () => void;
}

const resolveThumbnailUrl = (thumbPath: string | undefined, universe: string): string | undefined => {
  if (!thumbPath) return undefined;

  if (thumbPath.startsWith("http") || thumbPath.startsWith("/")) return thumbPath;
  if (thumbPath.startsWith(`universes/${universe}/thumbnails/`)) {
    return `/${thumbPath}`;
  }
  if (thumbPath.startsWith(`${universe}/thumbnails/`)) {
    return `/universes/${thumbPath}`;
  }
  if (thumbPath.startsWith("thumbnails/")) {
    return `/universes/${universe}/${thumbPath}`;
  }

  return `/universes/${universe}/thumbnails/${thumbPath}`;
};

export { resolveThumbnailUrl };

const borderColorByType: Record<CardType, string> = {
  character: "border-blue-500",
  world: "border-green-500",
  scene: "border-purple-500",
  prop: "border-yellow-500",
  shot: "border-pink-500",
  event: "border-orange-500",
  frame: "border-white",
};

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

export function CardViewer({
  name,
  cardType,
  universe,
  thumbnail,
  attributes = {},
  onClick,
  onEdit,
  onDelete,
  onVariant,
}: CardViewerProps) {
  console.log("💥 raw thumbnail prop:", thumbnail);
  const resolvedThumb = resolveThumbnailUrl(thumbnail, universe);
  console.log("🧪 [CardViewer] Resolved:", resolvedThumb, "| Raw:", thumbnail);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const promptBuilder = getPromptBuilder(cardType);
  const prompt = promptBuilder(attributes);

  return (
    <div
      onClick={onClick}
      className={`bg-zinc-900 rounded-xl shadow-lg ring-1 ring-zinc-700 hover:ring-blue-500 
          transition-all cursor-pointer overflow-hidden group border ${borderColorByType[cardType]} 
          hover:shadow-blue-500/30 hover:scale-[0.97] duration-300 relative`}
      style={{ width: "100%", height: "100%" }}
    >
      <div className="relative aspect-[3/4] bg-zinc-800 overflow-hidden border-b border-zinc-700">
        {resolvedThumb ? (
          <img
            src={resolvedThumb}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.warn("❌ Image failed to load:", e.currentTarget.src);
              e.currentTarget.src = "/images/fallback-thumbnail.png";
            }}
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm italic">
            No image available
          </div>
        )}

     
      </div>

      <div className="p-2 space-y-1">
        <h3 className="text-white text-sm font-semibold truncate">{name}</h3>
        <p className="text-zinc-400 text-xs capitalize">{cardType} Card</p>

        {prompt && (
          <div
            className={`mt-2 text-xs text-zinc-400 italic whitespace-pre-wrap transition-all duration-300 ${
              isExpanded ? "max-h-[600px]" : "max-h-0 overflow-hidden"
            }`}
          >
            <span className="block p-2 bg-zinc-800 rounded-md border border-zinc-700">
              “{prompt}”
            </span>
          </div>
        )}

        {prompt && (
          <button
            onClick={toggleExpand}
            className="text-blue-400 text-xs mt-2 hover:text-blue-500 focus:outline-none"
          >
            {isExpanded ? "Show Less ▲" : "Show More ▼"}
          </button>
        )}
      </div>
    </div>
  );
}
