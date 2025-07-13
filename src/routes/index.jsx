import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Canvas from '../pages/Canvas';
import Notice from '../pages/Notice';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
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
    ],
  },
]);

export default router;
