import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import StudentMain from "./pages/student/StudentMain";
import NavBarLayout from "./layouts/NavBarLayout";
import QuizSolve from "./pages/student/QuizSolve";

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
        children: [
          {
            index: true,
            element: <StudentMain />,
          },
          {
            index: false,
            element: <NavBarLayout />,
            children: [
              {
                path: "quiz",
                element: <QuizSolve />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
