import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PriceService } from '../../core/services/price.service';
import { PriceLink, LivePrices, TcgCardPrices, LigaPokemonPrices } from '../../core/models/price-link.model';

interface PriceVariant {
  label: string;
  market?: number;
  low?: number;
  mid?: number;
  high?: number;
}

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss'
})
export class PricesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly priceService = inject(PriceService);

  cardName = signal('');
  setName = signal('');
  cardNumber = signal('');
  cardImage = signal('');
  cardId = signal('');

  priceLinks = signal<PriceLink[]>([]);
  livePrices = signal<LivePrices>({});
  loadingLinks = signal(false);
  loadingLive = signal(false);

  readonly regionLabels: Partial<Record<string, string>> = {
    US: '🇺🇸 US',
    EU: '🇪🇺 EU',
    BR: '🇧🇷 BR',
    Global: '🌍 Global'
  };

  marketplaceLinks = computed(() =>
    this.priceLinks().filter(l => l.category === 'marketplace')
  );

  trackerLinks = computed(() =>
    this.priceLinks().filter(l => l.category === 'tracker')
  );

  tcgVariants = computed<PriceVariant[]>(() => {
    const tcg = this.livePrices().tcgplayer?.prices;
    if (!tcg) return [];
    const variantMap: Record<string, string> = {
      normal: 'Normal',
      holofoil: 'Holofoil',
      reverseHolofoil: 'Reverse Holo',
      '1stEditionHolofoil': '1st Ed. Holo',
      '1stEditionNormal': '1st Ed. Normal'
    };
    return Object.entries(variantMap)
      .filter(([key]) => (tcg as Record<string, TcgCardPrices | undefined>)[key])
      .map(([key, label]) => {
        const p = (tcg as Record<string, TcgCardPrices>)[key];
        return { label, market: p.market, low: p.low, mid: p.mid, high: p.high };
      });
  });

  cmPrices = computed(() => this.livePrices().cardmarket?.prices);
  tcgUrl = computed(() => this.livePrices().tcgplayer?.url);
  cmUrl = computed(() => this.livePrices().cardmarket?.url);
  ligaPrices = computed<LigaPokemonPrices | undefined>(() => this.livePrices().ligapokemon?.prices);
  ligaUrl = computed(() => this.livePrices().ligapokemon?.url);

  hasLivePrices = computed(() =>
    this.tcgVariants().length > 0 || !!this.cmPrices() || !!this.ligaPrices()
  );

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const name = params.get('cardName') ?? '';
    const set = params.get('setName') ?? '';
    const number = params.get('cardNumber') ?? '';
    const image = params.get('cardImage') ?? '';
    const id = params.get('cardId') ?? '';

    if (!name) {
      this.router.navigate(['/search']);
      return;
    }

    this.cardName.set(name);
    this.setName.set(set);
    this.cardNumber.set(number);
    this.cardImage.set(image);
    this.cardId.set(id);

    this.loadLinks(name, set, number);
    if (id === 'mock-placeholder-1') {
      this.livePrices.set(this.mockPrices());
    } else if (id) {
      this.loadLivePrices(id);
    }
  }

  private loadLinks(name: string, set: string, number: string): void {
    this.loadingLinks.set(true);
    this.priceService.getPriceLinks(name, set, number).subscribe({
      next: links => {
        this.priceLinks.set(links);
        this.loadingLinks.set(false);
      },
      error: () => this.loadingLinks.set(false)
    });
  }

  private loadLivePrices(id: string): void {
    this.loadingLive.set(true);
    this.priceService.getLivePrices(id).subscribe({
      next: prices => {
        this.livePrices.set(prices);
        this.loadingLive.set(false);
      },
      error: () => this.loadingLive.set(false)
    });
  }

  // Hidden placeholder — search for "mocked placeholder" to preview the live prices layout
  private mockPrices(): LivePrices {
    return {
      tcgplayer: {
        url: 'https://www.tcgplayer.com',
        prices: {
          holofoil: { low: 12.50, mid: 18.99, high: 45.00, market: 17.25 },
          reverseHolofoil: { low: 4.00, mid: 6.50, high: 15.00, market: 5.75 }
        }
      },
      cardmarket: {
        url: 'https://www.cardmarket.com',
        prices: {
          trendPrice: 14.80,
          lowPrice: 9.99,
          avg30: 13.45
        }
      },
      ligapokemon: {
        url: 'https://www.ligapokemon.com.br',
        prices: {
          minPrice: 54.90,
          avgPrice: 78.00,
          maxPrice: 129.90
        }
      }
    };
  }

  formatBrl(value?: number): string {
    if (value == null) return '—';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  formatPrice(value?: number): string {
    if (value == null) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  formatEur(value?: number): string {
    if (value == null) return '—';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }
}
