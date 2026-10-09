import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SetService } from '../../core/services/set.service';
import { PokemonSet } from '../../core/models/set.model';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent implements OnInit {
  private readonly setService = inject(SetService);
  private readonly router = inject(Router);

  sets = signal<PokemonSet[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.setService.getAllSets().subscribe({
      next: sets => {
        this.sets.set(sets);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openSet(setId: string): void {
    this.router.navigate(['/collections', setId]);
  }
}
