const express = require('express');
const mongoose = require('mongoose');
const gameRoutes = require('./routes/gameRoutes');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/game', gameRoutes);

mongoose.connect('mongodb://localhost:27017/blackjack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));