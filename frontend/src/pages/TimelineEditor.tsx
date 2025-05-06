// src/pages/TimelineEditor.tsx
import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TimelineChannel } from "../components/TimelineChannel"
import { CardType } from "../types/CardTypes"
import { useUniverse } from "../lib/universeContext"
import { v4 as uuidv4 } from "uuid"
import { ShotlistHeader } from "../components/ShotlistHeader"
import { useShotlistStorage } from "../hooks/useShotlistStorage"
import { resolveThumbnailUrl } from "../components/CardViewer"

export interface MiniCardData {
  id: string
  name: string
  cardType: CardType
  thumbnail?: string
}

type TimelineColumn = {
  id: string
  world: MiniCardData | null
  scene: MiniCardData | null
  shot: MiniCardData | null
  characters: MiniCardData[]
  props: MiniCardData[]
}

type Shotlist = {
  id: string
  name: string
  collapsed: boolean
  columns: TimelineColumn[]
}

export default function TimelineEditor() {
  const { universe } = useUniverse()
  const [shotlists, setShotlists] = useState<Shotlist[]>([])
  const [allCards, setAllCards] = useState<MiniCardData[]>([])

  const { save, load } = useShotlistStorage<Shotlist[]>("shotlists", shotlists, setShotlists)

  useEffect(() => {
    const loadCards = async () => {
      const types: CardType[] = ["world", "scene", "character", "prop", "shot"]
      const fetched: MiniCardData[] = []
      for (const type of types) {
        const res = await fetch(`/api/universe/${universe}/cards/${type}`)
        const data = await res.json()
        fetched.push(
          ...data.map((d: any) => ({
            id: d.name,
            name: d.name,
            cardType: d.cardType,
            thumbnail: resolveThumbnailUrl(d.thumbnail, universe),
          }))
        )
      }
      setAllCards(fetched)
    }

    loadCards()
  }, [universe])

  const handleDropCard = (shotlistId: string, columnId: string, card: MiniCardData) => {
    setShotlists(prev =>
      prev.map(list =>
        list.id !== shotlistId
          ? list
          : {
              ...list,
              columns: list.columns.map(col => {
                if (col.id !== columnId) return col
                switch (card.cardType) {
                  case "world": return { ...col, world: card }
                  case "scene": return { ...col, scene: card }
                  case "shot": return { ...col, shot: card }
                  case "character":
                    return col.characters.some(c => c.id === card.id)
                      ? col
                      : { ...col, characters: [...col.characters, card] }
                  case "prop":
                    return col.props.some(p => p.id === card.id)
                      ? col
                      : { ...col, props: [...col.props, card] }
                  default: return col
                }
              })
            }
      )
    )
  }

  const handleRemoveCard = (shotlistId: string, columnId: string, cardId: string, type: CardType) => {
    setShotlists(prev =>
      prev.map(list =>
        list.id !== shotlistId
          ? list
          : {
              ...list,
              columns: list.columns.map(col => {
                if (col.id !== columnId) return col
                switch (type) {
                  case "world": return { ...col, world: null }
                  case "scene": return { ...col, scene: null }
                  case "shot": return { ...col, shot: null }
                  case "character": return { ...col, characters: col.characters.filter(c => c.id !== cardId) }
                  case "prop": return { ...col, props: col.props.filter(p => p.id !== cardId) }
                  default: return col
                }
              })
            }
      )
    )
  }

  const toggleCollapse = (id: string) => {
    setShotlists(prev =>
      prev.map(list =>
        list.id === id ? { ...list, collapsed: !list.collapsed } : list
      )
    )
  }

  const handleRenameShotlist = (id: string, newName: string) => {
    setShotlists(prev =>
      prev.map(list =>
        list.id === id ? { ...list, name: newName } : list
      )
    )
  }

  const removeShotlist = (id: string) => {
    setShotlists(prev => prev.filter(list => list.id !== id))
  }

  const addShotlist = () => {
    const newShotlist: Shotlist = {
      id: uuidv4(),
      name: `Shotlist ${shotlists.length + 1}`,
      collapsed: false,
      columns: Array.from({ length: 6 }, () => ({
        id: uuidv4(),
        world: null,
        scene: null,
        shot: null,
        characters: [],
        props: [],
      }))
    }
    setShotlists(prev => [...prev, newShotlist])
  }

  const buildChannelProps = (
    shotlist: Shotlist,
    type: CardType,
    getCards: (col: TimelineColumn) => MiniCardData[] | MiniCardData | null
  ) => ({
    cardType: type,
    columns: shotlist.columns.map((col) => ({
      id: col.id,
      cards: (() => {
        const data = getCards(col)
        if (!data) return []
        return Array.isArray(data) ? data : [data]
      })(),
    })),
    availableCards: allCards.filter((c) => c.cardType === type),
    onDrop: (colId: string, card: MiniCardData) => handleDropCard(shotlist.id, colId, card),
    onRemove: (colId: string, cardId: string, type: CardType) => handleRemoveCard(shotlist.id, colId, cardId, type),
  })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 bg-zinc-950 text-white min-h-screen overflow-x-auto">
        <h1 className="text-3xl font-bold mb-6">🧷 Timeline Editor</h1>

        <div className="flex gap-8">
          {shotlists.map((shotlist) =>
            shotlist.collapsed ? null : (
              <div key={shotlist.id} className="flex-shrink-0">
                <ShotlistHeader
                  name={shotlist.name}
                  onRename={(newName) => handleRenameShotlist(shotlist.id, newName)}
                  onToggle={() => toggleCollapse(shotlist.id)}
                  isCollapsed={false}
                  onRemove={() => removeShotlist(shotlist.id)}
                />
                <div className="space-y-4">
                  <TimelineChannel {...buildChannelProps(shotlist, "world", (c) => c.world)} />
                  <TimelineChannel {...buildChannelProps(shotlist, "scene", (c) => c.scene)} />
                  <TimelineChannel {...buildChannelProps(shotlist, "character", (c) => c.characters)} />
                  <TimelineChannel {...buildChannelProps(shotlist, "prop", (c) => c.props)} />
                  <TimelineChannel {...buildChannelProps(shotlist, "shot", (c) => c.shot)} />
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-10 border-t border-zinc-700 pt-4 space-x-3">
          {shotlists.map((s) => (
            <div
              key={s.id}
              className="inline-flex items-center gap-2 w-auto h-12 px-4 py-2 rounded bg-zinc-800 border border-zinc-600 text-white text-sm"
            >
              <span>{s.name}</span>
              <button
                onClick={() => toggleCollapse(s.id)}
                className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded"
              >
                {s.collapsed ? "Expand" : "Collapse"}
              </button>
            </div>
          ))}
          <button
            onClick={addShotlist}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
          >
            ➕ Add Shotlist
          </button>
          <button
  onClick={save}
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 text-sm"
>
  💾 Save Shotlists
</button>
<button
  onClick={load}
  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 text-sm"
>
  🔄 Load Shotlists
</button>

        </div>
      </div>
    </DndProvider>
  )
}
