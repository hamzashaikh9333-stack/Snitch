import { addItem } from "../api/cart.api";
import { useDispatch } from "react-redux";
import { addToCart } from "../state/cart.slice";

const useCart = () => {
  //   const dispatch = useDispatch();
  async function handleAddItem({ productId, variantId }) {
    const data = await addItem({ productId, variantId });
    return data;
  }
  return {
    handleAddItem,
  };
};
export default useCart;
