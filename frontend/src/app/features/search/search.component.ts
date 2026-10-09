import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardService } from '../../core/services/card.service';
import { Card } from '../../core/models/card.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private readonly cardService = inject(CardService);
  private readonly router = inject(Router);
  private readonly searchInput$ = new Subject<string>();

  query = signal('');
  suggestions = signal<Card[]>([]);
  selectedCard = signal<Card | null>(null);
  loading = signal(false);
  showSuggestions = signal(false);

  readonly canCheckPrices = computed(() => this.selectedCard() !== null);

  constructor() {
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        if (q.length < 3) {
          this.suggestions.set([]);
          this.loading.set(false);
          return of([]);
        }
        this.loading.set(true);
        return this.cardService.searchCards(q);
      }),
      takeUntilDestroyed()
    ).subscribe({
      next: cards => {
        this.suggestions.set(cards);
        this.loading.set(false);
        this.showSuggestions.set(cards.length > 0);
      },
      error: () => this.loading.set(false)
    });
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.selectedCard.set(null);
    this.showSuggestions.set(false);
    this.searchInput$.next(value);
  }

  selectCard(card: Card): void {
    this.selectedCard.set(card);
    this.query.set(`${card.name} — ${card.set.name} #${card.number}`);
    this.showSuggestions.set(false);
    this.suggestions.set([]);
  }

  checkPrices(): void {
    const card = this.selectedCard();
    if (!card) return;
    this.router.navigate(['/prices'], {
      queryParams: {
        cardName: card.name,
        setName: card.set.name,
        cardNumber: card.number,
        cardId: card.id,
        cardImage: card.images.small
      }
    });
  }

  hideSuggestions(): void {
    setTimeout(() => this.showSuggestions.set(false), 150);
  }
}
