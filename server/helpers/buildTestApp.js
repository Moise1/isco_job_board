// tests/testApp.js
import express from "express";
import initDB from "../config/db.js";
import * as jobController from "../controllers/jobController.js";
import * as applicationsControler from "../controllers/applicationController.js";

const buildTestApp = async () => {
  const app = express();
  app.use(express.json());

  const db = await initDB();
  app.locals.db = db;

  app.use((req, res, next) => {
    req.user = { id: 1, role: "app" }; 
    next();
  });

  // routes
  app.get("/api/v1/jobs", jobController.getAllJobs);
  app.get("/api/v1/jobs/:id", jobController.getJobById);
  app.post("/api/v1/jobs", jobController.createJob);
  app.put("/api/v1/jobs/:id", jobController.updateJob);
  app.delete("/api/v1/jobs/:id", jobController.deleteJob);


  app.post("/api/v1/applications", applicationsControler.applyForJob);
  app.get( "/api/v1/applications/:job_id", applicationsControler.getApplicationsByJobId);

  return app;
};

export default buildTestApp;
