import { createBrowserRouter } from 'react-router';
import AppLayout from '../components/layout/AppLayout';
import POSLayout from '../components/layout/POSLayout';

import POS from '../pages/POS';
import Login from '../pages/Login';
import Sales from '../pages/Sales';
import Purchases from '../pages/Purchases';
import Products from '../pages/Products';
import Categories from '../pages/Categories';
import Inventory from '../pages/Inventory';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import AdminRoles from '../pages/AdminRoles';
import CustomerDisplay from '../pages/CustomerDisplay';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/customer-display',
    element: <CustomerDisplay />,
  },
  {
    path: '/pos',
    element: <POSLayout />,
    children: [
      { index: true, element: <POS /> }
    ]
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'sales', element: <Sales /> },
      { path: 'purchases', element: <Purchases /> },
      { path: 'products', element: <Products /> },
      { path: 'categories', element: <Categories /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
      { path: 'admin', element: <AdminRoles /> },
    ],
  },
]);
