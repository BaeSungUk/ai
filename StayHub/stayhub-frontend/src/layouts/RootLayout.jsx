import { Outlet } from "react-router";

import Header from "../components/Header.jsx";

function RootLayout() {
  return (
    <>
      <Header />

      <main className="main">
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
