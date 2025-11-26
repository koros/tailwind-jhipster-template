import { Request, Response, NextFunction } from 'express';
import todoService from '../services/todo.service';

export class TodoController {
  async getAllTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 0;
      const size = parseInt(req.query.size as string) || 20;
      const sort = (req.query.sort as string) || 'id,asc';

      const result = await todoService.getAllTodos(page, size, sort);

      res.set('X-Total-Count', result.total.toString());
      res.json(result.todos);
    } catch (error) {
      next(error);
    }
  }

  async getTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const todo = await todoService.getTodoById(id);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await todoService.createTodo(req.body);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  }

  async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const todo = await todoService.updateTodo(id, req.body);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await todoService.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new TodoController();
