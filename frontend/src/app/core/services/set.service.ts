import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonSet } from '../models/set.model';
import { Card } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class SetService {
  private readonly http = inject(HttpClient);

  getAllSets(): Observable<PokemonSet[]> {
    return this.http.get<PokemonSet[]>('/api/sets');
  }

  getCardsBySet(setId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`/api/sets/${setId}/cards`);
  }
}
