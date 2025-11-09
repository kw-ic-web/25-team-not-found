import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 레이아웃
import DefaultLayout from "./layouts/DefaultLayout";   
import MainAside from "./layouts/MainAside";           

// 페이지
import TeacherQuiz from "./pages/TeacherQuiz";
import TeacherLecture from "./pages/TeacherLecture";
import TeacherStudent from "./pages/TeacherStudent";
import TeacherMain from "./pages/TeacherMain";
import TeacherBook from "./pages/TeacherBook";
import Login from "./pages/Login";
import Lecture from "./pages/Lecture";

const router = createBrowserRouter([
  {
    path: "/teacher",
    element: <MainAside />, 
    children: [
      
    ],
  },

  {
    path: "/",
    element: <DefaultLayout />, 
    children: [
      { index: true, element: <Login /> },               
      { path: "login", element: <Login /> },             
      { path: "teacher/main", element: <TeacherMain /> }, 
      { path: "lecture", element: <Lecture /> },   
      
    ],
    
  },
  { path: "teacher/quiz", element: <TeacherQuiz /> },
  { path: "teacher/student", element: <TeacherStudent /> },
  { path: "teacher/lecture", element: <TeacherLecture /> },
  { path: "teacher/book", element: <TeacherBook /> },
]);


export default function App() {
  return <RouterProvider router={router} />;
}
