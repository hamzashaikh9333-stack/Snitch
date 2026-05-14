import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addItem, getCartItems, incrementCartItem } from "../api/cart.api";
import { setItems } from "../state/cart.slice";

const useCart = () => {
  const dispatch = useDispatch();

  const handleAddItem = useCallback(async ({ productId, variantId, quantity }) => {
    const data = await addItem({ productId, variantId, quantity });
    return data;
  }, []);

  const handleGetCartItems = useCallback(async () => {
    const data = await getCartItems();
    dispatch(setItems(data.cart?.items || []));
    return data.cart;
  }, [dispatch]);

  const handleIncrementCartItem = useCallback(
    async ({ productId, variantId }) => {
      await incrementCartItem({ productId, variantId });
      await handleGetCartItems();
    },
    [handleGetCartItems],
  );

  return {
    handleAddItem,
    handleGetCartItems,
    handleIncrementCartItem,
  };
};

export default useCart;
