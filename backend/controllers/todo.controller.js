
const { Todo } = require('../models');

exports.createTodo = async (req, res) => {
  const todo = await Todo.create({ ...req.body, UserId: req.userId });
  return res.json(
    {
      status: true,
      message: 'Successfully created todo',
      data: todo
    }
  );
};

exports.getTodos = async (req, res) => {
  const todos = await Todo.findAll({ where: { UserId: req.userId } });
  return res.json(
    {
      status: true,
      message: 'Successfully get all todo',
      data: todos
    }
  );
};

exports.getTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOne({ where: { id, UserId: req.userId } });

  if (!todo) return res.status(404).json({ status: false, message: 'Not found' });

  return res.json(
    {
      status: true,
      message: 'Successfully get todo',
      data: todo
    }
  );
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOne({ where: { id, UserId: req.userId } });

  if (!todo) return res.status(404).json({ status: false, message: 'Not found' });

  await todo.update(req.body);

  return res.json(
    {
      status: true,
      message: 'Successfully update todo',
    }
  );
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOne({ where: { id, UserId: req.userId } });

  if (!todo) return res.status(404).json({ status: false, message: 'Not found' });

  await todo.destroy();

  return res.json(
    {
      status: true,
      message: 'Successfully delete todo',
    }
  );
};

exports.reorderTodo = async (req, res) => {
  const { todos } = req.body;

  const updates = todos.map(({ id, task_order }) => {
    return Todo.update(
      { task_order },
      { where: { id } }
    );
  });

  try {
    await Promise.all(updates);
    res.json({ message: 'Task order updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task order' });
  }
};