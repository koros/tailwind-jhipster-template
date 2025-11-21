import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Todo from './todo';
import TodoDetail from './todo-detail';
import TodoUpdate from './todo-update';
import TodoDeleteDialog from './todo-delete-dialog';

const TodoRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Todo />} />
    <Route path="new" element={<TodoUpdate />} />
    <Route path=":id">
      <Route index element={<TodoDetail />} />
      <Route path="edit" element={<TodoUpdate />} />
      <Route path="delete" element={<TodoDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default TodoRoutes;
