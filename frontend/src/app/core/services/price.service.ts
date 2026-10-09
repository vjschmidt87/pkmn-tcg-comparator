import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PriceLink, LivePrices } from '../models/price-link.model';

@Injectable({ providedIn: 'root' })
export class PriceService {
  private readonly http = inject(HttpClient);

  getPriceLinks(cardName: string, setName: string, cardNumber: string): Observable<PriceLink[]> {
    const params = new HttpParams()
      .set('cardName', cardName)
      .set('setName', setName)
      .set('cardNumber', cardNumber);
    return this.http.get<PriceLink[]>('/api/prices', { params });
  }

  getLivePrices(cardId: string): Observable<LivePrices> {
    return this.http.get<{ data: { tcgplayer?: LivePrices['tcgplayer']; cardmarket?: LivePrices['cardmarket'] } }>(
      `https://api.pokemontcg.io/v2/cards/${cardId}`
    ).pipe(
      map(res => ({
        tcgplayer: res.data.tcgplayer,
        cardmarket: res.data.cardmarket
      })),
      catchError(() => of({}))
    );
  }
}
