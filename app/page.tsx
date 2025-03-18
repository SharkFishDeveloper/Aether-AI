"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import RepoTiles from "./components/RepoTiles";
import { RiDiscordFill } from "react-icons/ri";
import axios from "axios";
import { BACKEND_URL } from "@/util/Backend_url";

export default function Home() {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discordId, setDiscordId] = useState("");
  const [discordConnect, setDiscordConnect] = useState<boolean>(false);

  useEffect(() => {
    const storedDiscordId = localStorage.getItem("discord_id");
    setDiscordConnect(!!storedDiscordId); // Convert to boolean
  }, []);
  
  const [showModal, setShowModal] = useState(false);
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

        if (!response.ok) return alert("Failed to fetch repositories.")

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


  const handleDiscordClick = async ()=>{
    try {
      if(localStorage.getItem('discord_id')){
        return alert("Discord ID is already set");
      }
      if(discordId.length < 17)return alert("Discord ID is too short !! ")
      const usernameGithub = session?.user.username;
      if(!usernameGithub){
        return alert("Username not found");
      }
      const response = await axios.post(`/api/discord/add_discord_id`,{
        discordId,
        username:usernameGithub
      });

      if(response.data.status === 200){
        setDiscordConnect(true); // ✅ Corrected: Set to true
        localStorage.setItem('discord_id',"true");
      }
      
      window.open(
       "https://discord.com/oauth2/authorize?client_id=1350408211936710676",
        "_blank"        );
      const backend_url = BACKEND_URL || "http://localhost:4000";
      await new Promise(resolve => setTimeout(resolve, 45000));
     try {
      await axios.post(`${backend_url}/discord/authentication`,{discord_id:discordId,username:usernameGithub})
     } catch (error) {
      console.log(error)
     }

      return alert(response.data.message)

    } catch (error) {
      console.log(error)
      alert("Try again later")
    }finally{
      setShowModal(false);
    }
  }




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
        
        <div className="w-full max-w-5xl mt-6">
          <RepoTiles repos={repos} loading={loading} />
        </div>
      </div>
        
      {/* Connect with Discord Button */}
      {!discordConnect && !session.user.discordId && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl shadow-lg transition hover:bg-white/20 active:scale-95"
        >
          <RiDiscordFill size={24} className="text-blue-500" />
          Connect with Discord
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-gray-700 p-6 rounded-lg w-96 text-center shadow-xl">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Enter your Discord ID</h2>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring focus:ring-blue-500 outline-none"
              placeholder="e.g., username#1234"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={() => {
                  handleDiscordClick();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
