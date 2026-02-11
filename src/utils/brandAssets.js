/**
 * Utility per caricare assets specifici del brand
 * Usa il brand corrente dalla configurazione Expo 
 * 
 * NOTA: Metro bundler richiede require() statici, quindi tutti i brand
 * devono essere mappati esplicitamente qui.
 */

import Constants from 'expo-constants';

const BRAND = Constants.expoConfig?.extra?.brand || 'xcart';

// Mapping statico degli assets per ogni brand
// Metro deve poter risolvere questi path a compile-time
const brandAssets = {
  xcart: {
    logoWhite: require('../../brands/xcart/assets/xcartlogowhite.png'),
    logoBlack: require('../../brands/xcart/assets/xcartlogoblack.png'),
  },  gunpowder: {
    logoWhite: require('../../brands/gunpowder/assets/logowhite.png'),
    logoBlack: require('../../brands/gunpowder/assets/logoblack.png'),
  },

};

/**
 * Ottiene il brand corrente
 * @returns {string} - Nome del brand corrente
 */
export function getCurrentBrand() {
  return BRAND;
}

/**
 * Carica un asset del brand corrente
 * @param {string} assetKey - Chiave dell'asset (es: 'logoWhite', 'logoBlack')
 * @returns {any} - L'asset richiesto o null se non trovato
 */
export function getBrandAsset(assetKey) {
  const brandAssetMap = brandAssets[BRAND] || brandAssets.xcart;
  return brandAssetMap[assetKey] || null;
}

// Esporta direttamente gli assets del brand corrente per retrocompatibilità
const currentBrandAssets = brandAssets[BRAND] || brandAssets.xcart;
export const logoWhite = currentBrandAssets.logoWhite;
export const logoBlack = currentBrandAssets.logoBlack;
