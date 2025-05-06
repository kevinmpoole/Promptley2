// CardCreator.tsx
import { CardType } from "../types/CardTypes"
import SchemaEditor from "components/SchemaEditor"

export default function CardCreator() {
  // Default cardType here; you can adapt this to dynamically pass based on user selection
  const defaultCardType: CardType = "character"

  return (
    <div className="p-6">
      <SchemaEditor cardType={defaultCardType} />
    </div>
  )
}
