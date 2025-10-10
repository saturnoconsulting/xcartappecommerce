const initialState = {
  items: [],
  ids: [],
  id: null,
  cartLength: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CART_ID":
      return { ...state, id: action.payload };

    case "RESET_CART_ID":
      return { ...state, id: null };

    case "EMPTY_CART":
      return initialState;

    case "SET_CART_LENGTH":
      return { ...state, cartLength: action.payload };

    default:
      return state;
  }
};

export default cartReducer;
