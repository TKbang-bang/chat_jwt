import jwt from "jsonwebtoken";

export const createAccessToken = (userID) => {
  return jwt.sign({ userID }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userID) => {
  return jwt.sign({ userID }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
