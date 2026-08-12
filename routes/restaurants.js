const express = require('express');
const Restaurant = require('../models/Restaurant');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/restaurants — list all (with optional search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, cuisine } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    const restaurants = await Restaurant.find(query).sort({ rating: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/restaurants — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/restaurants/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/restaurants/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
