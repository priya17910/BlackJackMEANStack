const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
  };
  
  function dealCard() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = Object.keys(cardValues);
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return { rank, suit, value: cardValues[rank] };
  }
  
  function calculateHandValue(hand) {
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
  
  function isBlackjack(hand) {
    return hand.length === 2 && calculateHandValue(hand) === 21;
  }
  
  module.exports = { dealCard, calculateHandValue, isBlackjack };
  