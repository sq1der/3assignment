const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

function isAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).send('Доступ запрещен.');
  }
}

router.get('/admin', isAdmin, async (req, res) => {
  const users = await User.find({});
  res.render('admin', { title: 'Панель администратора', users });
});


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

router.post('/admin/delete/:id', isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

router.post('/admin/edit/:id', isAdmin, async (req, res) => {
  const { username, isAdmin } = req.body;
  await User.findByIdAndUpdate(req.params.id, { 
    username, 
    isAdmin: !!isAdmin, 
    updatedAt: new Date() });
  res.redirect('/admin');
});

module.exports = router;
