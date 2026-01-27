// Assets comuni (non specifici del brand)
export const logo = require("../assets/img/logo-xcart.png");
export const x_logo = require("../assets/img/X-logo.png");
export const placeholderImage = require("../assets/img/placeholder.png");

// Assets specifici del brand - usa il brand corrente
// Per retrocompatibilità, esporta anche direttamente quelli di xcart
// Ma è preferibile usare getBrandAsset() da utils/brandAssets.js
export { logoWhite, logoBlack, getBrandAsset, getCurrentBrand } from '../utils/brandAssets';