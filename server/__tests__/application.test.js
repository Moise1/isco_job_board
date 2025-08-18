// __tests__/application.test.js
import request from "supertest";
import buildTestApp from "../helpers/buildTestApp.js";
import initDB from "../config/db.js";
import fs from "fs";

let app;
let db;

beforeAll(async () => {
  if (fs.existsSync("./database_test.sqlite")) {
    fs.unlinkSync("./database_test.sqlite");
  }

  db = await initDB();
  app = await buildTestApp();

  // schema
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

    CREATE TABLE applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      job_id INTEGER,
      cover_letter TEXT,
      cv_link TEXT,
      status TEXT,
      applied_at TIMESTAMP
    );
  `);

  // seed user + job
  await db.run(
    `INSERT INTO users (first_name, last_name, email, password, role) 
     VALUES('Admin','User','admin.user@jobconnekt.com','hashed','admin')`
  );

  await db.run(
    `INSERT INTO users (first_name, last_name, email, password, role) 
     VALUES ('Alice','Mugenzi','alice@test.com','hashed','applicant') `
  );

  await db.run(
    `INSERT INTO jobs (title, description, location, min_salary, max_salary, created_by)
     VALUES ('Test Job','Desc','Kigali',1000,2000,1)`
  );
});

afterAll(async () => {
  await db.close();
});

describe("Applications API", () => {
  test("POST /applications should create an application", async () => {

    const authRes = await request(app).post("/api/v1/auth/login").send({
      email: "alice@test.com",
      password: "XoViJFj2vl@", // match seeded hash
    });

    const userToken = authRes.body.token;

    const res = await request(app)
      .post("/api/v1/applications")
      .set("Authorization", `Bearer ${userToken}`) // 👈 use Alice
      .send({
        job_id: 1,
        cover_letter: "I am very interested",
        cv_link: "http://cv.com/alice",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(
      "message",
      "Application submitted successfully"
    );

    const appRow = await db.get("SELECT * FROM applications WHERE job_id = 1");

    expect(appRow.cover_letter).toBe("I am very interested");
  });

  test("POST /applications should 404 if job not found", async () => {
    const res = await request(app).post("/api/v1/applications").send({
      job_id: 999,
      cover_letter: "Invalid",
      cv_link: "http://cv.com/alice",
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Job not found");
  });

  test("POST /applications should 400 if validation fails", async () => {
    const res = await request(app).post("/api/v1/applications").send({
      job_id: 1,
      // missing cover_letter & cv_link
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("GET /:job_id should return applications for a job", async () => {
    const res = await request(app).get("/api/v1/applications/1");
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const appRow = res.body[0];
    expect(appRow).toHaveProperty("first_name", "Admin");
    expect(appRow).toHaveProperty("email", "admin.user@jobconnekt.com");
  });
});
