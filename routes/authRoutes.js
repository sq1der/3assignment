const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Страница логина
router.get('/login', (req, res) => {
  res.render('login');
});

// Обработка логина
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.admin) {
      return res.redirect('/admin');
    }
    return res.redirect('/');
  }
  res.status(401).send('Неверный логин или пароль');
});

// Страница регистрации (опционально)
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword });
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', loggedIn: req.session.loggedIn || false });
});

module.exports = router;
