import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import initDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(morgan("dev"));
app.use(bodyParser.json());

// Basic route
app.get("/", (req, res) => {
  res.send("ISCO Job Board API is running");
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server Error" });
});


export default app;

export const startServer = async () => {
  const db = await initDB();
  app.locals.db = db;
  const server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
  return server; // return the server instance so you can close it in tests
};
