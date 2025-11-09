import DefaultNavBar from "../components/DefaultNavBar";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
         <DefaultNavBar />


      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
