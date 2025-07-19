"use client"

const Category = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    { name: "Protein", icon: "🥩" },
    { name: "Vegetables", icon: "🥬" },
    { name: "Fruits", icon: "🍎" },
    { name: "Fast Food", icon: "🍔" },
    { name: "Frozen Food", icon: "🧊" },
  ]

  return (
    <div className="w-full py-3">
      <div
        className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 pl-4 pr-4 scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((category, index) => {
          const isActive = category.name === selectedCategory
          return (
            <div
              key={index}
              onClick={() => onCategorySelect(category.name)}
              className={`flex-shrink-0 min-w-[80px] w-20 sm:w-24 md:w-28 lg:w-32 p-2 sm:p-3 rounded-lg shadow-sm cursor-pointer group border transition-all duration-200 hover:shadow-md active:scale-95 ${
                isActive
                  ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:bg-blue-800 dark:border-blue-400 shadow-blue-200/50 dark:shadow-blue-900/30"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-center space-y-1">
                <div className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200">
                  {category.icon}
                </div>
                <p className="text-xs sm:text-sm font-medium truncate leading-tight">{category.name}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Category
