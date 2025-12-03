// store/reducers/favoriteReducer.js
const initialState = {
  ids: [], // un array di ID di prodotti preferiti
};

const favoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      if (state.ids.includes(action.payload)) {
        return state; // evita duplicati
      }
      return { ...state, ids: [...state.ids, action.payload] };

    case "REMOVE_FAVORITE":
      return { ...state, ids: state.ids.filter((id) => id !== action.payload) };

    case "SET_FAVORITES":
      return { ...state, ids: action.payload };

    default:
      return state;
  }
};

export default favoriteReducer;
