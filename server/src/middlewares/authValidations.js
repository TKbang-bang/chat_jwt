export const signupValidation = (req, res, next) => {
  // credentials from the client
  const { name, email, password } = req.body;

  // check if all fields are present
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ ok: false, message: "All fields are required" });
  }

  // name
  if (typeof name !== "string") {
    return res
      .status(400)
      .json({ ok: false, message: "Name must be a string" });
  }

  // email
  if (typeof email !== "string") {
    return res
      .status(400)
      .json({ ok: false, message: "Email must be a string" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ ok: false, message: "Email must be valid" });
  }

  // password
  if (typeof password !== "string") {
    return res
      .status(400)
      .json({ ok: false, message: "Password must be a string" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ ok: false, message: "Password must be at least 6 characters" });
  }

  // passing to the next middleware
  next();
};

export const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  // check if all fields are present
  if (!email || !password) {
    return res
      .status(400)
      .json({ ok: false, message: "All fields are required" });
  }

  // email
  if (typeof email !== "string") {
    return res
      .status(400)
      .json({ ok: false, message: "Email must be a string" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ ok: false, message: "Email must be valid" });
  }

  // password
  if (typeof password !== "string") {
    return res
      .status(400)
      .json({ ok: false, message: "Password must be a string" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ ok: false, message: "Password must be at least 6 characters" });
  }

  // passing to the next middleware
  next();
};
