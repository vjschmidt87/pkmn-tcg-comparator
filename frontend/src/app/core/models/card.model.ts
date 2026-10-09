export interface CardImages {
  small: string;
  large: string;
}

export interface SetSummary {
  id: string;
  name: string;
  series: string;
  printedTotal: string;
  releaseDate: string;
  images: { symbol: string; logo: string };
}

export interface Card {
  id: string;
  name: string;
  number: string;
  rarity: string;
  images: CardImages;
  set: SetSummary;
}
