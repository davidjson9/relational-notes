const { Router } = require('express');
const Card = require('../models/Card.js');
const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const newCard = new Card(req.body);
    const createdCard = await newCard.save();
    res.json(createdCard);
  } catch (error) {
    console.log(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const entries = await Card.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

module.exports = router;