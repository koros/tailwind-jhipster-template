// Mock dependencies BEFORE importing
const mockTodoRepository = {
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
};

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(entity => {
      if (entity.name === 'User') return mockUserRepository;
      return mockTodoRepository;
    }),
    isInitialized: true,
  },
}));

import { TodoService } from './todo.service';
import { AppError } from '../middleware/error.middleware';

describe('TodoService', () => {
  let todoService: TodoService;

  beforeEach(() => {
    todoService = new TodoService();
    jest.clearAllMocks();
  });

  describe('getAllTodos', () => {
    it('should return paginated todos', async () => {
      const mockTodos = [
        { id: 1, title: 'Todo 1', completed: false },
        { id: 2, title: 'Todo 2', completed: true },
      ];

      mockTodoRepository.findAndCount.mockResolvedValue([mockTodos, 2]);

      const result = await todoService.getAllTodos(0, 20, 'id,asc');

      expect(result.todos).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockTodoRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        order: { id: 'ASC' },
        relations: ['user'],
      });
    });
  });

  describe('getTodoById', () => {
    it('should return todo by id', async () => {
      const mockTodo = { id: 1, title: 'Test Todo', completed: false };

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);

      const result = await todoService.getTodoById(1);

      expect(result.title).toBe('Test Todo');
      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
    });

    it('should throw error if todo not found', async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(todoService.getTodoById(999)).rejects.toThrow(AppError);
      await expect(todoService.getTodoById(999)).rejects.toThrow('Todo not found');
    });
  });

  describe('createTodo', () => {
    it('should create todo successfully', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'Test description',
        status: 'TODO',
        priority: 'MEDIUM',
      };

      mockTodoRepository.create.mockReturnValue({ ...todoData, id: 1 });
      mockTodoRepository.save.mockResolvedValue({ ...todoData, id: 1 });

      const result = await todoService.createTodo(todoData);

      expect(result.title).toBe('New Todo');
      expect(mockTodoRepository.save).toHaveBeenCalled();
    });

    it('should assign user if userId provided', async () => {
      const todoData = { title: 'Todo with user', userId: 1 };
      const mockUser = { id: 1, login: 'testuser' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockTodoRepository.create.mockReturnValue({ title: 'Todo with user', id: 1 });
      mockTodoRepository.save.mockResolvedValue({ title: 'Todo with user', id: 1, user: mockUser });

      const result = await todoService.createTodo(todoData);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('updateTodo', () => {
    it('should update todo successfully', async () => {
      const existingTodo = { id: 1, title: 'Old Title', completed: false };
      const updateData = { title: 'New Title', completed: true };

      mockTodoRepository.findOne.mockResolvedValue(existingTodo);
      mockTodoRepository.save.mockResolvedValue({ ...existingTodo, ...updateData });

      const result = await todoService.updateTodo(1, updateData);

      expect(result.title).toBe('New Title');
      expect(result.completed).toBe(true);
    });

    it('should throw error if todo not found', async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(todoService.updateTodo(999, { title: 'Updated' })).rejects.toThrow('Todo not found');
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo successfully', async () => {
      const mockTodo = { id: 1, title: 'Todo to delete' };

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTodoRepository.remove.mockResolvedValue(mockTodo);

      const result = await todoService.deleteTodo(1);

      expect(result.message).toBe('Todo deleted successfully');
      expect(mockTodoRepository.remove).toHaveBeenCalledWith(mockTodo);
    });

    it('should throw error if todo not found', async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(todoService.deleteTodo(999)).rejects.toThrow('Todo not found');
    });
  });
});
