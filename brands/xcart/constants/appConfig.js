//per modificare la schermata Home in base alla tipologia di attività
export const activityType = 'fashion'; // 'food' o 'fashion' o ''

//widget xevents vengono mostrati solo se il widget principale xEventsWidget è true 
export const xEventsWidget = true; // true o false 
export const xEventsWidgetLive = false; // true o false 
export const xEventsWidgetTickets = false; // true o false 
export const xEventsWidgetSubscriptions= false; // true o false 

export const xLivingWidget= false; // true o false 

// Modalità app: 'standard' (ecommerce completo (prende il type sopra: fashion o food)) o 'domotica' (solo domotica e badge)
export const appMode = 'domotica'; // 'standard' o 'domotica'

//SE APPMODE è 'standard' ALLORA ENABLEECOMMERCE DEVE ESSERE FALSE
export const enableEcommerce = true; // true o false
// Abilita ecommerce nella modalità domotica 

//parametri da inserire quando mi viene dato il file con tutti i dati del cliente 