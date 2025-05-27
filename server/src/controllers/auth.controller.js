import { creatingUser, gettingUserByEmail } from "../services/auth.service.js";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../utils/token.js";

export const signUp = async (req, res) => {
  // credentials from the client
  const { name, email, password } = req.body;
  try {
    // checking if the email is already in use
    const user = await gettingUserByEmail(email);
    if (user.length > 0)
      return res
        .status(409)
        .json({ ok: false, message: "Email already in use" });

    // creating the user
    const createUser = await creatingUser(name, email, password);

    if (!createUser.ok)
      return res.json({ ok: false, message: createUser.message });

    // sending the response
    return res.json({ ok: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  // credentials from the client
  const { email, password } = req.body;

  try {
    // checking if the email is already in use
    const user = await gettingUserByEmail(email);
    if (user.length === 0)
      return res.status(404).json({ ok: false, message: "User not found" });

    // checking if the password is correct
    const passwordMatch = await bcrypt.compare(password, user[0].user_password);
    if (!passwordMatch)
      return res.status(400).json({ ok: false, message: "Incorrect password" });

    // creating tokens
    const accessToken = createAccessToken(user[0].user_id);
    const refreshToken = createRefreshToken(user[0].user_id);

    // sending the tokens
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({ ok: true, accessToken });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, message: "Server error" });
  }
};
