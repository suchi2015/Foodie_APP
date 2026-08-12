const express = require('express');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/upload  — admin only, single image
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Return a URL the frontend can use
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ imageUrl, filename: req.file.filename });
});

// DELETE /api/upload/:filename — admin only, remove a file
router.delete('/:filename', protect, adminOnly, (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ message: 'File deleted' });
  }
  res.status(404).json({ message: 'File not found' });
});

module.exports = router;
