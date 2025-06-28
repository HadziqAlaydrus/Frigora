import React from "react";

const Category = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    { name: "Protein", icon: "🥩" },
    { name: "Vegetables", icon: "🥬" },
    { name: "Fruits", icon: "🍎" },
    { name: "Fast Food", icon: "🍔" },
    { name: "Frozen Food", icon: "🧊" },
  ];

  return (
    <div className="w-full py-3">
      <div className="flex gap-2 overflow-x-auto pb-2 px-2">
        {categories.map((category, index) => {
          const isActive = category.name === selectedCategory;
          return (
            <div
              key={index}
              onClick={() => onCategorySelect(category.name)}
              className={`flex-shrink-0 min-w-[80px] p-2 rounded-md shadow-sm cursor-pointer group border
                ${
                  isActive
                    ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-800 dark:border-blue-400"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }
              `}
            >
              <div className="text-center">
                <div className="text-xl mb-1 group-hover:scale-105 transition-transform">
                  {category.icon}
                </div>
                <p className="text-xs font-medium">
                  {category.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category;