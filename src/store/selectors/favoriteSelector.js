export const selectFavorites = (state) => state.favorite.ids;

export const isFavorite = (productId) => (state) =>
  state.favorite.ids.includes(productId);

export const getFavourites = (state) => state.favorite.ids;
