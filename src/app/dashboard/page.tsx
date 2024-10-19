"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

function DashboardPage() {
  const [user, setUser] = useState({
    email: "",
  });
  const router = useRouter();

  const getProfile = async () => {
    const res = await axios.get("/api/auth/profile");
    setUser(res.data);
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser({ email: "" });
    router.push("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(user)}</pre>
      <button onClick={() => getProfile()}>Get Profile</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

export default DashboardPage;
