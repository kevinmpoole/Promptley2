// src/components/ShotlistHeader.tsx
import React, { useState } from "react";

interface ShotlistHeaderProps {
    name: string;
    onRename: (newName: string) => void;
    onToggle: () => void;
    isCollapsed: boolean;
    onRemove: () => void; // ← Add this line
  }
  
  export const ShotlistHeader: React.FC<ShotlistHeaderProps> = ({
    name,
    onRename,
    onToggle,
    isCollapsed,
    onRemove, // ← add this
  }) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onRename(tempName.trim() || name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onRename(tempName.trim() || name);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-700 mb-4">
  {isEditing ? (
    <input
      className="bg-transparent text-white font-semibold text-lg border-b border-zinc-500 focus:outline-none"
      value={tempName}
      autoFocus
      onBlur={handleBlur}
      onChange={(e) => setTempName(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  ) : (
    <h2
      className="text-lg font-semibold text-white cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      {name}
    </h2>
  )}

  <div className="flex gap-2">
    <button
      onClick={onToggle}
      className="px-3 py-1 text-sm rounded border border-zinc-600 text-white hover:bg-zinc-800"
    >
      {isCollapsed ? "Expand" : "Collapse"}
    </button>
    <button
      onClick={onRemove}
      className="px-3 py-1 text-sm rounded border border-red-600 text-white hover:bg-red-800"
    >
      Remove
    </button>
  </div>
</div>

  );
};
