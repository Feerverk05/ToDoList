const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const Op = Sequelize.Op;
global.Sequelize = Sequelize;

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('База даних підключена');
  app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
  });
}).catch(err => {
  console.error('Помилка підключення до бази даних:', err);
});