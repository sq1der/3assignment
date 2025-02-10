const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Страница регистрации
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Регистрация' });
});

// Обработка регистрации
router.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send('Пароли не совпадают.');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('Пользователь с таким email уже существует.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).send('Ошибка при регистрации');
  }
});

// Страница входа
router.get('/login', (req, res) => {
  res.render('login', { title: 'Вход' });
});

// Обработка входа
router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.send('Неверные данные для входа.');
    }

    req.session.loggedIn = true;
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;
    res.redirect('/');
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).send('Ошибка при входе');
  }
});

// Выход пользователя
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Альтернативный маршрут для выхода через POST
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Ошибка выхода из системы');
    }
    res.redirect('/login');
  });
});

module.exports = router;