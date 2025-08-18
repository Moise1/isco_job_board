import request from "supertest";
import app from "../server.js"; 
import runMigrations from "../migrate.js";
import app, { startServer } from "../server.js";
let server;



const userData = {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    password: "password123$",
};


beforeAll(async () => {
  server = await startServer();
  process.env.NODE_ENV = "test"; // ensure test DB is used
  await runMigrations(); // create tables in test DB
  await app.locals.db.exec("DELETE FROM users");
    // await app.locals.db.exec("DELETE FROM jobs");
    // await app.locals.db.exec("DELETE FROM applications");

});

afterAll(async () => {
  await app.locals.db.close(); // close SQLite connection
  server.close(); // stop server
});

describe("Auth API", () => {


  it("should signup a new user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(userData);


    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should not signup the same user twice", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(userData);


    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Email already exists");
  });

    it("should login with correct credentials", async () => {
      
       
    const res = await request(app).post("/api/v1/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should not login with wrong password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: userData.email,
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  it("should not login with non-existing email", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "ghost@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });
});
