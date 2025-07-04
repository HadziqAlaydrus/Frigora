"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../alert-toast.css";

const StorageCard = ({ selectedCategory = null }) => {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [hasShownNotification, setHasShownNotification] = useState(false);
  const navigate = useNavigate();

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

  const checkExpiryAndNotify = (items) => {
    if (hasShownNotification || items.length === 0) return;

    const today = dayjs();
    const inSevenDays = today.add(7, "day");
    const almost = [];
    const expired = [];

    items.forEach((item) => {
      if (!item.expired_date) return;

      const expDate = dayjs(item.expired_date);

      if (expDate.isBefore(today, "day")) {
        expired.push(item.name);
      } else if (expDate.isBefore(inSevenDays, "day")) {
        almost.push(item.name);
      }
    });

    if (expired.length > 0) {
      toast.error(
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5"></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-red-200 dark:text-red-200 mb-1">
              Expired Items
            </div>
            <div className="text-sm text-red-200 dark:text-red-200">
              <span className="font-medium">{expired.length} item(s)</span> have expired:
            </div>
            <div className="text-xs text-red-200 dark:text-red-200 mt-1 font-medium">
              {expired.slice(0, 3).join(", ")}
              {expired.length > 3 && ` and ${expired.length - 3} more`}
            </div>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 12000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }

    if (almost.length > 0) {
      toast.warn(
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5"></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-yellow-200 dark:text-yellow-200 mb-1">
              Expiry Warning
            </div>
            <div className="text-sm text-yellow-200 dark:text-yellow-200">
              <span className="font-medium">{almost.length} item(s)</span> are about to expire:
            </div>
            <div className="text-xs text-yellow-200 dark:text-yellow-200 mt-1 font-medium">
              {almost.slice(0, 3).join(", ")}
              {almost.length > 3 && ` and ${almost.length - 3} more`}
            </div>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }

    if (almost.length === 0 && expired.length === 0 && items.length > 0) {
      toast.success(
        <div className="flex items-start space-x-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-green-200 dark:text-green-200 mb-1">
              All Items Are Safe
            </div>
            <div className="text-sm text-green-200 dark:text-green-200">
              No items are expired or close to expiring.
            </div>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }

    setHasShownNotification(true);
  };

  const getExpiryStatus = (expiredDateStr) => {
    if (!expiredDateStr)
      return {
        text: "None",
        color: "text-gray-500 dark:text-gray-400",
        bgColor: "bg-gray-100 dark:bg-gray-700",
      };

    const expiredDate = new Date(expiredDateStr);
    const today = new Date();
    const daysLeft = Math.ceil((expiredDate - today) / (1000 * 60 * 60 * 24));

    if (expiredDate < today) {
      return {
        text: "Expired",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: "🗑️",
      };
    }
    if (daysLeft <= 7) {
      return {
        text: `${daysLeft} day(s) left`,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        icon: "⚠️",
      };
    }
    return {
      text: "Safe",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      icon: "✅",
    };
  };

  useEffect(() => {
    if (!userId) return;

    const storedResults = localStorage.getItem("search_results");
    if (storedResults) {
      const searchResults = JSON.parse(storedResults);
      setItems(searchResults);
      setIsSearch(true);
      localStorage.removeItem("search_results");
      localStorage.removeItem("search_term");

      setTimeout(() => checkExpiryAndNotify(searchResults), 1000);
    } else {
      const fetchItems = async () => {
        try {
          const res = await axios.get(
            `https://backend-frigora.vercel.app/api/food/user/${userId}`
          );
          setItems(res.data);
          setIsSearch(false);
          setTimeout(() => checkExpiryAndNotify(res.data), 1000);
        } catch (error) {
          console.error("Failed fetching food items:", error);
          toast.error("Failed to load food data", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      };

      fetchItems();
    }
  }, [userId]);

  const displayItems = items.filter(
    (item) => !selectedCategory || item.category === selectedCategory
  );

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`https://backend-frigora.vercel.app/api/food/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/update/${id}`);
  };

  if (!userId) {
    return (
      <div className="text-center text-gray-500 py-10">
        Please log in first to view storage data.
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          zIndex: 9999,
        }}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {displayItems.length > 0 ? (
          displayItems.map((item) => {
            const expiryStatus = getExpiryStatus(item.expired_date);
            return (
              <div
                key={item.id}
                className="card bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-4 border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/40 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {item.name}
                  </h2>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.bgColor} ${expiryStatus.color} flex items-center space-x-1`}
                  >
                    <span>{expiryStatus.icon}</span>
                    <span>{expiryStatus.text}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Category:
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-xs font-medium">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Quantity:</span>
                    <span className="font-semibold">
                      {item.quantity} {item.unit}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Location:</span>
                    <span>{item.location}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Expiration Date:</span>
                    <span>
                      {item.expired_date
                        ? new Date(item.expired_date).toLocaleDateString("en-GB")
                        : "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="px-3 py-2 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 font-medium flex items-center space-x-1"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-2 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 font-medium flex items-center space-x-1"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">{isSearch ? "🔍" : "📦"}</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isSearch ? "No Results Found" : "No Data Yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isSearch
                ? "No matching items found for your search."
                : "No stored food yet. Add something now!"}
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default StorageCard;
