import pool from "../db/pool.js";

export const gettingAllUsers = async (userID) => {
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE user_id != ?", [
      userID,
    ]);
    return users;
  } catch (error) {
    throw new Error(error);
  }
};
