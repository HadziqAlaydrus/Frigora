"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StorageCard = ({ selectedCategory = null }) => {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  // Ambil user ID dari token
  useEffect(() => {
    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id;
      } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
      }
    };

    const uid = getUserIdFromToken();
    if (!uid) {
      console.warn("User not logged in or token not found.");
    }
    setUserId(uid);
  }, []);

  // Ambil data dari localStorage atau dari API
  useEffect(() => {
    if (!userId) return;

    const storedResults = localStorage.getItem("search_results");
    if (storedResults) {
      setItems(JSON.parse(storedResults));
      setIsSearch(true);

      // Clear setelah digunakan agar tidak stay terus
      localStorage.removeItem("search_results");
      localStorage.removeItem("search_term");
    } else {
      const fetchItems = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/food/user/${userId}`);
          setItems(res.data);
          setIsSearch(false);
        } catch (error) {
          console.error("Failed fetching food items:", error);
        }
      };
      fetchItems();
    }
  }, [userId]);

  // Filter berdasarkan kategori (jika dipilih)
  const displayItems = items.filter(
    (item) => !selectedCategory || item.category === selectedCategory
  );

  // Handle hapus data
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Apakah kamu yakin ingin menghapus item ini?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/food/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Gagal menghapus item.");
    }
  };

  // Handle edit data
  const handleEdit = (id) => {
    navigate(`/update/${id}`);
  };

  // Tampilan jika belum login
  if (!userId) {
    return (
      <div className="text-center text-gray-500 py-10">
        Silakan login terlebih dahulu untuk melihat data penyimpanan.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {displayItems.length > 0 ? (
        displayItems.map((item) => (
          <div
            key={item.id}
            className="card bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-200 hover:shadow-lg dark:hover:shadow-gray-900/40"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{item.name}</h2>
            <div className="space-y-1.5 text-sm">
              <p className="flex justify-between text-gray-600 dark:text-gray-300">
                <span className="font-medium">Category:</span>
                <span>{item.category}</span>
              </p>
              <p className="flex justify-between text-gray-600 dark:text-gray-300">
                <span className="font-medium">Quantity:</span>
                <span>{item.quantity} {item.unit}</span>
              </p>
              <p className="flex justify-between text-gray-600 dark:text-gray-300">
                <span className="font-medium">Location:</span>
                <span>{item.location}</span>
              </p>
              <p className="flex justify-between text-gray-600 dark:text-gray-300">
                <span className="font-medium">Expiration Date:</span>
                <span>{item.expired_date ? new Date(item.expired_date).toLocaleDateString() : "-"}</span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(item.id)}
                className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
          {isSearch
            ? "Tidak ditemukan hasil untuk pencarian tersebut."
            : "Belum ada makanan yang disimpan. Tambahkan sekarang!"}
        </div>
      )}
    </section>
  );
};

export default StorageCard;
