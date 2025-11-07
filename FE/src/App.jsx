import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import StudentMain from "./pages/student/StudentMain";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <h1>Home</h1>,
      },
      {
        path: "student",
        element: <StudentMain />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
