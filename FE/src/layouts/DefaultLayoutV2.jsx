import { Outlet } from "react-router-dom";

const DefaultLayoutV2 = () => {
  return (
    <main className="w-screen min-h-screen mx-auto">
      <Outlet />
    </main>
  );
};

export default DefaultLayoutV2;
