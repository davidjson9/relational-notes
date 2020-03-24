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

module.exports = router;