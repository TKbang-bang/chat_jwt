import pool from "../db/pool.js";

export const gettingAllUsers = async (userID) => {
  try {
    // getting all users except the current user
    const [users] = await pool.query("SELECT * FROM users WHERE user_id != ?", [
      userID,
    ]);
    // sending the response
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

export const gettingUserMessages = async (userId, myId) => {
  try {
    // getting the user
    const [user] = await pool.query(
      "SELECT user_id, user_name, user_profile FROM users WHERE user_id = ?",
      [userId]
    );

    // getting the messages
    const [messages] = await pool.query(
      "SELECT * FROM users_messages WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?) ORDER BY created_at ASC",
      [userId, myId, myId, userId]
    );

    // sending the user and messages
    return { user: user[0], messages };
  } catch (error) {
    throw new Error(error);
  }
};
