import React from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";
const App = () => {
  const { handleGetme } = useAuth();

  useEffect(() => {
    handleGetme();
  }, [handleGetme]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
