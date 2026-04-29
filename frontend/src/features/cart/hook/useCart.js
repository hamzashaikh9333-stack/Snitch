import { addItem, getCartItems, incrementCartItem } from "../api/cart.api";
import { useDispatch } from "react-redux";
import { setItems,incrementCartItemQuantity } from "../state/cart.slice";

const useCart = () => {
    const dispatch = useDispatch();
  async function handleAddItem({ productId, variantId, quantity }) {
    const data = await addItem({ productId, variantId, quantity });
    return data;
  }

  async function handleGetCartItems() {
    const data = await getCartItems();
    dispatch(setItems(data.cart.items));
  }

  async function handleIncrementCartItem({ productId, variantId }) {
    const data = await incrementCartItem({ productId, variantId });
    dispatch(incrementCartItemQuantity({ productId, variantId }));
    
  }

  return {
    handleAddItem,
    handleGetCartItems,
    handleIncrementCartItem,
  };
};
export default useCart;
