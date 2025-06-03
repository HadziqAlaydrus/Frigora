import React, { useEffect, useState } from "react";
import axios from "axios";

const StorageCard = () => {
    const [items, setItems] = useState([]);
    const userId = 1;

    useEffect(() => {
        const fetchItems = async () => {
            try{
                const res = await axios.get(`http://localhost:5000/api/food/user/${userId}`);
                setItems(res.data);
            } catch (error) {
                console.log("Failed fetching Food   :", error);
            }
        };
        fetchItems();
    }, [userId])

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {items.map ((item) => (
            <div key={item.id} className="card bg-white rounded-lg shadow-md p-4 dark:text-black">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">Category: {item.category}</p>
                <p className="text-gray-600">Quantity: {item.quantity} {item.unit}</p>
                <p className="text-gray-600">Location: {item.location}</p>
                <p className="text-gray-600">Expired Date: {item.expired_date}</p>
            </div>
        ))}
    </section>
  )
}

export default StorageCard
