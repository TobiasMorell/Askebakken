import { Link, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './pages/login/login-page';
import { ForgotPasswordPage } from './pages/login/forgot-password-page';
import { PlannerPage } from './pages/planner/planner-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us</Link>
      </div>
    ),
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: 'planner',
    element: <PlannerPage />,
  },
]);
