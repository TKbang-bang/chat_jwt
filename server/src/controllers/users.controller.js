import { gettingAllUsers } from "../services/users.service.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await gettingAllUsers(req.userID);
    return res.json({ ok: true, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
