import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <main className="w-screen min-h-screen mx-auto">
      <Outlet />
    </main>
  );
};

export default DefaultLayout;
