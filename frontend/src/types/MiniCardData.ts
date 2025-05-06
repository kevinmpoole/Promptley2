
import { CardType } from "./CardTypes"

export interface MiniCardData {
  id: string
  name: string
  cardType: CardType
  thumbnail?: string
}
