// MiniCardData.ts
import { CardType } from "./CardTypes";

export interface MiniCardData {
  id: string;
  name: string;
  cardType: CardType;
  thumbnail?: string;
  attributes?: {
    world?: string;
    scene?: string;
    shot?: string;
    characters?: string[];
    props?: string[];
  };
}
