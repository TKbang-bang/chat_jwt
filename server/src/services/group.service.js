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

    // creating the group id
    const groupID = crypto.randomUUID();

    // password validation
    if (groupPassword != "") {
      // hashing the password
      const hashedPassword = await bcrypt.hash(groupPassword, 10);

      // creating the group
      const [result] = await pool.query(
        "INSERT INTO group_chats (group_id, group_name, group_description, group_password, group_creator_id) VALUES (?, ?, ?, ?, ?)",
        [groupID, groupName, groupDescription, hashedPassword, userID]
      );

      if (result.affectedRows === 0)
        return { ok: false, message: "Error creating group", status: 500 };

      // sending the response
      return { ok: true };
    } else {
      // creating the group
      const [result] = await pool.query(
        "INSERT INTO group_chats (group_id, group_name, group_description, group_creator_id) VALUES (?, ?, ?, ?)",
        [groupID, groupName, groupDescription, userID]
      );

      if (result.affectedRows === 0)
        return { ok: false, message: "Error creating group", status: 500 };

      // sending the response
      return { ok: true };
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const gettingGroupMessages = async (groupID) => {
  try {
    // getting the group messages
    const [messages] = await pool.query(
      "SELECT u.user_id, u.user_name, u.user_profile, g.message_id, g.from_user_id, g.group_id, g.message_content, g.created_at FROM group_messages g JOIN users u ON g.from_user_id = u.user_id WHERE g.group_id = ?",
      [groupID]
    );

    // getting the group details
    const [group] = await pool.query(
      "SELECT * FROM group_chats WHERE group_id = ?",
      [groupID]
    );

    // sending the response
    return { messages, group: group[0] };
  } catch (error) {
    throw new Error(error);
  }
};
