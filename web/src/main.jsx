import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './styles/global.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.wrapper.jsx';
import ProductPage from './pages/product.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ViewedProductsPage from './pages/ViewedProductsPage.jsx';
import FavoriteProductsPage from './pages/FavoriteProductsPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "user",
        element: <UserPage />
      },
      {
        path: "product",
        element: <ProductPage />
      },
      {
        path: "/products/:id",

        element: <ProductDetailPage />
      },
       {
        path: "/viewd",

        element: <ViewedProductsPage />
      },
       {
        path: "/like",

        element: < FavoriteProductsPage/>
      }
    ]
  },
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "login",
    element: <LoginPage />
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)