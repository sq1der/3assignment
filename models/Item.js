const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String, // Ссылка на изображение товара
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
