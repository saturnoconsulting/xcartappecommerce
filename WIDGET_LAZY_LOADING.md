# Sistema di Lazy Loading per Widget

## Panoramica

Questo sistema permette di escludere i componenti widget non attivi dal bundle finale dell'app, riducendo significativamente le dimensioni dell'app quando alcuni widget sono disabilitati.

## Come Funziona

Il sistema utilizza **import condizionali** tramite `require()` che Metro bundler può analizzare staticamente a compile-time. Quando un widget è disattivato nella configurazione del brand, Metro esclude automaticamente il componente correlato dal bundle finale.

### Vantaggi

- ✅ **Riduzione dimensioni bundle**: I componenti non utilizzati non vengono inclusi
- ✅ **Performance migliori**: Meno codice da caricare e parsare
- ✅ **Tree-shaking automatico**: Metro esclude automaticamente i moduli non utilizzati
- ✅ **Zero overhead runtime**: Le condizioni sono valutate a compile-time

## Struttura

### File Principale: `src/utils/widgetLoader.js`

Questo file gestisce il caricamento condizionale di:
- **Componenti widget** (es. `BoxMatches`, `FoodCategoriesSection`)
- **Screen di navigazione** (es. `MatchesVOD`, `Subscriptions`, `Automation`)

### Configurazione Widget

I widget sono configurati in `brands/{brand}/constants/appConfig.js`:

```javascript
export const xEventsWidget = true; // true o false
export const xEventsWidgetLive = false;
export const xEventsWidgetTickets = true;
export const xEventsWidgetSubscriptions = true;
export const xLivingWidget = true;
export const activityType = 'fashion'; // 'food' o 'fashion'
```

## Utilizzo

### Per Componenti Widget

Invece di importare direttamente:

```javascript
// ❌ PRIMA (sempre incluso nel bundle)
import BoxMatches from '../components/BoxMatches';

// ✅ DOPO (incluso solo se attivo)
import { getWidgetComponent } from '../utils/widgetLoader';

const BoxMatches = getWidgetComponent('BoxMatches');
```

### Per Screen di Navigazione

Invece di importare direttamente:

```javascript
// ❌ PRIMA (sempre incluso nel bundle)
import MatchesVOD from '../views/MatchesVOD';

// ✅ DOPO (incluso solo se attivo)
import { getWidgetScreen } from '../utils/widgetLoader';

const MatchesVOD = getWidgetScreen('MatchesVOD');
```

### Esempio Completo: Dashboard.js

```javascript
import { getWidgetComponent, xEventsWidget, activityType } from '../utils/widgetLoader';

const renderHeader = () => {
  // Carica i componenti solo se attivi
  const FoodCategoriesSection = getWidgetComponent('FoodCategoriesSection');
  const CategoriesBox = getWidgetComponent('CategoriesBox');
  const BoxMatches = getWidgetComponent('BoxMatches');

  return (
    <View>
      {activityType === 'food' ? (
        FoodCategoriesSection && <FoodCategoriesSection />
      ) : (
        CategoriesBox && <CategoriesBox categories={cats} />
      )}
      {xEventsWidget && BoxMatches && (
        <BoxMatches subActive={subActive} />
      )}
    </View>
  );
};
```

### Esempio: Stack di Navigazione

```javascript
import { getWidgetScreen } from '../utils/widgetLoader';

export default function HomeStack() {
  // Carica le screen solo se attive
  const MatchesVOD = getWidgetScreen('MatchesVOD');
  const VideoMatchLive = getWidgetScreen('VideoMatchLive');

  return (
    <Stack.Navigator>
      {/* Screen sempre disponibili */}
      <Stack.Screen name="Dashboard" component={Dashboard} />
      
      {/* Screen condizionali */}
      {MatchesVOD && (
        <Stack.Screen name="MatchesVOD" component={MatchesVOD} />
      )}
      {VideoMatchLive && (
        <Stack.Screen name="VideoMatchLive" component={VideoMatchLive} />
      )}
    </Stack.Navigator>
  );
}
```

## Aggiungere un Nuovo Widget

### 1. Aggiungere la Configurazione

In `brands/{brand}/constants/appConfig.js`:

```javascript
export const myNewWidget = true; // true o false
```

### 2. Aggiornare brandConstants.js

Il sistema carica automaticamente le nuove costanti da `appConfig.js`, quindi non serve modificare `brandConstants.js` se usi il pattern esistente.

### 3. Aggiungere al widgetLoader.js

Aggiungi il componente o la screen nel file appropriato:

```javascript
// Per componenti widget
const widgetComponents = {
  // ... esistenti
  MyNewWidget: () => {
    if (myNewWidget) {
      return require('../components/MyNewWidget').default;
    }
    return null;
  },
};

// Per screen di navigazione
const widgetScreens = {
  // ... esistenti
  MyNewScreen: () => {
    if (myNewWidget) {
      return require('../views/MyNewScreen').default;
    }
    return null;
  },
};
```

### 4. Aggiornare isWidgetActive()

Aggiungi il caso nella funzione `isWidgetActive()`:

```javascript
export function isWidgetActive(widgetName) {
  switch (widgetName) {
    // ... casi esistenti
    case 'MyNewWidget':
    case 'MyNewScreen':
      return myNewWidget === true;
    default:
      return false;
  }
}
```

### 5. Usare il Widget

```javascript
import { getWidgetComponent } from '../utils/widgetLoader';

const MyNewWidget = getWidgetComponent('MyNewWidget');
{MyNewWidget && <MyNewWidget />}
```

## Verifica Tree-Shaking

Per verificare che Metro escluda correttamente i componenti non utilizzati:

1. **Build di produzione** con un widget disattivato
2. **Analizza il bundle** con strumenti come:
   - `react-native-bundle-visualizer`
   - `metro-bundle-analyzer`
3. **Confronta le dimensioni** del bundle con/senza widget

## Note Importanti

⚠️ **Le costanti devono essere determinabili a compile-time**

Metro bundler analizza staticamente i `require()`, quindi le condizioni devono essere valutabili a compile-time. Non usare valori runtime per le condizioni.

✅ **Funziona con**: Costanti importate da `brandConstants.js` (valutate a compile-time)

❌ **Non funziona con**: Valori da API, AsyncStorage, o altri valori runtime

## Widget Attualmente Supportati

### Componenti
- `BoxMatches` - Widget eventi/partite
- `FoodCategoriesSection` - Sezione categorie food
- `CategoriesBox` - Box categorie fashion

### Screen
- `MatchesVOD` - Screen eventi VOD
- `VideoMatchLive` - Screen live streaming
- `Subscriptions` - Screen abbonamenti
- `Automation` - Screen domotica

## Troubleshooting

### Il componente viene ancora incluso nel bundle

1. Verifica che la costante sia `false` nella configurazione del brand
2. Assicurati di usare `getWidgetComponent()` o `getWidgetScreen()` invece di import diretti
3. Controlla che non ci siano altri import statici del componente in altri file

### Errore "Widget non trovato"

1. Verifica che il widget sia registrato in `widgetLoader.js`
2. Controlla che il nome del widget corrisponda esattamente (case-sensitive)
3. Verifica che il path del `require()` sia corretto
