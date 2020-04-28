const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // contentBlocks: [{ tags: [], raw: String }],
  rawContent: { type: String, required: true },
  rawText: { type: String, required: true },
  tags: [],
  date: { type: Date, default: Date.now },
});
// cardSchema.index({ rawText: 'text' });

const Card = mongoose.model('Card', cardSchema);

router.post('/', async (req, res, next) => {
  try {
    console.log(req.body);
    if (req.body.id) {
      const response = await Card.update({ _id: req.body.id }, req.body);
      res.json(response);
    } else {
      const newCard = new Card(req.body);
      const response = await newCard.save();
      res.json(response);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/search', async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.body.queryTerms);
    const response = await Card.find({ $and: req.body.queryTerms }).sort({ date: -1 });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

router.post('/delete', async (req, res, next) => {
  try {
    console.log(req.body);
    const response = await Card.deleteOne({ _id: req.body.id });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const entries = await Card.find().sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

module.exports = router;