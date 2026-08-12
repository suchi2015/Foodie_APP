const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    cuisine: { type: String, required: true },
    image: { type: String, default: '' },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    deliveryTime: { type: String, default: '30-45 min' },
    deliveryFee: { type: Number, default: 2.99 },
    minOrder: { type: Number, default: 10 },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
    },
    isOpen: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
