const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');

router.get('/', gameController.getAllGames);

router.post('/create', gameController.createGame);

router.get('/:id', gameController.getGameById);

router.post('/deal/:id', gameController.dealCards);

router.put('/update/:id', gameController.updateGame);

router.put('/end/:id', gameController.endGame);

router.post('/hit/:id', gameController.hitAction);

router.post('/stand/:id', gameController.standAction);

router.delete('/delete/:id', gameController.deleteGame);

module.exports = router;