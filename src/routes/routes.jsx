import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import Home from "../pages/Home";
import NotFound from "../shared/NotFound/NotFound";
import WhiteBoard from "../pages/WhiteBoard";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/whiteboard/:id",
        element: <WhiteBoard />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
