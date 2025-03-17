const express = require('express');
const { Todo } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    const todo = await Todo.create({
      title,
      description,
      status: status || 'todo',
      userId: req.user.id
    });
    
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let whereClause = { userId: req.user.id };
    
    if (status) {
      whereClause.status = status;
    }
    
    const todos = await Todo.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Завдання не знайдено' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Завдання не знайдено' });
    }
    
    await todo.update({
      title: title || todo.title,
      description: description !== undefined ? description : todo.description,
      status: status || todo.status
    });
    
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Завдання не знайдено' });
    }
    
    await todo.destroy();
    res.json({ message: 'Завдання видалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;