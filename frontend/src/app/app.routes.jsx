import {createBrowserRouter} from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";




export const routes = createBrowserRouter([
    {
        path: "/",
        element: <div className="h-screen w-full bg-cyan-950"><h1>Home</h1></div>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    }
])