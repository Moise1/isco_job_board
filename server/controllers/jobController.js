import { createJobSchema, idParamSchema, updateJobSchema,  } from "../validators/jobValidator.js";

export const getAllJobs = async (req, res) => {
  const db = req.app.locals.db;
  const jobs = await db.all("SELECT * FROM jobs ORDER BY created_at DESC");
  res.json(jobs);
};

export const getJobById = async (req, res) => {
  const db = req.app.locals.db;
  const job = await db.get("SELECT * FROM jobs WHERE id = ?", [req.params.id]);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
};

export const createJob = async (req, res) => {
  try {
    // Validate request body
    const { error } = createJobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const db = req.app.locals.db;
    const { title, description, location, min_salary, max_salary } = req.body;

    await db.run(
      `INSERT INTO jobs (title, description, location, min_salary, max_salary, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, location, min_salary, max_salary, req.user.id]
    );

    res.status(201).json({ message: "Job created" });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { error } = updateJobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const db = req.app.locals.db;

    // Check if job exists
    const existingJob = await db.get("SELECT id FROM jobs WHERE id = ?", [
      req.params.id,
    ]);
    if (!existingJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Build dynamic query parts for fields provided
    const fields = [];
    const values = [];

    Object.entries(req.body).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    values.push(req.params.id);

    const sql = `UPDATE jobs SET ${fields.join(", ")} WHERE id = ?`;

    await db.run(sql, values);

    res.json({ message: "Job updated" });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteJob = async (req, res) => {
  try {
    // Validate id param
    const { error } = idParamSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const db = req.app.locals.db;
    const job = await db.get("SELECT id FROM jobs WHERE id = ?", [
      req.params.id,
    ]);

    if (!job) {
      return res.status(200).json({ message: "not found" });
    }

    await db.run("DELETE FROM jobs WHERE id = ?", [req.params.id]);

    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
