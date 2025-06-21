import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("/api/dashboard")
      .then(res => setMsg(res.data.message))
      .catch(() => setMsg("Not authorized"));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>{msg}</div>
    </div>
  );
}