"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";

const Navbar = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-900 text-gray-100 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* App Name */}
        <Link href="/" className="text-xl font-bold text-blue-400">
          Aether AI
        </Link>

        {/* Auth Controls */}
        <div className="relative">
          {session ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                <FiUser className="text-lg" />
                <span className="hidden sm:inline">{session.user?.username}</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg">
                  <button
                    onClick={() => signOut()}
                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <FiLogIn /> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
