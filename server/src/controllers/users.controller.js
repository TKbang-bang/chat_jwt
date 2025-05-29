import {
  gettingAllUsers,
  gettingUserMessages,
} from "../services/users.service.js";

export const getAllUsers = async (req, res) => {
  try {
    // getting all users except the current user
    const users = await gettingAllUsers(req.userID);
    // sending the response
    return res.json({ ok: true, users });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

export const getUserMessages = async (req, res) => {
  // user id from the client params
  const { userId } = req.params;
  try {
    // getting the user messages
    const userMessages = await gettingUserMessages(userId, req.userID);
    // sending the response
    return res.json({
      ok: true,
      user: userMessages.user,
      messages: userMessages.messages,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
