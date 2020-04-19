const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // contentBlocks: [{ tags: [], raw: String }],
  rawContent: String,
  tags: [],
  date: { type: Date, default: Date.now },
});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;