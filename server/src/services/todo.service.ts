import { AppDataSource } from '../config/database';
import { Todo, TodoStatus, Priority } from '../entities/Todo';
import { User } from '../entities/User';
import { AppError } from '../middleware/error.middleware';

const todoRepository = AppDataSource.getRepository(Todo);
const userRepository = AppDataSource.getRepository(User);

export class TodoService {
  async getAllTodos(page: number = 0, size: number = 20, sort: string = 'id,asc') {
    const [sortField, sortOrder] = sort.split(',');
    const skip = page * size;

    const [todos, total] = await todoRepository.findAndCount({
      skip,
      take: size,
      order: { [sortField]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
      relations: ['user'],
    });

    return {
      todos,
      total,
      page,
      size,
    };
  }

  async getTodoById(id: number) {
    const todo = await todoRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    return todo;
  }

  async createTodo(todoData: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: Date;
    completed?: boolean;
    userId?: number;
  }) {
    const todo = todoRepository.create({
      ...todoData,
      status: todoData.status as TodoStatus,
      priority: todoData.priority as Priority,
    });

    if (todoData.userId) {
      const user = await userRepository.findOne({ where: { id: todoData.userId } });
      if (user) {
        todo.user = user;
      }
    }

    return await todoRepository.save(todo);
  }

  async updateTodo(id: number, todoData: Partial<Todo>) {
    const todo = await todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    Object.assign(todo, todoData);
    todo.lastModifiedDate = new Date();

    return await todoRepository.save(todo);
  }

  async deleteTodo(id: number) {
    const todo = await todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    await todoRepository.remove(todo);
    return { message: 'Todo deleted successfully' };
  }
}

export default new TodoService();
