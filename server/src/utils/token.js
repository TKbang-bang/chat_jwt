import jwt from "jsonwebtoken";

export const createAccessToken = (userID) => {
  // creating the access token
  return jwt.sign({ userID }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userID) => {
  // creating the refresh token
  return jwt.sign({ userID }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
