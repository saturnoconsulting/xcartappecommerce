export const setCartId = (id) => ({
  type: "SET_CART_ID",
  payload: id,
});

export const resetCartId = () => ({
  type: "RESET_CART_ID",
});

export const emptyCartAction = () => ({
  type: "EMPTY_CART",
});

export const setCartLength = (length) => ({
  type: "SET_CART_LENGTH",
  payload: length,
});

export const addOne = (item) => ({
  type: "ADD_ONE",
  payload: item,
});

export const adjustQty = (id, increase) => ({
  type: "ADJUST_QTY",
  payload: { id, increase },
});
