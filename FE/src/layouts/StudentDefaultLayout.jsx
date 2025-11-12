import DefaultNavBar from "../components/DefaultNavBar";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <>
      <DefaultNavBar />
      <div className="w-screen min-h-screen mx-auto">
        <Outlet />
      </div>
    </>
  );
}
