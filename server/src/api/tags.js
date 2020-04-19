const { Router } = require('express');
const router = Router();

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  label: String,
  value: String,
  color: String,
});

const Tag = mongoose.model('Tag', tagSchema);

router.post('/', async (req, res, next) => {
  try {
    const newTag = new Tag(req.body);
    const createdTag = await newTag.save();
    res.json(createdTag);
  } catch (error) {
    console.log(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const entries = await Tag.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

module.exports = router;