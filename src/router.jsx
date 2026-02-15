import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./components/front/Home";
import Products from "./components/front/Products";
import SingleProduct from "./components/front/SingleProduct";
import Cart from "./components/front/Cart";
import NotFound from "./components/front/NotFound";
import Login from "./components/Login";
import Checkout from "./components/front/Checkout";
import AdminLayout from "./layout/AdminLayout";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders"

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);
