import { Outlet } from "react-router-dom";
import DefaultNavBar from "../components/DefaultNavBar";

const DefaultLayout = () => {
  return (
    <>
      <DefaultNavBar />
      <div className="w-screen min-h-screen mx-auto">
        <Outlet />
      </div>
    </>
  );
};

export default DefaultLayout;
