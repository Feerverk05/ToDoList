const sequelize = require('../config/db');
const User = require('./User');
const Todo = require('./Todo');

User.hasMany(Todo, { as: 'todos', foreignKey: 'userId' });
Todo.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Todo
};