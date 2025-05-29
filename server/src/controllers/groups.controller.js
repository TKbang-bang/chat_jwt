import {
  creatingGroup,
  gettingGroupMessages,
} from "../services/group.service.js";

// create group
export const createGroup = async (req, res) => {
  try {
    // credentials from the client
    const { groupName, groupDescription, groupPassword } = req.body;

    // creating the group
    const result = await creatingGroup(
      groupName,
      groupDescription,
      groupPassword,
      req.userID
    );

    if (!result.ok)
      return res
        .status(result.status)
        .json({ ok: false, message: result.message });

    // sending the response
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

// get group messages
export const getGroupMessages = async (req, res) => {
  try {
    // getting the group messages
    const result = await gettingGroupMessages(req.params.groupId);

    // sending the response
    return res.json({
      ok: true,
      messages: result.messages,
      group: result.group,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
