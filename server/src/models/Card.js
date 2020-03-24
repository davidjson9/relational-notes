const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: String,
  author: String,
  body: String,
  tagged: [{ tag: String }],
  taggedNotes: [{ tag: String, body: String }],
  date: { type: Date, default: Date.now },
});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;