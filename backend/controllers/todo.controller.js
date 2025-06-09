
const { Todo } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Todo
 *   description: To-do task management
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new to-do
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todo created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
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

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
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

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a specific to-do by ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Not found
 */
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

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Not found
 */
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

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
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
