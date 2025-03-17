const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: {
      [Sequelize.Op.or]: [{ email }, { username }]
    }});
    
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач вже існує' });
    }
    
    const user = await User.create({
      username,
      email,
      password
    });
    
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'todo_app_secret',
      { expiresIn: '7d' }
    );
    
    console.log('Створено новий обліковий запис. Токен користувача:', token);
    
    res.status(201).json({
      message: 'Користувач успішно зареєстрований',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Невірні облікові дані' });
    }
    
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірні облікові дані' });
    }
    
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'todo_app_secret',
      { expiresIn: '7d' }
    );
    
    console.log('Успішний вхід користувача. Токен:', token);
    
    res.json({
      message: 'Успішний вхід',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;