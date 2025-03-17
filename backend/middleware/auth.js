const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Авторизація не пройдена' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'todo_app_secret');
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Авторизація не пройдена' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Помилка авторизації' });
  }
};

module.exports = auth;