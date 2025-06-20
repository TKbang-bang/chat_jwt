import pool from "../db/pool.js";
import bcrypt from "bcrypt";

export const gettingUserByEmail = async (email) => {
  try {
    // getting the user by email
    const [user] = await pool.query(
      "SELECT * FROM users WHERE user_email = ?",
      [email]
    );

    // returning the user
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const creatingUser = async (name, email, password) => {
  try {
    // creating the user id
    const userId = crypto.randomUUID();
    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating the user
    const [user] = await pool.query(
      "INSERT INTO users (user_id, user_name, user_email, user_password) VALUES (?, ?, ?, ?)",
      [userId, name, email, hashedPassword]
    );

    if (user.affectedRows === 0)
      return { ok: false, message: "Error creating user" };

    // returning the user
    return { ok: true };
  } catch (error) {
    throw new Error(error);
  }
};
