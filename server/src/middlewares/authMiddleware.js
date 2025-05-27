import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../utils/token.js";

const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  // check if the access token is not null/undefined
  if (!accessToken) {
    // check if the refresh token is not null/undefined
    if (!refreshToken)
      return res.status(401).json({ ok: false, message: "Unauthorized" });

    try {
      // verify the refresh token
      const data = await jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      // creating new tokens
      const newAccessToken = createAccessToken(data.userID);
      const newRefreshToken = createRefreshToken(data.userID);

      // sending the new tokens
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.setHeader("access-token", `Bearer ${newAccessToken}`);

      // saving the user ID in the request
      req.userID = data.userID;
      // passing the request to the next middleware
      return next();
    } catch (error) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
  }

  try {
    // verify the access token
    const data = await jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    // saving the user ID in the request
    req.userID = data.userID;
    // passing the request to the next middleware
    return next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
};

export default authMiddleware;
