#!/usr/bin/env node

/**
 * Script di preparazione pre-build
 * Esclude i brand non necessari dal progetto durante la build
 * per ridurre le dimensioni del bundle
 */

const fs = require('fs');
const path = require('path');

const brandName = process.env.BRAND || 'xcart';
const brandsPath = path.join(__dirname, '..', 'brands');

if (!fs.existsSync(brandsPath)) {
  console.log('⚠️  Cartella brands/ non trovata');
  process.exit(0);
}

// Lista tutti i brand
const allBrands = fs.readdirSync(brandsPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Verifica che il brand richiesto esista
if (!allBrands.includes(brandName)) {
  console.error(`❌ Brand "${brandName}" non trovato`);
  console.log(`Brand disponibili: ${allBrands.join(', ')}`);
  process.exit(1);
}

console.log(`📦 Preparazione build per brand: ${brandName}`);
console.log(`📁 Brand disponibili: ${allBrands.join(', ')}`);

// Nota: In realtà Expo/EAS già ottimizza il bundle automaticamente,
// quindi non è necessario escludere fisicamente i file.
// Questo script serve principalmente per logging e validazione.

// Verifica che la configurazione del brand esista
const brandConfigPath = path.join(brandsPath, brandName, 'config.json');
if (!fs.existsSync(brandConfigPath)) {
  console.error(`❌ Configurazione non trovata: ${brandConfigPath}`);
  process.exit(1);
}

console.log(`✅ Brand "${brandName}" pronto per la build`);
console.log(`💡 Nota: Expo ottimizza automaticamente il bundle, escludendo i file non utilizzati`);
