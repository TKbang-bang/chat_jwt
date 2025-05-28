import { creatingGroup } from "../services/group.service.js";

export const createGroup = async (req, res) => {
  try {
    const { groupName, groupDescription, groupPassword } = req.body;

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

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
