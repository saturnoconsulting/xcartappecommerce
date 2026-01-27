#!/usr/bin/env node

/**
 * Script per listare tutti i brand disponibili
 */

const fs = require('fs');
const path = require('path');

const brandsPath = path.join(__dirname, '..', 'brands');

if (!fs.existsSync(brandsPath)) {
  console.log('❌ Cartella brands/ non trovata');
  process.exit(1);
}

const brands = fs.readdirSync(brandsPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

if (brands.length === 0) {
  console.log('📦 Nessun brand trovato');
} else {
  console.log('📦 Brand disponibili:');
  brands.forEach(brand => {
    const configPath = path.join(brandsPath, brand, 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log(`  ✓ ${brand} - ${config.displayName || config.name}`);
    } else {
      console.log(`  ⚠️  ${brand} - config.json mancante`);
    }
  });
}
