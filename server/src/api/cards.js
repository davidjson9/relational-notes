const { Router } = require('express');
const Card = require('../models/Card.js');
const router = Router();

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
    const response = await Card.find({ $and: req.body.queryTerms });
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