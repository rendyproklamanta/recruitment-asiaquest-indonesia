/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management APIs
 */

const express = require('express');
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getTodo,
  reorderTodo
} = require('../controllers/todo.controller');

const { isAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(isAuth);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Todo object to create
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
 *                 example: Buy milk
 *               description:
 *                 type: string
 *                 example: Remember to get whole milk
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       401:
 *         description: Unauthorized (missing or invalid JWT)
 */
router.post('/', createTodo);

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos
 *     tags: [Todos]
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Buy milk
 *                   description:
 *                     type: string
 *                     example: Remember to get whole milk
 *                   completed:
 *                     type: boolean
 *                     example: false
 *       401:
 *         description: Unauthorized
 */
router.get('/', getTodos);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Todo ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Todo object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Buy milk
 *                 description:
 *                   type: string
 *                   example: Remember to get whole milk
 *                 completed:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 */
router.get('/:id', getTodo);

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Todo ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: Todo object to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy bread
 *               description:
 *                 type: string
 *                 example: Get whole wheat bread
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 */
router.put('/:id', updateTodo);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Todo ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 */
router.delete('/:id', deleteTodo);

/**
 * @swagger
 * /reorder:
 *   post:
 *     summary: Reorder a todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Todo ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Reorder successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 */
router.put('/task/reorder', reorderTodo);

module.exports = router;
