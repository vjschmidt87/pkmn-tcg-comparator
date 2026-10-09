import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SetService } from '../../../core/services/set.service';
import { Card } from '../../../core/models/card.model';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.scss'
})
export class CollectionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly setService = inject(SetService);

  setId = signal('');
  setName = signal('');
  cards = signal<Card[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('setId') ?? '';
    this.setId.set(id);

    this.setService.getCardsBySet(id).subscribe({
      next: cards => {
        this.cards.set(cards);
        if (cards.length > 0) {
          this.setName.set(cards[0].set.name);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  checkPrices(card: Card): void {
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

  goBack(): void {
    this.router.navigate(['/collections']);
  }
}
