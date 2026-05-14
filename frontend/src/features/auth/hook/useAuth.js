import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setLoading, setUser } from "../state/auth.slice";
import { getMe, login, logout, register } from "../api/auth.api";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = useCallback(
    async ({ fullname, email, contact, password, isSeller = false }) => {
      const data = await register({
        fullname,
        email,
        contact,
        password,
        isSeller,
      });

      dispatch(setUser(data.user));
      return data.user;
    },
    [dispatch],
  );

  const handleLogin = useCallback(
    async ({ email, password }) => {
      const data = await login({ email, password });

      dispatch(setUser(data.user));
      return data.user;
    },
    [dispatch],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    dispatch(clearUser());
  }, [dispatch]);

  const handleGetme = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch {
      dispatch(clearUser());
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { handleRegister, handleLogin, handleGetme, handleLogout };
};
