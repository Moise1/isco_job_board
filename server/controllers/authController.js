import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const db = req.app.locals.db;

  const {
    first_name,
    last_name,
    role = "applicant",
    email,
    password,
  } = req.body;

  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long and contain letters, numbers, and symbols",
    });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.run(
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [first_name, last_name, email, hashed, role]
    );

    const insertedUser = await db.get("SELECT * FROM users WHERE id = ?", [
      result.lastID,
    ]);

    // Create tokens
    const accessToken = jwt.sign(
      {
        id: insertedUser.id,
        role: insertedUser.role,
        first_name: insertedUser.first_name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: insertedUser.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );


    res.status(201).json({
      message: "Success",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(400).json({ error: "Email already exists" });
  }
};


export const login = async (req, res) => {
  const db = req.app.locals.db;
  const { email, password } = req.body;

  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

  
    // Access token (15 minutes)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role, first_name: user.first_name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Refresh token (1 day/24 hours)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

  
      res.json({
        message: 'Success',
        accessToken,
        refreshToken
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};