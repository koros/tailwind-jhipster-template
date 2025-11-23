import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

export class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 0;
      const size = parseInt(req.query.size as string) || 20;
      const sort = (req.query.sort as string) || 'id,asc';

      const result = await userService.getAllUsers(page, size, sort);

      res.set('X-Total-Count', result.total.toString());
      res.json(result.users);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { login } = req.params;
      const user = await userService.getUserByLogin(login);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      // Login can be in URL params or in the request body
      const login = req.params.login || req.body.login;

      if (!login) {
        throw new Error('User login is required');
      }

      const user = await userService.updateUser(login, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { login } = req.params;
      const result = await userService.deleteUser(login);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAuthorities(req: Request, res: Response, next: NextFunction) {
    try {
      const authorities = await userService.getAuthorities();
      res.json(authorities);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
