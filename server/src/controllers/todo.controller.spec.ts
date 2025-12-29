import { Request, Response, NextFunction } from 'express';
import { TodoController } from './todo.controller';
import todoService from '../services/todo.service';

jest.mock('../services/todo.service', () => ({
  getAllTodos: jest.fn(),
  getTodoById: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}));

const mockTodoService = todoService as jest.Mocked<typeof todoService>;

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.set = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

const createNext = () => jest.fn() as unknown as NextFunction;

describe('TodoController', () => {
  const controller = new TodoController();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTodos', () => {
    it('parses pagination params and sets headers', async () => {
      const req = {
        query: { page: '2', size: '5', sort: 'title,desc' },
      } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      mockTodoService.getAllTodos.mockResolvedValueOnce({
        total: 42,
        todos: [
          {
            id: 1,
            title: 'Task',
            description: 'desc',
            status: 'OPEN',
            priority: 'HIGH',
            dueDate: null,
            completed: false,
            createdDate: new Date(),
            lastModifiedDate: new Date(),
          },
        ],
      } as any);

      await controller.getAllTodos(req, res, next);

      expect(mockTodoService.getAllTodos).toHaveBeenCalledWith(2, 5, 'title,desc');
      expect(res.set).toHaveBeenCalledWith('X-Total-Count', '42');
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 1 })]));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getTodo', () => {
    it('fetches todo by numeric id', async () => {
      const req = { params: { id: '10' } } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      const todo = {
        id: 10,
        title: 'Test',
        description: 'desc',
        status: 'OPEN',
        priority: 'LOW',
        dueDate: null,
        completed: false,
        createdDate: new Date(),
        lastModifiedDate: new Date(),
      } as any;
      mockTodoService.getTodoById.mockResolvedValueOnce(todo);

      await controller.getTodo(req, res, next);

      expect(mockTodoService.getTodoById).toHaveBeenCalledWith(10);
      expect(res.json).toHaveBeenCalledWith(todo);
    });
  });

  describe('createTodo', () => {
    it('delegates creation to service and returns 201', async () => {
      const req = { body: { title: 'New' } } as Request;
      const res = createMockResponse();
      const next = createNext();
      const created = {
        id: 5,
        title: 'New',
        description: '',
        status: 'OPEN',
        priority: 'LOW',
        dueDate: null,
        completed: false,
        createdDate: new Date(),
        lastModifiedDate: new Date(),
      } as any;
      mockTodoService.createTodo.mockResolvedValueOnce(created);

      await controller.createTodo(req, res, next);

      expect(mockTodoService.createTodo).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe('updateTodo', () => {
    it('passes numeric id and body to service', async () => {
      const req = { params: { id: '7' }, body: { title: 'Updated' } } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      const updated = {
        id: 7,
        title: 'Updated',
        description: '',
        status: 'OPEN',
        priority: 'LOW',
        dueDate: null,
        completed: false,
        createdDate: new Date(),
        lastModifiedDate: new Date(),
      } as any;
      mockTodoService.updateTodo.mockResolvedValueOnce(updated);

      await controller.updateTodo(req, res, next);

      expect(mockTodoService.updateTodo).toHaveBeenCalledWith(7, req.body);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  describe('deleteTodo', () => {
    it('deletes todo and returns 204', async () => {
      const req = { params: { id: '9' } } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();

      await controller.deleteTodo(req, res, next);

      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(9);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('forwards getAllTodos errors to next middleware', async () => {
      const req = { query: {} } as Request;
      const res = createMockResponse();
      const next = createNext();
      const error = new Error('boom');
      mockTodoService.getAllTodos.mockRejectedValueOnce(error);

      await controller.getAllTodos(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('forwards getTodo errors to next middleware', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      const error = new Error('not found');
      mockTodoService.getTodoById.mockRejectedValueOnce(error);

      await controller.getTodo(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('forwards createTodo errors to next middleware', async () => {
      const req = { body: { title: 'Bad' } } as Request;
      const res = createMockResponse();
      const next = createNext();
      const error = new Error('create failed');
      mockTodoService.createTodo.mockRejectedValueOnce(error);

      await controller.createTodo(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('forwards updateTodo errors to next middleware', async () => {
      const req = { params: { id: '2' }, body: { title: 'Bad' } } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      const error = new Error('update failed');
      mockTodoService.updateTodo.mockRejectedValueOnce(error);

      await controller.updateTodo(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('forwards deleteTodo errors to next middleware', async () => {
      const req = { params: { id: '3' } } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      const error = new Error('delete failed');
      mockTodoService.deleteTodo.mockRejectedValueOnce(error);

      await controller.deleteTodo(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
