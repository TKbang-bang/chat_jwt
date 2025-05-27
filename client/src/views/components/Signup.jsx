import React from "react";
import { useState } from "react";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/auth/signup`, {
        name,
        email,
        password,
      });

      if (!res.data.ok) throw new Error(res.data.message);
      setName("");
      setEmail("");
      setPassword("");

      alert(res.data.message);
    } catch (error) {
      console.log(error.response.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign up</button>
    </form>
  );
}

export default Signup;
