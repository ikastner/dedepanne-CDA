const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dedepanne',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function insertTestData() {
  try {
    console.log('Insertion des données de test...');
    console.log('Configuration DB:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'dedepanne',
      user: process.env.DB_USERNAME || 'postgres'
    });
    
    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, '../src/database/seeds/test-data.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Exécuter les requêtes SQL
    await pool.query(sqlContent);
    
    console.log('✅ Données de test insérées avec succès !');
    
    // Vérifier les données insérées
    const applianceTypes = await pool.query('SELECT * FROM appliance_types');
    const brands = await pool.query('SELECT * FROM brands');
    const users = await pool.query('SELECT * FROM users');
    const products = await pool.query('SELECT * FROM reconditioned_products');
    
    console.log(`📊 Données insérées:`);
    console.log(`   - Types d'appareils: ${applianceTypes.rows.length}`);
    console.log(`   - Marques: ${brands.rows.length}`);
    console.log(`   - Utilisateurs: ${users.rows.length}`);
    console.log(`   - Produits reconditionnés: ${products.rows.length}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données:', error);
  } finally {
    await pool.end();
  }
}

insertTestData(); 