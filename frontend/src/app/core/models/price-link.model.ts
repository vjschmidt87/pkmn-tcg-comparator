export interface PriceLink {
  marketplace: string;
  url: string;
  region: string;
  category: 'marketplace' | 'tracker';
}

export interface TcgCardPrices {
  low?: number;
  mid?: number;
  high?: number;
  market?: number;
  directLow?: number;
}

export interface TcgPrices {
  normal?: TcgCardPrices;
  holofoil?: TcgCardPrices;
  reverseHolofoil?: TcgCardPrices;
  '1stEditionHolofoil'?: TcgCardPrices;
  '1stEditionNormal'?: TcgCardPrices;
}

export interface CardMarketPrices {
  averageSellPrice?: number;
  lowPrice?: number;
  trendPrice?: number;
  avg1?: number;
  avg7?: number;
  avg30?: number;
}

export interface LigaPokemonPrices {
  minPrice?: number;
  avgPrice?: number;
  maxPrice?: number;
}

export interface LivePrices {
  tcgplayer?: {
    url?: string;
    prices?: TcgPrices;
  };
  cardmarket?: {
    url?: string;
    prices?: CardMarketPrices;
  };
  ligapokemon?: {
    url?: string;
    prices?: LigaPokemonPrices;
  };
}
