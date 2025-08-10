import { applicationSchema } from "../validators/applicationValidator.js";

export const applyForJob = async (req, res) => {
  try {
    // Validate input
    const { error } = applicationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const db = req.app.locals.db;
    const { job_id, cover_letter, cv_link } = req.body;
    const user_id = req.user.id; // from auth middleware

    // Check job exists
    const job = await db.get("SELECT id FROM jobs WHERE id = ?", [job_id]);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Insert application
    await db.run(
      `INSERT INTO applications (user_id, job_id, cover_letter, cv_link, status, applied_at) 
       VALUES (?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`,
      [user_id, job_id, cover_letter || "", cv_link]
    );

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getApplicationsByJobId = async (req, res) => {
  const db = req.app.locals.db;
  const apps = await db.all(
    `SELECT applications.*, users.first_name, users.last_name, users.email
     FROM applications
     JOIN users ON users.id = applications.user_id
     WHERE job_id = ?`,
    [req.params.job_id]
  );

  res.json(apps);   
};
