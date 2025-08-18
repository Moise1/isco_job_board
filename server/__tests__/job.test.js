import request from "supertest";
import buildTestApp from "../helpers/buildTestApp.js";
import initDB from "../config/db.js";
import fs from "fs";

let app;
let db;

beforeAll(async () => {
  // reset test db
  if (fs.existsSync("./database_test.sqlite")) {
    fs.unlinkSync("./database_test.sqlite");
  }

  db = await initDB();
  app = await buildTestApp();

  // create schema
  await db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    );

    CREATE TABLE jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      location TEXT,
      min_salary INTEGER,
      max_salary INTEGER,
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // seed minimal data
  await db.run(
    `INSERT INTO users (first_name, last_name, email, password, role) 
     VALUES ('Admin','User','admin@jobconnekt.com','hashed','admin')`
  );

  await db.run(
    `INSERT INTO jobs (title, description, location, min_salary, max_salary, created_by)
     VALUES ('Test Job','Desc','Kigali',1000,2000,1)`
  );
});

afterAll(async () => {
  await db.close();
});

describe("JobController", () => {
  test("GET /jobs should return jobs", async () => {
    const res = await request(app).get("/api/v1/jobs");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /jobs/:id should return a single job", async () => {
    const res = await request(app).get("/api/v1/jobs/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Test Job");
  });

  test("GET /jobs/:id should 404 if not found", async () => {
    const res = await request(app).get("/api/v1/jobs/999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("POST /jobs should create a new job", async () => {
    const res = await request(app).post("/api/v1/jobs").send({
      title: "New Job",
      description: "Cool job",
      location: "Nairobi",
      min_salary: 500,
      max_salary: 1000,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Job created");

    // verify in db
    const job = await db.get("SELECT * FROM jobs WHERE title = ?", ["New Job"]);
    expect(job).not.toBeUndefined();
  });

  test("PUT /jobs/:id should update a job", async () => {
    const res = await request(app).put("/api/v1/jobs/1").send({
      title: "Updated Job",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Job updated");

    const job = await db.get("SELECT * FROM jobs WHERE id = 1");
    expect(job.title).toBe("Updated Job");
  });

  test("DELETE /jobs/:id should delete a job", async () => {
    const res = await request(app).delete("/api/v1/jobs/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    const job = await db.get("SELECT * FROM jobs WHERE id = 1");
    expect(job).toBeUndefined();
  });
});
