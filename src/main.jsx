import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx'
import './index.css'
import Layout from './layout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import { Provider } from 'react-redux';
import { store } from './Config/redux/store/store.js';


    const router = createBrowserRouter([
        {
          path: '',
          element: <Layout />,
          children: [
            {
              path: '',
              element: <Home />
            },
            {
              path: 'login',
              element: <Login />
            },
            {
              path: 'register',
              element: <Register />
            },
          {
              path: 'dashboard',
              element: <Dashboard /> 
            },

            {
              path: 'profile',
              element:<Profile />
            }
            
    ]
     }
    ])
      

      createRoot(document.getElementById('root')).render(
        <Provider store={store}>
        <RouterProvider router={router}>
        </RouterProvider>
          </Provider>
      )
    
    