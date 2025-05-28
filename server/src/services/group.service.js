import pool from "../db/pool.js";
import bcrypt from "bcrypt";

export const creatingGroup = async (
  groupName,
  groupDescription,
  groupPassword,
  userID
) => {
  try {
    // verifiying if the group name is already in use
    const [group] = await pool.query(
      "SELECT * FROM group_chats WHERE group_name = ?",
      [groupName]
    );

    if (group.length > 0)
      return { ok: false, message: "Group name already in use", status: 400 };

    // group id
    const groupID = crypto.randomUUID();
    // hashed password
    if (groupPassword != "") {
      const hashedPassword = await bcrypt.hash(groupPassword, 10);
      const [result] = await pool.query(
        "INSERT INTO group_chats (group_id, group_name, group_description, group_password, group_creator_id) VALUES (?, ?, ?, ?, ?)",
        [groupID, groupName, groupDescription, hashedPassword, userID]
      );

      if (result.affectedRows === 0)
        return { ok: false, message: "Error creating group", status: 500 };

      return { ok: true };
    } else {
      const [result] = await pool.query(
        "INSERT INTO group_chats (group_id, group_name, group_description, group_creator_id) VALUES (?, ?, ?, ?)",
        [groupID, groupName, groupDescription, userID]
      );

      if (result.affectedRows === 0)
        return { ok: false, message: "Error creating group", status: 500 };

      return { ok: true };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
