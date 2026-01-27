# 🎨 Sistema Multi-Brand - Guida Completa

## Panoramica

Questo progetto supporta multiple brand/clienti con un'unica codebase. Ogni brand può avere:
- Nome app personalizzato
- Icone e splash screen personalizzati
- Bundle identifier / Package name unici
- Configurazioni Firebase separate
- Project EAS separati

## ✅ Vantaggi di questo approccio

1. **Un solo codice da manutenere** - Tutti i bugfix e feature vanno a tutti i brand
2. **Build selettive** - Solo il brand necessario viene incluso (Expo ottimizza automaticamente)
3. **Facile aggiungere nuovi brand** - Basta creare una nuova cartella con config
4. **Nessun appesantimento** - I file degli altri brand non vengono inclusi nel bundle finale

## 📁 Struttura del progetto

```
xcartappecommerce/
├── brands/                    # Configurazioni per ogni brand
│   ├── xcart/
│   │   ├── config.json        # Configurazione del brand
│   │   ├── assets/            # Assets specifici (icone, splash, ecc.)
│   │   └── google-services.json (opzionale)
│   ├── example-brand/
│   │   └── ...
│   └── README.md
├── assets/                    # Assets comuni (condivisi tra tutti i brand)
├── app.config.js              # Legge la config del brand da BRAND env var
├── scripts/
│   ├── build-brand.js         # Script per buildare un brand
│   ├── create-brand.js        # Script per creare un nuovo brand
│   ├── list-brands.js         # Lista tutti i brand disponibili
│   └── prepare-build.js       # Preparazione pre-build
└── src/                       # Codice sorgente (condiviso)
```

## 🚀 Quick Start

### 1. Listare i brand disponibili

```bash
npm run list:brands
```

### 2. Sviluppo locale con un brand

```bash
# Usa il brand di default (xcart)
npm start

# Oppure specifica un brand
BRAND=xcart npm start
# oppure
npm run start:brand
```

### 3. Creare un nuovo brand

```bash
npm run create:brand <brand-name> [display-name]
```

Esempio:
```bash
npm run create:brand rugby-laquila "Rugby L'Aquila"
```

Poi modifica `brands/rugby-laquila/config.json` con:
- Bundle identifier iOS/Android
- Project ID EAS
- Path agli assets

### 4. Buildare per un brand

```bash
npm run build:brand <brand-name> [platform] [profile]
```

Esempi:
```bash
# Android production
npm run build:brand xcart android production

# iOS development
npm run build:brand xcart ios development

# Tutte le piattaforme
npm run build:brand xcart all production
```

## 📝 Configurazione di un brand

Ogni brand ha un file `brands/<brand-name>/config.json`:

```json
{
  "name": "Nome interno",
  "slug": "slug-app",
  "displayName": "Nome visualizzato nell'app",
  "icon": "./assets/xcartlogoblack.png",
  "adaptiveIcon": "./assets/xcartlogoblack.png",
  "splashImage": "./assets/splashscreen.png",
  "splashBackgroundColor": "#000000",
  "favicon": "./assets/favicon.png",
  "notificationIcon": "./assets/notification-icon.png",
  "apiUrl": "https://api.example.com",
  "licenseKey": "your-license-key",
  "idsalespointkey": "your-salespoint-id",
  "ios": {
    "bundleIdentifier": "com.saturnoconsulting.xcart",
    "buildNumber": "1"
  },
  "android": {
    "package": "com.saturnoconsulting.xcart",
    "versionCode": 1,
    "googleServicesFile": "./google-services.json"
  },
  "eas": {
    "projectId": "95ee478b-f08f-42a5-911f-69fa670d7596"
  },
  "runtimeVersion": "1.0.2",
  "updates": {
    "url": "https://u.expo.dev/95ee478b-f08f-42a5-911f-69fa670d7596"
  }
}
```

### Campi API e configurazione

- **apiUrl**: URL dell'API backend per questo brand. Se `null` o non specificato, usa il valore da `.env.<brand>` o `.env` (variabile `API_URL`)
- **licenseKey**: Chiave di licenza per questo brand. Se `null` o non specificato, usa il valore da `.env.<brand>` o `.env` (variabile `LICENSE`)
- **idsalespointkey**: ID del sales point per questo brand. Se `null` o non specificato, usa il valore da `.env.<brand>` o `.env` (variabile `IDSALESPOINT`)

**Nota**: Puoi configurare questi valori in tre modi (in ordine di priorità):
1. **Nel config.json del brand** - Valori specifici per ogni brand (priorità massima)
2. **Nel file `.env.<brand-name>`** - File specifico del brand (es: `.env.xcart`)
3. **Nel file `.env`** - File di default condiviso (fallback)

## 🔧 Variabili d'ambiente e file .env

Il sistema supporta file `.env` specifici per ogni brand, permettendo di avere configurazioni separate per ogni cliente.

### File .env per brand

Puoi creare file `.env` specifici per ogni brand:

- **`.env.xcart`** - Configurazione per il brand xcart
- **`.env.prova-brand`** - Configurazione per il brand prova-brand
- **`.env`** - File di default (usato come fallback)

