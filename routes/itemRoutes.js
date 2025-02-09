const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Получить все айтемы
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


// Добавить новый айтем
router.post('/', async (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Название и цена обязательны' });
  }

  try {
    const newItem = new Item({ name, description, price, imageUrl });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при добавлении' });
  }
});

// Обновить айтем
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Айтем не найден' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении' });
  }
});

// Удалить айтем
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Айтем не найден' });
    res.json({ message: 'Айтем удален' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении' });
  }
});

module.exports = router;
