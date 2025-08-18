import initDB from "./config/db.js";

const runMigrations = async () => {

  const db = await initDB();


  
  console.log("Running migrations...");
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT NULL
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      location TEXT,
      min_salary INTEGER,
      max_salary INTEGER,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      job_id INTEGER,
      cover_letter TEXT,
      cv_link TEXT,
      status TEXT DEFAULT 'pending',
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Migrations completed ✅");
};


if (process.env.NODE_ENV !== "test") {
  runMigrations();
}

export default runMigrations;
