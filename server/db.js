const { Pool } = require("pg");

async function setupDatabase() {
  const defaultPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DEFAULT_DB_NAME, // default database
    password: process.env.DB_PASS,
    port: process.env.DB_PORT, // Default PostgreSQL port
  });

  try {
    // Check if database exists
    const dbResult = await defaultPool.query(
      "SELECT 1 FROM pg_database WHERE datname='lit'",
    );
    if (dbResult.rowCount === 0) {
      // Create database if it doesn't exist
      console.log("Creating database lit...");
      await defaultPool.query("CREATE DATABASE lit");
      console.log("Database lit created.\n");
    } else {
      console.log("Database already exists. Skipping database creation.\n");
    }

    // Connect to the new database to create table
    const newDbPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME, // default database
      password: process.env.DB_PASS,
      port: process.env.DB_PORT, // Default PostgreSQL port
    });

    // Check if table exists
    const tableResult = await newDbPool.query(
      "SELECT 1 FROM information_schema.tables WHERE table_name='items'",
    );
    if (tableResult.rowCount === 0) {
      // Create table if it doesn't exist
      console.log("Creating table items...");
      await newDbPool.query(`
                CREATE TABLE items (
                    id SERIAL PRIMARY KEY,
                    status VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL
                )
            `);
      console.log("Table created.\n");
    } else {
      console.log("Table already exists. Skipping table creation.\n");
    }

    return newDbPool;
  } catch (error) {
    console.error("Database setup failed:", error);
  }
}

module.exports = {
  setupDatabase,
};
