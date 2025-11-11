import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import StudentMain from "./pages/student/StudentMain";
import NavBarLayout from "./layouts/NavBarLayout";
import QuizSolve from "./pages/student/QuizSolve";
import EnterClass from "./pages/student/EnterClass";
import StudentDashboard from "./pages/student/StudentDashboard";
import Landing from "./pages/Landing";
import RoleSelect from "./pages/RoleSelect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        element: <NavBarLayout />,
        children: [
          {
            index: true,
            element: <Landing />,
          },
          {
            path: "role-select",
            element: <RoleSelect />,
          },
        ],
      },
      {
        path: "student",
        children: [
          {
            index: true,
            element: <StudentMain />,
          },
          {
            path: "dashboard",
            element: <StudentDashboard />,
          },
          {
            element: <NavBarLayout />,
            children: [
              {
                path: "quiz",
                element: <QuizSolve />,
              },
              {
                path: "enter-class",
                element: <EnterClass />,
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
