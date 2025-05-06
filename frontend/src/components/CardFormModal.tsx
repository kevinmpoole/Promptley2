import React, { useState } from "react"
import ReactDOM from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { CardType } from "../types/CardTypes"
import { useUniverse } from "../lib/universeContext"

interface CardFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (card: { name: string; cardType: CardType; thumbnail?: string }) => void
  cardType: CardType
}

export const CardFormModal: React.FC<CardFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  cardType
}) => {
  const { universe } = useUniverse()
  const [name, setName] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setThumbnailFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setThumbnailPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setThumbnailPreview(null)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) return

    let thumbnailPath: string | undefined = undefined

    if (thumbnailFile && universe) {
      const formData = new FormData()
      formData.append("file", thumbnailFile)

      const res = await fetch(`http://localhost:8000/api/universe/${universe}/upload-thumbnail/`, {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const result = await res.json()
        thumbnailPath = result.filename
      } else {
        console.error("❌ Thumbnail upload failed")
      }
    }

    onSubmit({ name, cardType, thumbnail: thumbnailPath })
    setName("")
    setThumbnailFile(null)
    setThumbnailPreview(null)
    onClose()
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed z-[100] top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-heading mb-4">➕ New {cardType} Card</h2>

            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full p-2 border rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Buckley Blackwell"
            />

            <label className="block text-sm font-medium mb-1">Upload Thumbnail (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />

            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="Thumbnail Preview" className="mb-4 rounded w-full" />
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  const modalRoot = document.getElementById("modal-root")
  return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null
}
