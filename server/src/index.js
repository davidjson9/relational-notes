var express = require('express');
var morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const cards = require('./api/cards.js');

// middlewares / error handling later
// log api later
const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));

app.use('/api/cards', cards);

const port = process.env.PORT || 1337;

// app.listen ( path and callback )
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});