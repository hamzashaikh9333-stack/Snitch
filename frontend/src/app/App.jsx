import React from "react";
import Register from "../features/auth/pages/Register";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const App = () => {

  const { handleGetme } = useAuth();
  const user = useSelector(state=>state.auth.user)

  console.log(user)

  useEffect(() => {
    handleGetme();
  }, []);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
