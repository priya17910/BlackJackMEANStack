const { dealCard, calculateHandValue, isBlackjack } = require('../utils/gameUtils');
const Game = require('../models/game');

exports.getAllGames = async (req, res) => {
    try {
      const games = await Game.find();
      res.json(games);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.createGame = async (req, res) => {
    const existingGame = await Game.findOne({ playerHand: [], status: 'ongoing' });
    if (existingGame) {
        return res.status(200).json(existingGame);
    }
    const game = new Game({
      playerHand: [],
      dealerHand: [],
      playerTotal: 0,
      dealerTotal: 0,
      winner: '',
      status: 'ongoing'
    });
  
    try {
      const newGame = await game.save();
      res.status(201).json(newGame);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.getGameById = async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (game == null) {
        return res.status(404).json({ message: 'Game not found' });
      }
      res.json(game);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.dealCards = async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      game.playerHand.push(dealCard());
      game.dealerHand.push(dealCard());
      game.playerHand.push(dealCard());
      game.dealerHand.push(dealCard());
  
      game.playerTotal = calculateHandValue(game.playerHand);
      game.dealerTotal = calculateHandValue(game.dealerHand);
  
      if (isBlackjack(game.playerHand) && !isBlackjack(game.dealerHand)) {
        game.status = 'player_wins';
        game.winner = 'Player';
      } else if (isBlackjack(game.dealerHand) && !isBlackjack(game.playerHand)) {
        game.status = 'dealer_wins';
        game.winner = 'Dealer';
      }
      else if (isBlackjack(game.dealerHand) && isBlackjack(game.playerHand))
      {
        game.status = 'tie';
        game.winner = 'Tie';
      }
  
      await game.save();
      res.json(game);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.updateGame = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const game = await Game.findById(id);
  
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
  
      if (game.status === 'ended') {
        return res.status(400).json({ message: 'Cannot update a game that has already ended' });
      }
  
      if (game.playerHand.length > 0 && 'playerHand' in updates) {
        return res.status(400).json({ message: 'Cannot change player hand after dealing' });
      }
      const updatedGame = await Game.findByIdAndUpdate(id, updates);
      res.json(updatedGame);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.hitAction = async (req, res) => {
    try {
      const { id } = req.params;
  
      const game = await Game.findById(id);
  
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
  
      if (game.status !== 'ongoing') {
        return res.status(400).json({ message: 'Game is not in progress' });
      }
  
      const newCard = dealCard();

      while (game.playerHand.includes(newCard) || game.dealerHand.includes(newCard)) {
        newCard = dealCard();
      }
      game.playerHand.push(newCard);
  
      game.playerTotal = calculateHandValue(game.playerHand);
  
      if (game.playerTotal > 21) {
        game.status = 'player_busted';
        game.winner = 'Dealer';
      }
      else if (game.playerTotal == 21)
      {
        game.status = 'player_wins';
        game.winner = 'Player'
      }
  
      await game.save();
  
      res.json(game);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
  
exports.standAction = async (req, res) => {
    try {
      const { id } = req.params;
      console.log ("Stand action", id);
      const game = await Game.findById(id);
  
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
  
      if (game.status !== 'ongoing') {
        return res.status(400).json({ message: 'Game is not in progress' });
      }
  
      game.status = 'player_stands';
      while (calculateHandValue(game.dealerHand) < 17) {
        let newCard = dealCard();

        while (game.playerHand.includes(newCard) || game.dealerHand.includes(newCard)) {
        }
        game.dealerHand.push(newCard);
      }
      game.dealerTotal = calculateHandValue(game.dealerHand);
  
      const playerTotal = calculateHandValue(game.playerHand);
      const dealerTotal = calculateHandValue(game.dealerHand);
  
      if (dealerTotal > 21 || playerTotal > dealerTotal) {
        game.status = 'player_wins';
        game.winner = 'Player';
      } else if (playerTotal < dealerTotal) {
        game.status = 'dealer_wins';
        game.winner = 'Dealer';
      } else {
        game.status = 'tie';
        game.winner = 'Tie';
      }
  
      await game.save();
  
      res.json(game);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
    

exports.endGame = async (req, res) => {
    try {
      const { id } = req.params;
  
      const game = await Game.findById(id);
  
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
      const playerTotal = calculateHandValue(game.playerHand);
      const dealerTotal = calculateHandValue(game.dealerHand);
  
      if (playerTotal <= 21 && playerTotal > dealerTotal) {
        game.winner = 'Player';
      } else if (dealerTotal <= 21 && playerTotal < dealerTotal) {
        game.winner = 'Dealer';
      } 
      else if (playerTotal > 21 && dealerTotal <= 21)
      {
        game.winner = 'Dealer'
      }
      else if (dealerTotal > 21 && playerTotal <= 21)
      {
        game.winner = 'Player'
      }
      
      else {
        game.winner = 'Tie';
      }
  
      game.status = 'ended';
  
      const updatedGame = await game.save();
  
      res.json(updatedGame);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.deleteGame = async (req, res) => {
    try {
      const { id } = req.params;
      await Game.findByIdAndDelete(id);
      res.json({ msg: 'Game deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
};
  