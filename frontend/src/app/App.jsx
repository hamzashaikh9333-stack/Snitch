import React from "react";
import Register from "../features/auth/pages/Register";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
