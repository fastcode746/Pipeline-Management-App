import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import ActivityMonitor from './components/admin/ActivityMonitor';
import MessageCenter from './components/admin/MessageCenter';

// Engineer Components
import EngineerDashboard from './components/engineer/EngineerDashboard';
import FileUpload from './components/engineer/FileUpload';
import ManualDataEntry from './components/engineer/ManualDataEntry';
import AnalysisResults from './components/engineer/AnalysisResults';

// Designer Components
import DesignerDashboard from './components/designer/DesignerDashboard';
import PipeRecommendations from './components/designer/PipeRecommendations';

// Shared Components
import ErrorPage from './components/common/ErrorPage';
import UnauthorizedPage from './components/common/UnauthorizedPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  // Admin Routes
  {
    path: 'admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'activity',
        element: <ActivityMonitor />,
      },
      {
        path: 'messages',
        element: <MessageCenter />,
      },
    ],
  },
  // Engineer Routes
  {
    path: 'engineer',
    element: <ProtectedRoute allowedRoles={['engineer']} />,
    children: [
      {
        path: 'dashboard',
        element: <EngineerDashboard />,
      },
      {
        path: 'upload',
        element: <FileUpload />,
      },
      {
        path: 'manual-entry',
        element: <ManualDataEntry />,
      },
      {
        path: 'results',
        element: <AnalysisResults />,
      },
    ],
  },
  // Designer Routes
  {
    path: 'designer',
    element: <ProtectedRoute allowedRoles={['designer']} />,
    children: [
      {
        path: 'dashboard',
        element: <DesignerDashboard />,
      },
      {
        path: 'recommendations',
        element: <PipeRecommendations />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;