const express = require('express');
const router = express.Router();

// Cart is managed on the client side (localStorage/context)
// This route exists for future server-side cart persistence

router.get('/', (req, res) => {
  res.json({ message: 'Cart is managed client-side' });
});

module.exports = router;
