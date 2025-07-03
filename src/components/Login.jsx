import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://backend-frigora.vercel.app/api/users/login", formData);

      // ✅ Simpan token dan nama user di localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_name", res.data.name);

      // ✅ Arahkan ke halaman storage
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="flex bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden mx-auto max-w-xs lg:max-w-3xl w-full transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center relative overflow-hidden"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/6e/eb/ce/6eebcee47105ff5b917370a167b6fce6.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
            <h2 className="text-xl font-bold mb-1">Keep Your Food Fresh</h2>
            <p className="text-xs opacity-80">
              Track and manage your food inventory with Frigora
            </p>
          </div>
        </div>

        <div className="w-full p-6 lg:w-1/2">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
              F
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              Login
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Join <span className="font-semibold italic">Frigora</span> and
              start managing your food inventory
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-xs font-medium mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 px-3 block w-full appearance-none transition text-sm placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-xs font-medium mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 px-3 block w-full appearance-none transition text-sm placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-600 dark:bg-blue-500 text-white font-medium py-2.5 px-4 w-full rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
