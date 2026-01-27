#!/usr/bin/env node

/**
 * Script per buildare l'app per un brand specifico
 * Uso: node scripts/build-brand.js <brand-name> <platform> <profile>
 * Esempio: node scripts/build-brand.js xcart android production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const brandName = process.argv[2];
const platform = process.argv[3] || 'all';
const profile = process.argv[4] || 'production';

if (!brandName) {
  console.error('❌ Errore: Specifica il nome del brand');
  console.log('Uso: node scripts/build-brand.js <brand-name> [platform] [profile]');
  console.log('Esempio: node scripts/build-brand.js xcart android production');
  process.exit(1);
}

// Verifica che il brand esista
const brandPath = path.join(__dirname, '..', 'brands', brandName);
if (!fs.existsSync(brandPath)) {
  console.error(`❌ Brand "${brandName}" non trovato in brands/${brandName}`);
  process.exit(1);
}

console.log(`🚀 Building app for brand: ${brandName}`);
console.log(`📱 Platform: ${platform}`);
console.log(`🔧 Profile: ${profile}`);

// Imposta la variabile d'ambiente BRAND
process.env.BRAND = brandName;

// Esegue la build EAS
try {
  const command = `eas build --platform ${platform} --profile ${profile} --no-wait`;
  console.log(`\n📦 Eseguendo: ${command}\n`);
  execSync(command, { 
    stdio: 'inherit',
    env: { ...process.env, BRAND: brandName }
  });
  console.log(`\n✅ Build avviata con successo per brand: ${brandName}`);
} catch (error) {
  console.error(`\n❌ Errore durante la build:`, error.message);
  process.exit(1);
}
