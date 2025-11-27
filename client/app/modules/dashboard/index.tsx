import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

const DashboardRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route
      index
      element={
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600">Welcome to your dashboard. Select an item from the sidebar to get started.</p>
        </div>
      }
    />
  </ErrorBoundaryRoutes>
);

export default DashboardRoutes;
