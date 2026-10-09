import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly http = inject(HttpClient);

  searchCards(query: string): Observable<Card[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Card[]>('/api/cards/search', { params });
  }
}
