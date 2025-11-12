import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StudentDefaultLayout from "./layouts/StudentDefaultLayout";
import StudentMain from "./pages/student/StudentMain";
import QuizSolve from "./pages/student/QuizSolve";
import EnterClass from "./pages/student/EnterClass";
import StudentDashboard from "./pages/student/StudentDashboard";
import Landing from "./pages/Landing";
import RoleSelect from "./pages/RoleSelect";
import DefaultLayoutV2 from "./layouts/DefaultLayoutV2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayoutV2 />,
    children: [
      {
        element: <StudentDefaultLayout />,
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
            element: <StudentDefaultLayout />,
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
