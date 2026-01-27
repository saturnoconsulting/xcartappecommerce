import fs from 'fs';
import path from 'path';

// Carica dotenv usando require (compatibile con Expo)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');
const dotenvConfig = dotenv.config || (() => ({ error: null }));

// Usa process.cwd() invece di __dirname per compatibilità con Expo
const projectRoot = process.cwd();

// Determina il brand (può essere passato come variabile d'ambiente o da .env)
// Prima carica .env di default se esiste (per avere BRAND disponibile)
const defaultEnvPath = path.join(projectRoot, '.env');
if (fs.existsSync(defaultEnvPath)) {
  const result = dotenvConfig({ path: defaultEnvPath });
  if (result?.error) {
    console.warn(`⚠️  Error loading .env:`, result.error.message);
  }
}

// Legge il brand dalla variabile d'ambiente, default: 'xcart'
const BRAND = process.env.BRAND || 'xcart';

// Carica il file .env specifico del brand se esiste
const brandEnvPath = path.join(projectRoot, `.env.${BRAND}`);
if (fs.existsSync(brandEnvPath)) {
  const result = dotenvConfig({ path: brandEnvPath, override: true });
  if (result?.error) {
    console.warn(`⚠️  Error loading .env.${BRAND}:`, result.error.message);
  } else {
    console.log(`📦 Loaded environment from .env.${BRAND}`);
  }
} else {
  // Fallback al .env di default se il file specifico del brand non esiste
  if (fs.existsSync(defaultEnvPath)) {
    const result = dotenvConfig({ path: defaultEnvPath, override: true });
    if (result?.error) {
      console.warn(`⚠️  Error loading .env:`, result.error.message);
    } else {
      console.log(`📦 Loaded environment from .env (default)`);
    }
  } else {
    console.log(`ℹ️  No .env files found, using environment variables only`);
  }
}

// Debug: mostra le variabili caricate (solo in sviluppo)
if (process.env.NODE_ENV !== 'production') {
  console.log(`🔍 Brand: ${BRAND}`);
  console.log(`🔍 API_URL: ${process.env.API_URL ? '✓ Set' : '✗ Not set'}`);
  console.log(`🔍 LICENSE: ${process.env.LICENSE ? '✓ Set' : '✗ Not set'}`);
  console.log(`🔍 IDSALESPOINT: ${process.env.IDSALESPOINT ? '✓ Set' : '✗ Not set'}`);
}

// Debug: mostra le variabili caricate (solo in sviluppo)
if (process.env.NODE_ENV !== 'production') {
  console.log(`🔍 Brand: ${BRAND}`);
  console.log(`🔍 API_URL: ${process.env.API_URL ? '✓' : '✗'}`);
  console.log(`🔍 LICENSE: ${process.env.LICENSE ? '✓' : '✗'}`);
  console.log(`🔍 IDSALESPOINT: ${process.env.IDSALESPOINT ? '✓' : '✗'}`);
}

// Carica la configurazione del brand
function getBrandConfig() {
  const brandConfigPath = path.join(projectRoot, 'brands', BRAND, 'config.json');
  
  if (!fs.existsSync(brandConfigPath)) {
    console.warn(`⚠️  Brand config not found: ${brandConfigPath}`);
    console.warn(`⚠️  Using default brand: xcart`);
    // Fallback alla configurazione di default
    const defaultPath = path.join(projectRoot, 'brands', 'xcart', 'config.json');
    if (fs.existsSync(defaultPath)) {
      return JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
    }
    throw new Error(`Default brand config not found. Please create brands/xcart/config.json`);
  }
  
  return JSON.parse(fs.readFileSync(brandConfigPath, 'utf8'));
}

const brandConfig = getBrandConfig();

export default {
  expo: {
    name: brandConfig.displayName || brandConfig.name,
    slug: brandConfig.slug,
    version: brandConfig.version,
    orientation: "portrait",
    icon: brandConfig.icon,
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: brandConfig.splashImage,
      resizeMode: "cover",
      backgroundColor: brandConfig.splashBackgroundColor || "#000000"
    },
    ios: {
      buildNumber: brandConfig.ios?.buildNumber || "1",
      supportsTablet: true,
      bundleIdentifier: brandConfig.ios?.bundleIdentifier,
      entitlements: {
        "aps-environment": "production", // o "development" a seconda dell'ambiente
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserNotificationUsageDescription: "Questa app utilizza le notifiche per informarti su eventi importanti."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: brandConfig.adaptiveIcon,
        backgroundColor: "#FFFFFF",
      },
      edgeToEdgeEnabled: true,
      versionCode: brandConfig.android?.versionCode || 1,
      package: brandConfig.android?.package,
      // Includi googleServicesFile solo se esiste e il file esiste fisicamente
      ...(brandConfig.android?.googleServicesFile && (() => {
        const googleServicesPath = path.isAbsolute(brandConfig.android.googleServicesFile)
          ? brandConfig.android.googleServicesFile
          : path.join(projectRoot, brandConfig.android.googleServicesFile);
        if (fs.existsSync(googleServicesPath)) {
          return { googleServicesFile: brandConfig.android.googleServicesFile };
        } else {
          console.warn(`⚠️  google-services.json not found at: ${googleServicesPath}`);
          return {};
        }
      })()),
    },
    web: {
      favicon: brandConfig.favicon
    },
    extra: {
      brand: BRAND,
      eas: {
        projectId: brandConfig.eas?.projectId
      },
      // Legge dalla configurazione del brand, con fallback alle variabili d'ambiente
      // Se non trovato, usa stringa vuota per evitare undefined
      apiUrl: brandConfig.apiUrl || process.env.API_URL || '',
      licenseKey: brandConfig.licenseKey || process.env.LICENSE || '',
      idsalespointkey: brandConfig.idsalespointkey || process.env.IDSALESPOINT || '',
    },
    runtimeVersion: brandConfig.runtimeVersion || "1.0.0",
    updates: {
      url: brandConfig.updates?.url,
      enabled: true,
      fallbackToCacheTimeout: 0
    },
    plugins: [
      "expo-font",
      [
        "expo-system-ui",
        {
          edgeToEdgeEnabled: true,
        },
      ],
      [
      "expo-notifications",
      {
        icon: brandConfig.notificationIcon || "assets/notification-icon.png",
        color: "#ffffff",
      },
      ],
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": false,
          "supportsPictureInPicture": true
        }
      ]
    ]
  }
};
