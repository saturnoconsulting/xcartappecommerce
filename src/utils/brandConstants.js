/**
 * Utility per caricare constants specifici del brand
 * Usa il brand corrente dalla configurazione Expo
 * 
 * NOTA: Metro bundler richiede require() statici per gli assets,
 * ma per i constants possiamo usare import dinamici o mapping statico.
 */

import Constants from 'expo-constants';

const BRAND = Constants.expoConfig?.extra?.brand || 'xcart';

// Mapping statico dei constants per ogni brand
// Metro deve poter risolvere questi path a compile-time
// Nota: endpoints sono globali in src/constants/endpoints.js e non vengono caricati dai brand
const brandConstants = {
  xcart: {
    colors: require('../../brands/xcart/constants/colors'),
    tagstyle: require('../../brands/xcart/constants/tagstyle'),
    countries: require('../../brands/xcart/constants/countries'),
    appConfig: require('../../brands/xcart/constants/appConfig'),
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
 * Carica i constants del brand corrente
 * @param {string} constantType - Tipo di constant ('colors', 'endpoints', 'tagstyle', 'countries')
 * @returns {any} - I constants richiesti o quelli di default (xcart) se non trovati
 */
export function getBrandConstants(constantType) {
  const brandConstantsMap = brandConstants[BRAND] || brandConstants.xcart;
  return brandConstantsMap[constantType] || brandConstants.xcart[constantType];
}

// Esporta direttamente i constants del brand corrente per retrocompatibilità
const currentBrandConstants = brandConstants[BRAND] || brandConstants.xcart;

// Re-export dei constants per uso diretto (oggetti completi)
export const colors = currentBrandConstants.colors;
// endpoints sono globali e vengono importati direttamente da src/constants/endpoints.js
export const tagstyle = currentBrandConstants.tagstyle;
export const appConfig = currentBrandConstants.appConfig;

// Re-export di tutte le costanti individuali per uso diretto
// Colors
export const primaryColor = currentBrandConstants.colors.primaryColor;
export const backgroundcolor = currentBrandConstants.colors.backgroundcolor;
export const secondaryColor = currentBrandConstants.colors.secondaryColor;

// Tag styles
export const tagsStyles = currentBrandConstants.tagstyle.tagsStyles;
export const tagsStylesPlayer = currentBrandConstants.tagstyle.tagsStylesPlayer;

// Countries
export const countries = currentBrandConstants.countries.countries || currentBrandConstants.countries;

// App Config
//TIPO DI APP (food o fashion)
export const activityType = currentBrandConstants.appConfig?.activityType || 'food';

//WIDGET EVENTI (true o false)
export const xEventsWidget = currentBrandConstants.appConfig?.xEventsWidget || false;
//WIDGET LIVE (true o false)
export const xEventsWidgetLive = currentBrandConstants.appConfig?.xEventsWidgetLive || false;
//WIDGET TICKETS (true o false)
export const xEventsWidgetTickets = currentBrandConstants.appConfig?.xEventsWidgetTickets || false;
//WIDGET SUBSCRIPTIONS (true o false)
export const xEventsWidgetSubscriptions = currentBrandConstants.appConfig?.xEventsWidgetSubscriptions || false;
//WIDGET DOMOTICA (true o false)
export const xLivingWidget = currentBrandConstants.appConfig?.xLivingWidget || false;