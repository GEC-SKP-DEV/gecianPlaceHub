"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { signOut, getAuth, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            className="border text-white border-blue-300 rounded-full p-2 hover:bg-blue-500 transition"
            onClick={() => router.push("https://gecian-hub.netlify.app/")}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <Link href="/">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white tracking-tight hover:opacity-90 transition-opacity">
                Placement Portal
              </h1>
              <p className="text-xs text-blue-100">Gecian Institute of Technology</p>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="flex items-center space-x-2 group"
              >
                <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-white group-hover:text-blue-100 transition">
                  {user.displayName || user.email || "User"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="px-5 py-2 rounded-full bg-white text-blue-600 font-medium text-sm hover:bg-blue-50 transition shadow-md">
                Login
              </button>
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
