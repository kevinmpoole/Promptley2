import React, { useEffect, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useUniverse } from "../lib/universeContext"
import { useShotlistStorage } from "../hooks/useShotlistStorage"
import { MiniCardData } from "../components/MiniCard"
import { FrameCard } from "../components/FrameCard"
import { TimelineChannel } from "../components/TimelineChannel"
import { CardType } from "../types/CardTypes"

type TimelineColumn = {
  id: string
  world: MiniCardData | null
  scene: MiniCardData | null
  shot: MiniCardData | null
  characters: MiniCardData[]
  props: MiniCardData[]
  frame: MiniCardData | null
}

type Shotlist = {
  id: string
  name: string
  collapsed: boolean
  columns: TimelineColumn[]
}

export default function TimeFrame() {
  const { universe } = useUniverse()
  const [shotlists, setShotlists] = useState<Shotlist[]>([])
  const [allCards, setAllCards] = useState<MiniCardData[]>([])
  const [selectedFrame, setSelectedFrame] = useState<{
    card: MiniCardData
    column: TimelineColumn
  } | null>(null)

  const { load } = useShotlistStorage("shotlists", shotlists, setShotlists)

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const loadCards = async () => {
      const types: CardType[] = ["world", "scene", "character", "prop", "shot", "frame"]
      const fetched: MiniCardData[] = []
      for (const type of types) {
        const res = await fetch(`http://localhost:8000/api/universe/${universe}/cards/${type}`)
        const data = await res.json()
        fetched.push(
          ...data.map((d: any) => ({
            id: d.name,
            name: d.name,
            cardType: d.cardType,
            thumbnail: d.thumbnail,
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
              columns: list.columns.map(col =>
                col.id === columnId ? { ...col, frame: card } : col
              ),
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
              columns: list.columns.map(col =>
                col.id === columnId && type === "frame" && col.frame?.id === cardId
                  ? { ...col, frame: null }
                  : col
              ),
            }
      )
    )
  }

  const handleOpenFrame = (col: TimelineColumn) => {
    if (col.frame) {
      setSelectedFrame({ card: col.frame, column: col })
    }
  }

  const buildChannelProps = (
    shotlist: Shotlist,
    type: CardType,
    getCards: (col: TimelineColumn) => MiniCardData[] | MiniCardData | null
  ) => ({
    cardType: type,
    columns: shotlist.columns.map(col => ({
      id: col.id,
      cards: (() => {
        const data = getCards(col)
        if (!data) return []
        return Array.isArray(data) ? data : [data]
      })(),
      onCardClick: () => {
        if (type === "frame") handleOpenFrame(col)
      },
    })),
    availableCards: allCards.filter(c => c.cardType === type),
    onDrop: (colId: string, card: MiniCardData) => handleDropCard(shotlist.id, colId, card),
    onRemove: (colId: string, cardId: string, type: CardType) =>
      handleRemoveCard(shotlist.id, colId, cardId, type),
  })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 bg-zinc-950 text-white min-h-screen overflow-x-auto">
        <h1 className="text-3xl font-bold mb-8">🎞️ TimeFrame Viewer</h1>

        <div className="flex gap-8">
          {shotlists.map(shotlist =>
            shotlist.collapsed ? null : (
              <div key={shotlist.id} className="flex-shrink-0">
                <h2 className="text-lg font-semibold text-white mb-2">{shotlist.name}</h2>
                <div className="space-y-4">
                  <TimelineChannel {...buildChannelProps(shotlist, "frame", col => col.frame)} />
                </div>
              </div>
            )
          )}
        </div>

        {selectedFrame && (
          <FrameCard
            card={selectedFrame.card}
            world={selectedFrame.column.world?.name}
            scene={selectedFrame.column.scene?.name}
            characters={selectedFrame.column.characters.map(c => c.name)}
            props={selectedFrame.column.props.map(p => p.name)}
            shot={selectedFrame.column.shot?.name}
            prompt={`World: ${selectedFrame.column.world?.name || "None"} | Scene: ${selectedFrame.column.scene?.name || "None"} | Characters: ${selectedFrame.column.characters.map(c => c.name).join(", ") || "None"} | Props: ${selectedFrame.column.props.map(p => p.name).join(", ") || "None"} | Shot: ${selectedFrame.column.shot?.name || "None"}`}
            onClose={() => setSelectedFrame(null)}
          />
        )}
      </div>
    </DndProvider>
  )
}
