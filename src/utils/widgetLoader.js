/**
 * Widget Loader - Caricamento condizionale dei componenti widget
 * 
 * Questo sistema permette di escludere i componenti widget non attivi dal bundle finale.
 * Metro bundler analizza staticamente i require() e può escludere i moduli non utilizzati
 * se le condizioni sono valutabili a compile-time.
 * 
 * IMPORTANTE: Per funzionare correttamente, le costanti dei widget devono essere
 * determinabili a compile-time (non runtime).
 */

import { xEventsWidget, xEventsWidgetLive, xEventsWidgetTickets, xEventsWidgetSubscriptions, xLivingWidget, activityType } from './brandConstants';

/**
 * Factory per caricare i componenti widget solo se attivi
 * Usa require() condizionali che Metro può analizzare staticamente
 */

// Componenti widget disponibili
const widgetComponents = {
  // Widget Eventi (BoxMatches)
  BoxMatches: () => {
    if (xEventsWidget) {
      // Metro analizza questo require() e lo include solo se xEventsWidget è true a compile-time
      return require('../components/BoxMatches').default;
    }
    return null;
  },

  // Widget Food Categories (solo se activityType === 'food')
  FoodCategoriesSection: () => {
    if (activityType === 'food') {
      return require('../components/FoodCategoriesSection').default;
    }
    return null;
  },

  // Widget Categories Box (solo se activityType !== 'food')
  CategoriesBox: () => {
    if (activityType !== 'food') {
      return require('../components/CategoriesBox').default;
    }
    return null;
  },
};

// Screen di navigazione condizionali
const widgetScreens = {
  // Screen Eventi VOD
  MatchesVOD: () => {
    if (xEventsWidget) {
      return require('../views/MatchesVOD').default;
    }
    return null;
  },

  // Screen Live Streaming
  VideoMatchLive: () => {
    if (xEventsWidget && xEventsWidgetLive) {
      return require('../views/VideoMatchLive').default;
    }
    return null;
  },

  // Screen Abbonamenti
  Subscriptions: () => {
    if (xEventsWidget && xEventsWidgetSubscriptions) {
      return require('../views/Subscriptions').default;
    }
    return null;
  },

  // Screen Domotica
  Automation: () => {
    if (xLivingWidget) {
      return require('../views/Automation').default;
    }
    return null;
  },
};

/**
 * Ottiene un componente widget se è attivo, altrimenti ritorna null
 * @param {string} widgetName - Nome del widget da caricare
 * @returns {React.Component|null} - Il componente o null se non attivo
 */
export function getWidgetComponent(widgetName) {
  const loader = widgetComponents[widgetName];
  if (!loader) {
    console.warn(`Widget "${widgetName}" non trovato nel widgetLoader`);
    return null;
  }
  return loader();
}

/**
 * Ottiene una screen widget se è attiva, altrimenti ritorna null
 * @param {string} screenName - Nome della screen da caricare
 * @returns {React.Component|null} - La screen o null se non attiva
 */
export function getWidgetScreen(screenName) {
  const loader = widgetScreens[screenName];
  if (!loader) {
    console.warn(`Screen widget "${screenName}" non trovata nel widgetLoader`);
    return null;
  }
  return loader();
}

/**
 * Verifica se un widget è attivo
 * @param {string} widgetName - Nome del widget da verificare
 * @returns {boolean} - True se il widget è attivo
 */
export function isWidgetActive(widgetName) {
  switch (widgetName) {
    case 'BoxMatches':
      return xEventsWidget === true;
    case 'FoodCategoriesSection':
      return activityType === 'food';
    case 'CategoriesBox':
      return activityType !== 'food';
    case 'MatchesVOD':
      return xEventsWidget === true;
    case 'VideoMatchLive':
      return xEventsWidget === true && xEventsWidgetLive === true;
    case 'Subscriptions':
      return xEventsWidget === true && xEventsWidgetSubscriptions === true;
    case 'Automation':
      return xLivingWidget === true;
    default:
      return false;
  }
}

/**
 * Hook per caricare un widget in modo lazy
 * @param {string} widgetName - Nome del widget da caricare
 * @returns {React.Component|null} - Il componente o null
 */
export function useWidget(widgetName) {
  const isActive = isWidgetActive(widgetName);
  if (!isActive) {
    return null;
  }
  return getWidgetComponent(widgetName);
}

// Esporta anche le costanti per comodità
export { xEventsWidget, xEventsWidgetLive, xEventsWidgetTickets, xEventsWidgetSubscriptions, xLivingWidget, activityType };
