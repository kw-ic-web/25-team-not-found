import { Outlet } from "react-router-dom";
import DefaultNavBar from "../components/DefaultNavBar";

const DefaultLayout = () => {
  return (
    <main className="w-screen min-h-screen mx-auto">
      <DefaultNavBar />
      <Outlet />
    </main>
  );
};

export default DefaultLayout;
