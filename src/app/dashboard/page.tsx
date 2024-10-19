"use client";

import axios from "axios";
import { useState } from "react";

function DashboardPage() {
  const [user, setUser] = useState({
    email: "",
  });

  const getProfile = async () => {
    const res = await axios.get("/api/auth");
    setUser(res.data);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(user)}</pre>
      <button onClick={() => getProfile()}>Get Profile</button>
    </div>
  );
}

export default DashboardPage;
