"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!session?.accessToken) return;

      try {
        const response = await fetch("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchRepos();
  }, [session]);

  // Show loading state while checking session status
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Redirect to sign-in page if the user is not authenticated
  if (!session) {
    return <p>Please sign in to view your repositories.</p>;
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
      <h2>Your Repositories:</h2>
      {repos.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
        <ul>
          {repos.map((repo: any) => (
            <li key={repo.id}>
              <strong>{repo.name}</strong> - {repo.private ? "🔒 Private" : "🌎 Public"}
            </li>
          ))}
        </ul>
        <p>{session.accessToken}</p></>
      )}
    </div>
  );
}
