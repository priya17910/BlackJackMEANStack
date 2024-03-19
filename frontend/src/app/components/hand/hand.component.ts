import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Card } from '../../models/card';

@Component({
  selector: 'app-hand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hand.component.html',
  styleUrl: './hand.component.css'
})
export class HandComponent {
  @Input() playerHand?: Card[] = [];
  @Input() isPlayer: boolean = true;
  @Input() dealerHand?: Card[] = [];

  constructor() { }

  calculateScore(hand: Card[]): number {
    let total = 0;
    let numAces = 0;
  
    for (const card of hand) {
        total += card.value;
      if (card.rank === 'A') numAces++;
    }
  
    while (total > 21 && numAces > 0) {
      total -= 10;
      numAces--;
    } 
  
    return total;
  }
}
