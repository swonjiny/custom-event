import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Canvas from '../pages/Canvas';
import Notice from '../pages/Notice';
import Board from '../pages/Board';
import DatabaseConfig from '../pages/DatabaseConfig';
import ScreenLayoutPage from '../pages/ScreenLayoutPage';
import ErrorPage from '../pages/ErrorPage';
import PopupWindow from '../pages/PopupWindow';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'canvas',
        element: <Canvas />,
      },
      {
        path: 'notice',
        element: <Notice />,
      },
      {
        path: 'board',
        element: <Board />,
      },
      {
        path: 'database',
        element: <DatabaseConfig />,
      },
      {
        path: 'screen-layout',
        element: <ScreenLayoutPage />,
      },
    ],
  },
  {
    path: '/popup',
    element: <PopupWindow />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
