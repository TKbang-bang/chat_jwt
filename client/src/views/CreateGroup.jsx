import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupPassword, setGroupPassword] = useState("");
  const navigate = useNavigate();

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/creategroup", {
        groupName,
        groupDescription,
        groupPassword,
      });
      if (!res.data.ok) throw new Error(res.data.message);

      navigate("/");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleCreateGroup}>
      <h1>CreateGroup</h1>
      <input
        type="text"
        placeholder="Group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Group description"
        value={groupDescription}
        onChange={(e) => setGroupDescription(e.target.value)}
      />
      <input
        type="password"
        placeholder="Group password"
        value={groupPassword}
        onChange={(e) => setGroupPassword(e.target.value)}
      />
      <button type="submit">Create Group</button>
    </form>
  );
}

export default CreateGroup;
