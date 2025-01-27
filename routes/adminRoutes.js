const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Страница админа
router.get('/admin', async (req, res) => {
  const users = await User.find();
  res.render('admin', { users });
});

// Добавление пользователя
router.post('/admin/add', async (req, res) => {
  const { username, password, admin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword, admin });
  res.redirect('/admin');
});

// Удаление пользователя
router.post('/admin/delete/:id', async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.redirect('/admin');
});

module.exports = router;
