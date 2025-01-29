const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/update', (req, res) => {
  const { username, email } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).send('Вы не авторизованы');
  }

  User.findByIdAndUpdate(userId, { username, email }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send('Пользователь не найден');
      }
      res.redirect('/profile');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Ошибка при обновлении профиля');
    });
});


module.exports = router;
