#!/usr/bin/env node

/**
 * Script per creare un nuovo brand
 * Uso: node scripts/create-brand.js <brand-name> <display-name>
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brandName = process.argv[2];
const displayName = process.argv[3] || brandName;

if (!brandName) {
  console.error('❌ Errore: Specifica il nome del brand');
  console.log('Uso: node scripts/create-brand.js <brand-name> [display-name]');
  process.exit(1);
}

const brandPath = path.join(__dirname, '..', 'brands', brandName);
const assetsPath = path.join(brandPath, 'assets');
const constantsPath = path.join(brandPath, 'constants');
const configPath = path.join(brandPath, 'config.json');

// Verifica se il brand esiste già
if (fs.existsSync(brandPath)) {
  console.error(`❌ Brand "${brandName}" esiste già`);
  process.exit(1);
}

// Crea la struttura delle cartelle
fs.mkdirSync(brandPath, { recursive: true });
fs.mkdirSync(assetsPath, { recursive: true });
fs.mkdirSync(constantsPath, { recursive: true });

// Crea il file di configurazione template
const templateConfig = {
  "name": displayName,
  "slug": brandName,
  "displayName": displayName,
  "icon": `./brands/${brandName}/assets/icon.png`,
  "adaptiveIcon": `./brands/${brandName}/assets/adaptive-icon.png`,
  "splashImage": `./brands/${brandName}/assets/splash.png`,
  "splashBackgroundColor": "#000000",
  "favicon": `./brands/${brandName}/assets/favicon.png`,
  "notificationIcon": `./brands/${brandName}/assets/notification-icon.png`,
  "apiUrl": null,
  "licenseKey": null,
  "idsalespointkey": null,
  "ios": {
    "bundleIdentifier": `com.yourcompany.${brandName}`,
    "buildNumber": "1"
  },
  "android": {
    "package": `com.yourcompany.${brandName}`,
    "versionCode": 1,
    "googleServicesFile": `./brands/${brandName}/google-services.json`
  },
  "eas": {
    "projectId": "your-project-id-here"
  },
  "runtimeVersion": "1.0.0",
  "updates": {
    "url": "https://u.expo.dev/your-project-id-here"
  }
};

fs.writeFileSync(configPath, JSON.stringify(templateConfig, null, 2));

// Copia i file constants di default da xcart
// Nota: endpoints.js non viene copiato perché è globale in src/constants/endpoints.js
const defaultBrandPath = path.join(__dirname, '..', 'brands', 'xcart', 'constants');
const constantsFiles = ['colors.js', 'tagstyle.js', 'countries.js', 'appConfig.js'];

constantsFiles.forEach(file => {
  const sourcePath = path.join(defaultBrandPath, file);
  const destPath = path.join(constantsPath, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`   ✓ Creato brands/${brandName}/constants/${file}`);
  } else {
    console.warn(`   ⚠️  File template non trovato: ${sourcePath}`);
  }
});

// Copia i file logo da xcart come placeholder (l'utente può sostituirli dopo)
const defaultAssetsPath = path.join(__dirname, '..', 'brands', 'xcart', 'assets');
const logoFiles = [
  { source: 'xcartlogowhite.png', dest: 'logowhite.png' },
  { source: 'xcartlogoblack.png', dest: 'logoblack.png' },
];

logoFiles.forEach(({ source, dest }) => {
  const sourcePath = path.join(defaultAssetsPath, source);
  const destPath = path.join(assetsPath, dest);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`   ✓ Creato brands/${brandName}/assets/${dest} (placeholder da xcart)`);
  }
});

// Aggiorna brandConstants.js per includere il nuovo brand
const brandConstantsPath = path.join(__dirname, '..', 'src', 'utils', 'brandConstants.js');
if (fs.existsSync(brandConstantsPath)) {
  let brandConstantsContent = fs.readFileSync(brandConstantsPath, 'utf8');
  
  // Verifica se il brand esiste già nel file
  const brandExistsPattern = new RegExp(`\\s+${brandName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*\\{`);
  if (brandExistsPattern.test(brandConstantsContent)) {
    console.log(`   ℹ️  Brand "${brandName}" già presente in brandConstants.js`);
  } else {
    // Crea l'entry per il nuovo brand
    const newBrandEntry = `  ${brandName}: {
    colors: require('../../brands/${brandName}/constants/colors'),
    tagstyle: require('../../brands/${brandName}/constants/tagstyle'),
    countries: require('../../brands/${brandName}/constants/countries'),
    appConfig: require('../../brands/${brandName}/constants/appConfig'),
  },`;
    
    // Trova la posizione dove inserire il nuovo brand (prima del commento "// Aggiungi altri brand")
    const insertPattern = /(\s+)(\/\/ Aggiungi altri brand qui quando li crei)/;
    if (insertPattern.test(brandConstantsContent)) {
      // Inserisce il nuovo brand prima del commento
      brandConstantsContent = brandConstantsContent.replace(
        insertPattern,
        `${newBrandEntry}\n$1$2`
      );
      fs.writeFileSync(brandConstantsPath, brandConstantsContent, 'utf8');
      console.log(`   ✓ Aggiornato src/utils/brandConstants.js`);
    } else {
      // Fallback: cerca la chiusura dell'oggetto brandConstants
      const closingPattern = /(\s+)(\};)/;
      if (closingPattern.test(brandConstantsContent)) {
        brandConstantsContent = brandConstantsContent.replace(
          closingPattern,
          `${newBrandEntry}\n$1$2`
        );
        fs.writeFileSync(brandConstantsPath, brandConstantsContent, 'utf8');
        console.log(`   ✓ Aggiornato src/utils/brandConstants.js`);
      } else {
        console.warn(`   ⚠️  Impossibile aggiornare automaticamente brandConstants.js`);
        console.warn(`   ⚠️  Aggiungi manualmente il brand in src/utils/brandConstants.js`);
      }
    }
  }
} else {
  console.warn(`   ⚠️  File brandConstants.js non trovato`);
}

// Aggiorna brandAssets.js per includere il nuovo brand
const brandAssetsPath = path.join(__dirname, '..', 'src', 'utils', 'brandAssets.js');
if (fs.existsSync(brandAssetsPath)) {
  let brandAssetsContent = fs.readFileSync(brandAssetsPath, 'utf8');
  
  // Verifica se il brand esiste già nel file
  const brandExistsPattern = new RegExp(`\\s+${brandName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*\\{`);
  if (brandExistsPattern.test(brandAssetsContent)) {
    console.log(`   ℹ️  Brand "${brandName}" già presente in brandAssets.js`);
  } else {
    // Cerca i file logo nel brand (potrebbero avere nomi diversi)
    // Cerca pattern comuni: logowhite.png, logoblack.png, *logowhite*.png, *logoblack*.png
    let logoWhitePath = null;
    let logoBlackPath = null;
    
    const possibleLogoWhiteNames = [
      `${brandName}logowhite.png`,
      `logowhite.png`,
      `${brandName}logo-white.png`,
      `logo-white.png`,
    ];
    
    const possibleLogoBlackNames = [
      `${brandName}logoblack.png`,
      `logoblack.png`,
      `${brandName}logo-black.png`,
      `logo-black.png`,
    ];
    
    // Cerca il file logoWhite
    for (const fileName of possibleLogoWhiteNames) {
      const filePath = path.join(assetsPath, fileName);
      if (fs.existsSync(filePath)) {
        logoWhitePath = fileName;
        break;
      }
    }
    
    // Cerca il file logoBlack
    for (const fileName of possibleLogoBlackNames) {
      const filePath = path.join(assetsPath, fileName);
      if (fs.existsSync(filePath)) {
        logoBlackPath = fileName;
        break;
      }
    }
    
    // Se entrambi i file esistono, aggiungi l'entry
    if (logoWhitePath && logoBlackPath) {
      // Crea l'entry per il nuovo brand
      const newBrandEntry = `  ${brandName}: {
    logoWhite: require('../../brands/${brandName}/assets/${logoWhitePath}'),
    logoBlack: require('../../brands/${brandName}/assets/${logoBlackPath}'),
  },`;
      
      // Trova la posizione dove inserire il nuovo brand (prima della chiusura dell'oggetto)
      const closingPattern = /(\s+)(\};)/;
      if (closingPattern.test(brandAssetsContent)) {
        // Inserisce il nuovo brand prima della chiusura
        brandAssetsContent = brandAssetsContent.replace(
          closingPattern,
          `${newBrandEntry}\n$1$2`
        );
        fs.writeFileSync(brandAssetsPath, brandAssetsContent, 'utf8');
        console.log(`   ✓ Aggiornato src/utils/brandAssets.js`);
      } else {
        console.warn(`   ⚠️  Impossibile aggiornare automaticamente brandAssets.js`);
        console.warn(`   ⚠️  Aggiungi manualmente il brand in src/utils/brandAssets.js`);
      }
    } else {
      // I file logo non esistono ancora, avvisa l'utente
      console.log(`   ℹ️  File logo non trovati in brands/${brandName}/assets/`);
      console.log(`   ℹ️  Aggiungi logowhite.png e logoblack.png, poi aggiorna manualmente brandAssets.js`);
      console.log(`   ℹ️  Oppure usa nomi come: ${brandName}logowhite.png e ${brandName}logoblack.png`);
    }
  }
} else {
  console.warn(`   ⚠️  File brandAssets.js non trovato`);
}

console.log(`✅ Brand "${brandName}" creato con successo!`);
console.log(`\n📁 Struttura creata:`);
console.log(`   brands/${brandName}/`);
console.log(`   brands/${brandName}/config.json`);
console.log(`   brands/${brandName}/assets/`);
console.log(`   brands/${brandName}/constants/`);
console.log(`\n📝 Prossimi passi:`);
console.log(`   1. Modifica brands/${brandName}/config.json con le tue configurazioni`);
console.log(`   2. Aggiungi gli assets in brands/${brandName}/assets/`);
console.log(`   3. Personalizza i constants in brands/${brandName}/constants/ se necessario`);
console.log(`   4. Crea il file google-services.json se necessario`);
console.log(`   5. Builda con: npm run build:brand ${brandName}`);
