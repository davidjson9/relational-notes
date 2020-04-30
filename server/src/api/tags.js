const { Router } = require('express');
const router = Router();

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  label: String,
  value: String,
  color: String,
  count: Number,
});

const Tag = mongoose.model('Tag', tagSchema);

router.post('/delete', async (req, res, next) => {
  try {
    console.log(req.body);
    const response = await Tag.deleteOne({ label: req.body.tag });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
})

router.post('/update', async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const tag = await Tag.findOne({ label: req.body.tag });
    console.log(tag);
    tag.count += req.body.count;
    response = await tag.save();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
})

router.post('/save', async (req, res, next) => {
  try {
    const newTag = new Tag(req.body);
    const createdTag = await newTag.save();
    res.json(createdTag);
  } catch (error) {
    console.log(error);
  }
})

router.get('/', async (req, res, next) => {
  try {
    const entries = await Tag.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
})

module.exports = router;