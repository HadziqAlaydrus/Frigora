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
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isStoragePage = location.pathname === "/storage";

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
    if (!userId) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    if (!searchTerm.trim()) return;

    setIsSearching(true);

    try {
      const url = `http://localhost:5000/api/food/search/${userId}/${searchTerm}`;
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

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>Frigora</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute("/")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Home
              </Link>

              <Link
                to="/storage"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute("/storage")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Storage
              </Link>

              <Link
                to="/Report"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute("/Report")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Report
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar Desktop (only in /storage) */}
            {isStoragePage && (
              <div className="hidden sm:flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari nama makanan..."
                    className="w-64 pl-10 pr-20 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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

                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    {isSearchActive && (
                      <button
                        onClick={handleResetSearch}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
            )}

            {/* Theme Controller */}
            <ThemeController />

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <img
                    alt="User Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {userName ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Selamat datang!</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userName}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (only in /storage) */}
        {isStoragePage && (
          <div className="sm:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama makanan..."
                className="w-full pl-10 pr-20 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown on click outside */}
      {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />}
    </nav>
  );
};

export default NavigationBar;
