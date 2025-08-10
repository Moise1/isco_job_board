export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export const isApplicant = (req, res, next) => {
  if (req.user?.role !== "applicant") {
    return res.status(403).json({ error: "Applicant access required" });
  }
  next();
};
