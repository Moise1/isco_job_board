import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {

    const db = req.app.locals.db;

    const {
        first_name,
        last_name,
        role,
        email,
        password
    } = req?.body;
    
   // Password validation
   const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    
    if (!passwordRegex.test(password)) {
       return res.status(400).json({
         error:
           "Password must be at least 8 characters long and contain letters, numbers, and symbols",
       });
    }
    
    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.run("INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)", [
        first_name,
        last_name,
        email,
        hashed,
        role,
        ]);
        res.status(201).json({ message: "User registered" });
    } catch (err) {
        console.log('error', err);
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
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Refresh token (1 day/24 hours)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie with 1-day expiration (in milliseconds)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

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