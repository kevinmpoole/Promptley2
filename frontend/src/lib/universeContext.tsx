import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type UniverseContextType = {
  universe: string
  setUniverse: (universe: string) => void
  availableUniverses: string[]
  loading: boolean
}

const UniverseContext = createContext<UniverseContextType | undefined>(undefined)

export const UniverseProvider = ({ children }: { children: ReactNode }) => {
  const [universe, setUniverse] = useState<string>("")
  const [availableUniverses, setAvailableUniverses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/universes")
        const data = await res.json()
        if (data.universes && data.universes.length > 0) {
          setAvailableUniverses(data.universes)
          setUniverse(data.universes[0]) // Default to first
        }
      } catch (err) {
        console.error("❌ Failed to load universes", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <UniverseContext.Provider value={{ universe, setUniverse, availableUniverses, loading }}>
      {children}
    </UniverseContext.Provider>
  )
}

export const useUniverse = () => {
  const context = useContext(UniverseContext)
  if (!context) throw new Error("useUniverse must be used within UniverseProvider")
  return context
}
