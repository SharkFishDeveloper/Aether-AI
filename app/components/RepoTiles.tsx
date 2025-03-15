"use client";

import { useState } from "react";
import { FiGithub } from "react-icons/fi";

type RepoType = {
  id: number;
  name: string;
};

export default function RepoTiles({ repos, loading }: { repos: RepoType[]; loading: boolean }) {
  const [currentPage, setCurrentPage] = useState(0);
  const reposPerPage = 5;
  const totalPages = Math.ceil(repos.length / reposPerPage);

  const startIndex = currentPage * reposPerPage;
  const displayedRepos = repos.slice(startIndex, startIndex + reposPerPage);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        {loading ? (
          <p className="text-gray-400 animate-pulse">Fetching repositories...</p>
        ) : repos.length === 0 ? (
          <p className="text-gray-400">No repositories found.</p>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {displayedRepos.map((repo, index) => (
              <div
                key={repo.id}
                className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg p-3 shadow-md flex flex-row items-center gap-3 transition-all duration-300 hover:shadow-xl hover:border-white/20 hover:scale-105 w-full h-[60px]"
              >
                <span className="text-gray-300 text-lg">{startIndex + index + 1}</span>
                <FiGithub className="text-gray-300 text-2xl" />
                <h3 className="text-sm font-medium text-gray-100 truncate">{repo.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`px-4 py-2 text-sm rounded-md transition ${
              currentPage === 0 ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:text-white"
            }`}
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className={`px-4 py-2 text-sm rounded-md transition ${
              currentPage === totalPages - 1 ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
