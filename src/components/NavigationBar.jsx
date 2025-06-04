import React, { useState } from "react";
import ThemeController from "./ThemeController";
import axios from "axios";
import { Link } from "react-router-dom";

const NavigationBar = ({ user_id, onSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/food/search/${user_id}/${searchTerm}`,
        console.log(`Search URL: http://localhost:5000/api/food/search/${user_id}/${searchTerm}`)
      );
      onSearchResult(res.data);
    } catch (error) {
      console.error("Search failed:", error.response?.data || error.message);

    }
  };

  return (
    <section>
      <div className="navbar bg-base-100 shadow-sm dark:shadow-2xl">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">Frigora</Link>
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            Home
          </Link>
          <Link to="/storage" className="btn btn-ghost normal-case text-xl">
            Storage
          </Link>
          <Link to="/Report" className="btn btn-ghost normal-case text-xl">
            Report
          </Link>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Food Name..."
            className="input input-bordered w-24 md:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") handleSearch();
            }}
          />
          <ThemeController />
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/login" className="justify-between">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavigationBar;
