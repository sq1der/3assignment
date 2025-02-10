const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Item = require('../models/Item');

const router = express.Router();

// Middleware для проверки прав администратора
function isAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).send('Доступ запрещен.');
  }
}

// Панель администратора
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    const items = await Item.find();
    res.render('admin', { title: 'Панель администратора', users, items });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка загрузки данных.');
  }
});

// Добавление пользователя
router.post('/admin/add', isAdmin, async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, isAdmin: !!isAdmin });
    await newUser.save();
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при добавлении пользователя');
  }
});

// Удаление пользователя
router.post('/admin/delete/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при удалении пользователя');
  }
});

// Редактирование пользователя
router.post('/admin/edit/:id', isAdmin, async (req, res) => {
  const { username, isAdmin } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, {
      username,
      isAdmin: !!isAdmin,
      updatedAt: new Date(),
    });
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при редактировании пользователя');
  }
});

// Добавление айтема
router.post('/admin/items/add', isAdmin, async (req, res) => {
  const { name_en, name_other, description_en, description_other, image1, image2, image3 } = req.body;

  if (!name_en || !name_other || !description_en || !description_other || !image1 || !image2 || !image3) {
    return res.redirect('/admin?error=All fields are required');
  }

  try {
    const newItem = new Item({
      images: [image1, image2, image3],
      name_en,
      name_other,
      description_en,
      description_other,
      createdAt: new Date(),
    });

    await newItem.save();
    res.redirect('/admin?success=Item added successfully');
  } catch (error) {
    console.error('❌ Item Add Error:', error);
    res.redirect('/admin?error=Error adding item');
  }
});

// Удаление айтема
router.post('/admin/items/delete/:id', isAdmin, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при удалении товара');
  }
});

// Редактирование айтема
router.post('/admin/items/edit/:id', isAdmin, async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при редактировании товара');
  }
});

module.exports = router;
