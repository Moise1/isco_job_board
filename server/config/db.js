import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDB = async () => {

   const dbFile =
     process.env.NODE_ENV === "test"
       ? "./database_test.sqlite"
       : "./database.sqlite";
  
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database,
  });

  return db;
};

export default initDB;
