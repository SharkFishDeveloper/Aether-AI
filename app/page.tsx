"use client"
import { signIn } from "next-auth/react";
import React from "react";
import Dashboard from "./dashboard/page";

const Home = () => {
  return (
    <div>
      <div>Home</div>
      <button onClick={() => signIn("github")}>Login</button>
      <Dashboard/>
    </div>
  );
};

export default Home;
