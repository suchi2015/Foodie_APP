const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 2.99 },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
    estimatedDelivery: { type: String, default: '30-45 min' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
