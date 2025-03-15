"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import RepoTiles from "./components/RepoTiles";

export default function Home() {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");

  useEffect(() => {
    const fetchRepos = async () => {
      if (!session?.accessToken) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch repositories.");

        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError("Unable to fetch repositories. Please try again.");
        console.error("Error fetching repos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [session]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen text-gray-400 animate-pulse">Loading session...</div>;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 text-lg">
        Please sign in to view your repositories.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center text-white p-6">
      {/* Welcome Section */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 w-full shadow-md">
          <h1 className="text-xl font-semibold text-gray-200">Welcome, {session.user?.username}!</h1>
          <p className="text-sm text-gray-400">Your GitHub repositories:</p>
        </div>
      </div>

      {/* Repository Tiles */}
      <div className="w-full max-w-5xl mt-6">
        <RepoTiles repos={repos} loading={loading} />
      </div>
    </div>
  );
}
