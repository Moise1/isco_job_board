import initDB from "./config/db.js";
import bcrypt from "bcrypt";

const seedUsers = async (db) => {
  const users = [
    {
      first_name: "Admin",
      last_name: "User",
      email: "admin.user@jobconnekt.com",
      password: "XoViJFj2vl@",
      role: "admin",
    },
    {
      first_name: "Alice",
      last_name: "Mugenzi",
      email: "alice.mugenzi@gmail.com",
      password: "XoViJFj2vl@",
      role: "applicant",
    },
    {
      first_name: "John",
      last_name: "Ndoli",
      email: "john.ndoli@gmail.com",
      password: "XoViJFj2vl@",
      role: "applicant",
    },
    {
      first_name: "Claudine",
      last_name: "Uwase",
      email: "claudine.uwase@gmail.com",
      password: "XoViJFj2vl@",
      role: "applicant",
    },
    {
      first_name: "Patrick",
      last_name: "Nkurunziza",
      email: "patrick.nkurunziza@gmail.com",
      password: "XoViJFj2vl@",
      role: "applicant",
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await db.run(
      `INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [user.first_name, user.last_name, user.email, hashedPassword, user.role]
    );
  }

  console.log("✅ Seed users inserted successfully");
};

const seedJobs = async (db) => {
  const locations = [
    "Kigali, Rwanda",
    "Nairobi, Kenya",
    "Lagos, Nigeria",
    "Cape Town, South Africa",
    "London, United Kingdom",
    "New York, USA",
    "Toronto, Canada",
    "Sydney, Australia",
    "Tokyo, Japan",
    "Berlin, Germany",
    "Rio de Janeiro, Brazil",
    "Mumbai, India",
  ];

  const jobs = [
    {
      title: "2 House Helps",
      description: "We are looking for 5 national house helps",
      min_salary: 20000,
      max_salary: 40000,
    },
    {
      title: "Software Engineer",
      description: "Full-stack developer needed",
      min_salary: 150000,
      max_salary: 300000,
    },
    {
      title: "Graphic Designer",
      description: "Creative and detail-oriented",
      min_salary: 80000,
      max_salary: 150000,
    },
    {
      title: "Marketing Specialist",
      description: "Digital marketing expert",
      min_salary: 100000,
      max_salary: 200000,
    },
    {
      title: "Data Analyst",
      description: "Experience in SQL and Python",
      min_salary: 120000,
      max_salary: 250000,
    },
    {
      title: "Customer Support Agent",
      description: "Excellent communication skills",
      min_salary: 50000,
      max_salary: 100000,
    },
    {
      title: "Content Writer",
      description: "SEO-friendly writing skills",
      min_salary: 60000,
      max_salary: 120000,
    },
    {
      title: "Accountant",
      description: "Experience with QuickBooks",
      min_salary: 90000,
      max_salary: 180000,
    },
    {
      title: "Project Manager",
      description: "Strong organizational skills",
      min_salary: 150000,
      max_salary: 250000,
    },
    {
      title: "Cybersecurity Specialist",
      description: "Knowledge in penetration testing",
      min_salary: 200000,
      max_salary: 350000,
    },
  ];

  for (const job of jobs) {
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];
    await db.run(
      "INSERT INTO jobs (title, description, location, min_salary, max_salary, created_by) VALUES (?, ?, ?, ?, ?, ?)",
      [
        job.title,
        job.description,
        randomLocation,
        job.min_salary,
        job.max_salary,
        1, // created_by admin ID
      ]
    );
  }

  console.log("✅ Seed jobs inserted successfully");
};

const runSeed = async () => {
  const db = await initDB();

  await seedUsers(db); // wait until users are done
  await seedJobs(db); // then insert jobs

  console.log("🌱 Seeding completed!");
  process.exit(0);
};

runSeed();
