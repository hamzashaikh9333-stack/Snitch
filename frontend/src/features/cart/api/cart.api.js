import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
  withCredentials: true,
});

export const addItem = async ({ productId, variantId, quantity }) => {
  const response = await cartApiInstance.post("/add", {
    productId,
    variantId,
    quantity, 
  });

  return response.data;
};

export const getCartItems = async () => {
  const response = await cartApiInstance.get("/");
  return response.data;
};

export const incrementCartItem = async ({ productId, variantId }) => {
  const response = await cartApiInstance.patch(
    `/quantity/increment/${productId}`,
    { variantId },
  );

  return response.data;
};
