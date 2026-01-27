/**
 * Script helper per leggere la configurazione del brand
 * Usato da app.config.js e altri script
 */

const fs = require('fs');
const path = require('path');

function getBrandConfig(brandName) {
  const brandPath = path.join(__dirname, '..', 'brands', brandName, 'config.json');
  
  if (!fs.existsSync(brandPath)) {
    throw new Error(`Brand configuration not found: ${brandName}. Please check brands/${brandName}/config.json`);
  }
  
  const config = JSON.parse(fs.readFileSync(brandPath, 'utf8'));
  return config;
}

function getAllBrands() {
  const brandsPath = path.join(__dirname, '..', 'brands');
  
  if (!fs.existsSync(brandsPath)) {
    return [];
  }
  
  return fs.readdirSync(brandsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

module.exports = { getBrandConfig, getAllBrands };
