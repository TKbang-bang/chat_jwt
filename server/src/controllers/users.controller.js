import {
  gettingAllUsers,
  gettingUserMessages,
} from "../services/users.service.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await gettingAllUsers(req.userID);
    return res.json({ ok: true, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

export const getUserMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const userMessages = await gettingUserMessages(userId, req.userID);
    return res.json({
      ok: true,
      user: userMessages.user,
      messages: userMessages.messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
