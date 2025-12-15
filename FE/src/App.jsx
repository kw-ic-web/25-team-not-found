import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 레이아웃
import DefaultLayout from "./layouts/DefaultLayout";
import DefaultLayoutV2 from "./layouts/DefaultLayoutV2";
import StudentDefaultLayout from "./layouts/StudentDefaultLayout";

// 페이지
import TeacherQuiz from "./pages/TeacherQuiz";
import TeacherLecture from "./pages/TeacherLecture";
import TeacherStudent from "./pages/TeacherStudent";
import TeacherMain from "./pages/TeacherMain";
import TeacherBook from "./pages/TeacherBook";
import Login from "./pages/Login";
import Lecture from "./pages/Lecture";
import StudentMain from "./pages/student/StudentMain";
import QuizSolve from "./pages/student/QuizSolve";
import EnterClass from "./pages/student/EnterClass";
import StudentDashboard from "./pages/student/StudentDashboard";
import Landing from "./pages/Landing";
import RoleSelect from "./pages/RoleSelect";
import Signup from "./pages/Signup";
import StudentBook from "./pages/student/StudentBook";

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
        element: <DefaultLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },

          { path: "signup", element: <Signup /> },
        ],
      },

      { path: "lecture", element: <Lecture /> },

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
            path: "book",
            element: <StudentBook />,
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
      {
        path: "teacher",
        children: [
          {
            index: "true",
            element: <TeacherMain />,
          },
          {
            path: "quiz",
            element: <TeacherQuiz />,
          },
          {
            path: "student",
            element: <TeacherStudent />,
          },
          {
            path: "lecture",
            element: <TeacherLecture />,
          },
          {
            path: "book",
            element: <TeacherBook />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
