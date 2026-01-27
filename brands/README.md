# Sistema Multi-Brand

Questa cartella contiene le configurazioni per ogni brand/client dell'applicazione.

## Struttura

Ogni brand ha la sua cartella con:
- `config.json` - Configurazione del brand (nome, bundle ID, icone, ecc.)
- `assets/` - Assets specifici del brand (icone, splash screen, ecc.)
- `constants/` - Constants specifici del brand (colori, endpoints, stili, ecc.)
- `google-services.json` (opzionale) - File Firebase per Android

## Come funziona

1. **Configurazione**: Ogni brand ha un file `config.json` con tutte le personalizzazioni
2. **Build**: Durante la build, viene specificato il brand tramite variabile d'ambiente `BRAND`
3. **Assets**: Gli assets del brand vengono referenziati nel `config.json` e copiati durante la build

## Creare un nuovo brand

```bash
npm run create:brand <brand-name> [display-name]
```

Esempio:
```bash
npm run create:brand rugby-laquila "Rugby L'Aquila"
```

Poi:
1. Modifica `brands/<brand-name>/config.json` con le tue configurazioni
2. Aggiungi gli assets in `brands/<brand-name>/assets/`
3. Personalizza i constants in `brands/<brand-name>/constants/` se necessario
4. Configura il bundle identifier e package name
5. Aggiungi il projectId EAS se necessario
6. Aggiungi il brand in `src/utils/brandConstants.js` se vuoi override completi

## Listare i brand disponibili

```bash
npm run list:brands
```

## Buildare per un brand specifico

```bash
npm run build:brand <brand-name> [platform] [profile]
```

Esempi:
```bash
# Build Android production per xcart
npm run build:brand xcart android production

# Build iOS development per rugby-laquila
npm run build:brand rugby-laquila ios development

# Build tutte le piattaforme
npm run build:brand xcart all production
```

## Sviluppo locale

Per sviluppare con un brand specifico:

```bash
BRAND=xcart npm start
# oppure
npm run start:brand
```

## Configurazione config.json

Ogni `config.json` deve contenere:

```json
{
  "name": "Nome interno",
  "slug": "slug-app",
  "displayName": "Nome visualizzato",
  "icon": "./path/to/icon.png",
  "adaptiveIcon": "./path/to/adaptive-icon.png",
  "splashImage": "./path/to/splash.png",
  "splashBackgroundColor": "#000000",
  "favicon": "./path/to/favicon.png",
  "notificationIcon": "./path/to/notification-icon.png",
  "apiUrl": "https://api.example.com",
  "licenseKey": "your-license-key",
  "idsalespointkey": "your-salespoint-id",
  "ios": {
    "bundleIdentifier": "com.company.app",
    "buildNumber": "1"
  },
  "android": {
    "package": "com.company.app",
    "versionCode": 1,
    "googleServicesFile": "./path/to/google-services.json"
  },
  "eas": {
    "projectId": "your-eas-project-id"
  },
  "runtimeVersion": "1.0.0",
  "updates": {
    "url": "https://u.expo.dev/your-project-id"
  }
}
```

### Campi API e configurazione

- **apiUrl**: URL dell'API backend per questo brand. Se `null`, usa il valore da `.env.<brand>` o `.env` (variabile `API_URL`)
- **licenseKey**: Chiave di licenza per questo brand. Se `null`, usa il valore da `.env.<brand>` o `.env` (variabile `LICENSE`)
- **idsalespointkey**: ID del sales point per questo brand. Se `null`, usa il valore da `.env.<brand>` o `.env` (variabile `IDSALESPOINT`)

### File .env per brand

Il sistema supporta file `.env` specifici per ogni brand:

1. **`.env.<brand-name>`** - File specifico del brand (es: `.env.xcart`, `.env.prova-brand`)
2. **`.env`** - File di default (usato come fallback se il file specifico del brand non esiste)

**Priorità dei valori:**
1. Valore nel `config.json` del brand (se specificato e non `null`)
2. Valore nel file `.env.<brand-name>` (es: `.env.xcart`)
3. Valore nel file `.env` (fallback)

**Esempio:**
- Per il brand `xcart`, il sistema caricherà prima `.env.xcart` se esiste
- Se `.env.xcart` non esiste, userà `.env` come fallback
- I valori nel `config.json` hanno sempre la priorità più alta

**Nota**: I file `.env` sono ignorati da git per sicurezza. Crea i file `.env.<brand>` nella root del progetto.

## Constants specifici del brand

Ogni brand può avere i suoi constants personalizzati nella cartella `brands/<brand-name>/constants/`:

- `colors.js` - Colori del brand (primaryColor, backgroundcolor, secondaryColor)
- `tagstyle.js` - Stili per il rendering HTML (tagsStyles, tagsStylesPlayer)
- `countries.js` - Lista paesi supportati
- `appConfig.js` - Configurazioni specifiche del brand (activityType, widgetEvent, ecc.)

**Nota**: Gli endpoints API sono globali e condivisi tra tutti i brand. Si trovano in `src/constants/endpoints.js` e non vengono copiati per ogni brand.

I constants vengono caricati automaticamente in base al brand corrente. Se un brand non ha un file constant specifico, viene usato quello di default (xcart).

**Come funziona:**
1. I constants vengono caricati da `src/utils/brandConstants.js` in base al brand corrente
2. I file in `src/constants/` re-exportano i valori dal brand corrente per retrocompatibilità
3. Quando crei un nuovo brand, i file constants vengono copiati da xcart come template
4. Per aggiungere un nuovo brand al sistema, aggiungi il mapping in `src/utils/brandConstants.js`

**Esempio di personalizzazione:**
```javascript
// brands/my-brand/constants/colors.js
export const primaryColor = "#FF0000"; // Rosso invece del default
export const backgroundcolor = "#FFFFFF";
export const secondaryColor = "#00FF00";
```

## Note importanti

- Gli assets comuni rimangono in `/assets` e possono essere riutilizzati
- Gli assets specifici del brand vanno in `brands/<brand>/assets/`
- I constants specifici del brand vanno in `brands/<brand>/constants/`
- Durante la build, solo il brand specificato viene incluso (gli altri brand non appesantiscono il bundle)
- Ogni brand può avere il suo `google-services.json` se usa Firebase diverso
