import { setError, setLoading, setUser } from "../state/auth.slice";
import { register } from "../api/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();
  async function handleRegister({
    fullname,
    email,
    contact,
    password,
    isSeller = false,
  }) {
    const data = await register({ fullname, email, contact, password , isSeller});
    console.log(data);
    dispatch(setUser(data.user));
  }

  return { handleRegister };
};
