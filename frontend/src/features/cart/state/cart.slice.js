import { createSlice } from "@reduxjs/toolkit";

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
          item.items.productId._id === productId &&
          item.items.variantId === variantId
        ) {
          return {
            ...item,
            items: {
              ...item.items,
              quantity: item.items.quantity + 1,
            },
          };
        }

        return item;
      });
    },
    decrementCartItemQuantity: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (
          item.items.productId._id === productId &&
          item.items.variantId === variantId
        ) {
          return {
            ...item,
            items: {
              ...item.items,
              quantity: item.items.quantity - 1,
            },
          };
        }

        return item;
      });
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  setItems,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
