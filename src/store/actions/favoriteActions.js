export const addFavorite = (productId) => ({
  type: "ADD_FAVORITE",
  payload: productId,
});

export const removeFavorite = (productId) => ({
  type: "REMOVE_FAVORITE",
  payload: productId,
});

export const setFavorites = (ids) => ({
  type: "SET_FAVORITES",
  payload: ids,
});
