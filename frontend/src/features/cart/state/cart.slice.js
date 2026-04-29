import {createSlice} from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    incrementCartItemQuantity: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (
          item.productId === productId &&
          item.variantId === variantId
        ) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    },
    decrementCartItemQuantity: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (
          item.productId === productId &&
          item.variantId === variantId
        ) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    },
  },
});

export const { addToCart, removeFromCart, setItems, incrementCartItemQuantity, decrementCartItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;