import React, { useState } from "react";
import { MiniCardData } from "./MiniCard";
import { TimelineStack } from "./TimelineStack";

interface FrameCardProps {
  card: MiniCardData;
  world?: MiniCardData | null;
  scene?: MiniCardData | null;
  shot?: MiniCardData | null;
  characters?: MiniCardData[];
  props?: MiniCardData[];
  prompt?: string;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export const FrameCard: React.FC<FrameCardProps> = ({
  card,
  world = null,
  scene = null,
  shot = null,
  characters = [],
  props = [],
  prompt,
  onClose,
  isCollapsed = true,
}) => {
  const [expanded, setExpanded] = useState(!isCollapsed);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg p-4 max-w-md w-full space-y-4">
      {onClose && (
        <button
          className="absolute top-2 right-3 text-zinc-500 hover:text-zinc-200 text-lg"
          onClick={onClose}
        >
          ✕
        </button>
      )}

      <div className="text-center">
        <img
          src={card.thumbnail || "/images/placeholder-frame.png"}
          alt={card.name}
          className="w-full h-48 object-cover rounded"
        />
        <h2 className="mt-2 text-lg font-semibold">{card.name}</h2>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-zinc-400">World:</span> {world ? world.name : "None"}
        </div>
        <div>
          <span className="text-zinc-400">Scene:</span> {scene ? scene.name : "None"}
        </div>
        <div>
          <span className="text-zinc-400">Shot:</span> {shot ? shot.name : "None"}
        </div>
        <div>
          <span className="text-zinc-400">Characters:</span>{" "}
          {characters.length ? characters.map((c) => c.name).join(", ") : "None"}
        </div>
        <div>
          <span className="text-zinc-400">Props:</span>{" "}
          {props.length ? props.map((p) => p.name).join(", ") : "None"}
        </div>
      </div>

      {/* Expandable Shot Stack */}
      <button
        onClick={toggleExpand}
        className="w-full text-left text-blue-500 hover:text-blue-400 mt-4"
      >
        {expanded ? "Collapse Stack ▲" : "Expand Stack ▼"}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <TimelineStack
            column={{
              id: card.id,
              world: world,
              scene: scene,
              shot: shot,
              characters: characters,
              props: props,
            }}
            onRemoveCard={() => console.log("Remove from stack!")}
            onDropCard={() => console.log("Card dropped!")}
          />
        </div>
      )}

      {prompt && (
        <div className="mt-4 text-sm">
          <div className="text-zinc-400 mb-1">Prompt:</div>
          <pre className="bg-zinc-800 text-zinc-100 p-2 rounded max-h-40 overflow-y-auto whitespace-pre-wrap text-xs">
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
};
