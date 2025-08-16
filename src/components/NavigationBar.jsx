"use client";

import { useState, useEffect } from "react";
import ThemeController from "./ThemeController";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isStoragePage = location.pathname.toLowerCase().startsWith("/storage");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("user_name");
      const storedTerm = localStorage.getItem("search_term");

      if (name) setUserName(name);
      if (storedTerm) {
        setSearchTerm(storedTerm);
        setIsSearchActive(true);
      }

      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
      }
    } catch (err) {
      console.error("Token decode error:", err);
    }
  }, []);

  const handleSearch = async () => {
    if (!userId) return alert("Silakan login terlebih dahulu.");
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const url = `https://backend-frigora.vercel.app/api/food/search/${userId}/${searchTerm}`;
      const res = await axios.get(url);
      localStorage.setItem("search_results", JSON.stringify(res.data));
      localStorage.setItem("search_term", searchTerm);
      setIsSearchActive(true);
      if (!location.pathname.includes("storage")) {
        navigate("/storage");
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Search failed:", error.response?.data || error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetSearch = () => {
    localStorage.removeItem("search_term");
    localStorage.removeItem("search_results");
    setSearchTerm("");
    setIsSearchActive(false);
    if (!location.pathname.includes("storage")) {
      navigate("/storage");
    } else {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  const isActiveRoute = (path) => location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo + Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>Frigora</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2">
              {["/", "/Storage", "/Report"].map((path, i) => (
                <Link
                  key={i}
                  to={path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActiveRoute(path)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {path === "/" ? "Home" : path.replace("/", "")}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section: Search + Theme + User */}
          <div className="flex items-center space-x-3">
            {/* Search Desktop */}
            {isStoragePage && (
              <div className="hidden sm:flex relative items-center shrink-0 min-w-[16rem]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search Food..."
                  className="w-64 shrink-0 pl-10 pr-20 py-2.5 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  {isSearchActive && (
                    <button
                      onClick={handleResetSearch}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  )}
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Theme */}
            <ThemeController />

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="rounded-full w-8 h-8 overflow-hidden"
              >
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="avatar"
                  className="w-8 h-8 object-cover rounded-full"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  {userName ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Selamat datang!
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {userName}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Home
            </Link>
            <Link
              to="/storage"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Storage
            </Link>
            <Link
              to="/report"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Report
            </Link>

            {isStoragePage && (
              <div className="px-4">
                <input
                  type="text"
                  placeholder="Cari makanan..."
                  className="mt-2 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default NavigationBar;
