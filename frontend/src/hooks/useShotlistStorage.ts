import { useEffect } from "react"

export function useShotlistStorage<T>(
  key: string,
  value: T,
  setValue: (v: T) => void
) {
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        setValue(JSON.parse(saved))
      } catch {
        console.warn("Failed to parse saved shotlists.")
      }
    }
  }, [key, setValue])

  // Autosave on value change
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.warn("Failed to save shotlists.")
    }
  }, [key, value])

  const save = () => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const load = () => {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        setValue(JSON.parse(saved))
      } catch {
        console.warn("Failed to parse on load.")
      }
    }
  }

  const clear = () => {
    localStorage.removeItem(key)
  }

  return { save, load, clear }
}
