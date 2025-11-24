import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import todoController from '../controllers/todo.controller';

const router = Router();

router.get('/todos', authenticateToken, todoController.getAllTodos);
router.get('/todos/:id', authenticateToken, todoController.getTodo);
router.post('/todos', authenticateToken, todoController.createTodo);
router.put('/todos/:id', authenticateToken, todoController.updateTodo);
router.delete('/todos/:id', authenticateToken, todoController.deleteTodo);

export default router;
