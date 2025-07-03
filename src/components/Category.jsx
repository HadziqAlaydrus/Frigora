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
      <div className="flex gap-3 overflow-x-auto pb-2 px-3 scrollbar-hide scroll-smooth">
        {categories.map((category, index) => {
          const isActive = category.name === selectedCategory;
          return (
            <div
              key={index}
              onClick={() => onCategorySelect(category.name)}
              className={`flex-shrink-0 w-24 sm:w-28 md:w-32 p-3 rounded-lg shadow-sm cursor-pointer group border transition-all duration-200 ${
                isActive
                  ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-800 dark:border-blue-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="text-center space-y-1">
                <div className="text-2xl group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <p className="text-xs sm:text-sm font-medium truncate">
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
