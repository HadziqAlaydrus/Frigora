"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const StorageCard = ({ searchResults }) => {
  const [items, setItems] = useState([])
  const userId = 1

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/food/user/${userId}`)
        setItems(res.data)
      } catch (error) {
        console.log("Failed fetching Food:", error)
      }
    }
    fetchItems()
  }, [userId])

  const displayItems = searchResults && searchResults.length > 0 ? searchResults : items

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {displayItems.length > 0 ? (
        displayItems.map((item) => (
          <div
            key={item.id}
            className="card bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-200 hover:shadow-lg dark:hover:shadow-gray-900/40"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{item.name}</h2>
            <div className="space-y-1.5">
              <p className="text-gray-600 dark:text-gray-300 text-sm flex justify-between">
                <span className="font-medium">Category:</span>
                <span className="text-gray-700 dark:text-gray-200">{item.category}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm flex justify-between">
                <span className="font-medium">Quantity:</span>
                <span className="text-gray-700 dark:text-gray-200">
                  {item.quantity} {item.unit}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm flex justify-between">
                <span className="font-medium">Location:</span>
                <span className="text-gray-700 dark:text-gray-200">{item.location}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm flex justify-between">
                <span className="font-medium">Expired Date:</span>
                <span className="text-gray-700 dark:text-gray-200">
                  {new Date(item.expired_date).toLocaleDateString()}
                </span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-2">
              <button className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                Edit
              </button>
              <button className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
          No items found. Add some food to your storage!
        </div>
      )}
    </section>
  )
}

export default StorageCard
