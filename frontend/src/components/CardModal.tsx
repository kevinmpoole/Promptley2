// src/components/CardModal.tsx
import React from "react"
import { Dialog } from "@headlessui/react"
import { CardType } from "../types/CardTypes"

// Full card data including additional metadata
export interface CardModalData {
  id: string
  name: string
  cardType: CardType
  universe?: string
  thumbnail?: string
  attributes?: Record<string, any>
}

interface CardModalProps {
  card: CardModalData | null
  onClose: () => void
}

/**
 * Strip any path segments and return just the filename or root-relative/URL
 */
const getFilename = (path?: string): string | undefined => {
  if (!path) return undefined
  if (/^(?:https?:)?\/\//.test(path) || path.startsWith("/")) {
    return path
  }
  return path.split("/").pop()
}

/**
 * Resolve a thumbnail path (filename or URL) into a consistent URL
 */
const resolveThumbnailUrl = (
  raw?: string,
  universe?: string
): string | undefined => {
  if (!raw) return undefined
  // pass through absolute URLs or root-relative
  if (/^(?:https?:)?\/\//.test(raw) || raw.startsWith("/")) {
    return raw
  }
  const file = getFilename(raw)
  return universe && file
    ? `/universes/${universe}/thumbnails/${file}`
    : file
}

export const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  if (!card) return null
  const { name, cardType, universe, thumbnail, attributes } = card
  const thumbUrl = resolveThumbnailUrl(thumbnail, universe)

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <div className="z-50 bg-zinc-900 p-6 rounded-lg border border-white shadow-xl w-[420px] max-w-[90%] relative">
        <Dialog.Title className="text-lg font-bold text-white mb-4">
          {name} <span className="text-sm text-zinc-400">({cardType})</span>
        </Dialog.Title>

        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={name}
            className="w-full h-48 object-cover rounded mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-zinc-800 flex items-center justify-center rounded mb-4 text-zinc-500">
            No image available
          </div>
        )}
        {attributes?.prompt && (
          <div className="bg-zinc-800 p-3 rounded mb-4 text-zinc-300">
            <strong>Prompt Description:</strong>
            <p className="mt-2 text-sm text-zinc-400 whitespace-pre-line">
              {attributes.prompt}
            </p>
          </div>
        )}

        <div className="text-sm text-zinc-300 space-y-1">
          {universe && (
            <div>
              <strong>Universe:</strong> <span className="text-zinc-200">{universe}</span>
            </div>
          )}
          {attributes?.world && (
            <div>
              <strong>World:</strong>{" "}
              <a href={`#/world/${attributes.world}`} className="text-blue-400 underline">
                {attributes.world}
              </a>
            </div>
          )}
          {attributes?.scene && (
            <div>
              <strong>Scene:</strong>{" "}
              <a href={`#/scene/${attributes.scene}`} className="text-blue-400 underline">
                {attributes.scene}
              </a>
            </div>
          )}
          {attributes?.character && (
            <div>
              <strong>Character(s):</strong>{" "}
              {(Array.isArray(attributes.character)
                ? attributes.character
                : [attributes.character]
              ).map((c: string) => (
                <a
                  key={c}
                  href={`#/character/${c}`}
                  className="text-blue-400 underline mr-1"
                >
                  {c}
                </a>
              ))}
            </div>
          )}
          {attributes?.prop && (
            <div>
              <strong>Prop(s):</strong>{" "}
              <a href={`#/prop/${attributes.prop}`} className="text-blue-400 underline">
                {attributes.prop}
              </a>
            </div>
          )}
          {attributes?.shot && (
            <div>
              <strong>Shot:</strong>{" "}
              <a href={`#/shot/${attributes.shot}`} className="text-blue-400 underline">
                {attributes.shot}
              </a>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
        >
          Close
        </button>
      </div>
    </Dialog>
  )
}