### Variabili d'ambiente supportate

- `BRAND` - Il brand da usare (default: `xcart`)
- `API_URL` - URL dell'API
- `LICENSE` - License key
- `IDSALESPOINT` - ID del sales point

### Esempio di file .env per brand

**`.env.xcart`:**
```env
API_URL=https://api.xcart.com
LICENSE=xcart-license-key-123
IDSALESPOINT=xcart-sp-456
```

**`.env.prova-brand`:**
```env
API_URL=https://api.prova-brand.com
LICENSE=prova-license-key-789
IDSALESPOINT=prova-sp-012
```

**`.env` (default/fallback):**
```env
BRAND=xcart
API_URL=https://api.example.com
LICENSE=default-license-key
IDSALESPOINT=default-salespoint-id
```

### Priorità dei valori

1. **Valore nel `config.json` del brand** (priorità massima)
2. **Valore nel file `.env.<brand-name>`** (es: `.env.xcart`)
3. **Valore nel file `.env`** (fallback)

**Esempio:**
- Se stai usando il brand `xcart`:
  1. Il sistema carica prima `.env.xcart` se esiste
  2. Se `.env.xcart` non esiste, usa `.env` come fallback
  3. I valori nel `config.json` hanno sempre la priorità più alta

### Per build EAS

Le variabili d'ambiente possono essere configurate in `eas.json` o tramite EAS Secrets. Il sistema caricherà automaticamente il file `.env.<brand>` corretto durante la build.

## 🏗️ Build con EAS

### Build locale

```bash
npm run build:brand xcart android production
```

### Build con EAS (cloud)

Il comando sopra usa EAS Build automaticamente. Per configurazioni avanzate, modifica `eas.json`.

### Variabili d'ambiente per build

Puoi configurare variabili d'ambiente specifiche per ogni brand in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "BRAND": "xcart",
        "API_URL": "https://api.example.com"
      }
    }
  }
}
```

Oppure usa EAS Secrets per variabili sensibili:
```bash
eas secret:create --scope project --name BRAND --value xcart
eas secret:create --scope project --name API_URL --value https://api.example.com
```

## 📦 Assets

### Assets comuni
Gli assets in `/assets` sono condivisi tra tutti i brand e possono essere referenziati da qualsiasi brand.

### Assets specifici del brand
Gli assets specifici vanno in `brands/<brand-name>/assets/` e vengono referenziati nel `config.json` del brand.

**Esempio:**
```json
{
  "icon": "./brands/rugby-laquila/assets/icon.png",
  "splashImage": "./brands/rugby-laquila/assets/splash.png"
}
```

## 🔍 Come funziona

1. **app.config.js** legge la variabile d'ambiente `BRAND` (default: `xcart`)
2. Carica `brands/<BRAND>/config.json`
3. Usa quella configurazione per generare il config Expo
4. Durante la build, Expo ottimizza automaticamente e include solo i file necessari

## ⚠️ Note importanti

- **Bundle size**: Expo/EAS ottimizza automaticamente il bundle, escludendo i file non utilizzati. I brand non selezionati non appesantiscono il bundle finale.
- **Assets**: Se un asset è referenziato nel `config.json`, deve esistere. Altrimenti la build fallirà.
- **Bundle identifiers**: Ogni brand deve avere bundle identifier/package name unici per poter essere pubblicato separatamente.
- **EAS Project ID**: Ogni brand può avere il suo EAS project ID per gestire build e updates separati.

## 🆘 Troubleshooting

### Brand non trovato
```
❌ Brand configuration not found: xyz
```
Verifica che esista `brands/xyz/config.json`

### Asset non trovato
Verifica che i path negli assets nel `config.json` siano corretti e i file esistano.

### Build fallisce
- Verifica che tutte le configurazioni nel `config.json` siano valide
- Controlla che i bundle identifier siano unici
- Verifica le variabili d'ambiente necessarie

## 📚 Esempi

### Esempio: Brand "Rugby L'Aquila"

1. Crea il brand:
```bash
npm run create:brand rugby-laquila "Rugby L'Aquila"
```

2. Modifica `brands/rugby-laquila/config.json`:
```json
{
  "name": "Rugby L'Aquila",
  "slug": "rugby-laquila",
  "displayName": "Rugby L'Aquila",
  "ios": {
    "bundleIdentifier": "com.rugby.laquila",
    "buildNumber": "1"
  },
  "android": {
    "package": "com.rugby.laquila",
    "versionCode": 1
  }
}
```

3. Aggiungi gli assets in `brands/rugby-laquila/assets/`

4. Builda:
```bash
npm run build:brand rugby-laquila android production
```

## 🎯 Best Practices

1. **Naming**: Usa nomi brand in lowercase con trattini (es: `rugby-laquila`)
2. **Assets**: Mantieni gli assets comuni in `/assets`, quelli specifici in `brands/<brand>/assets/`
3. **Config**: Mantieni le configurazioni minime necessarie, riusa i default quando possibile
4. **Testing**: Testa ogni brand prima di fare build di produzione
5. **Documentazione**: Documenta configurazioni speciali per ogni brand in un README nella cartella del brand
