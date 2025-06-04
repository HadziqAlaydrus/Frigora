const Category = () => {
  const categories = [
    { name: "Protein", icon: "🥩" },
    { name: "Vegetables", icon: "🥬" },
    { name: "Fruits", icon: "🍎" },
    { name: "Fast Food", icon: "🍔" },
    { name: "Frozen Food", icon: "🧊" },
  ]

  return (
    <div className="w-full py-3 ">
      <div className="flex gap-2 overflow-x-auto pb-2 px-2">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex-shrink-0 min-w-[80px] bg-white dark:bg-gray-800 rounded-md shadow-sm hover:shadow transition-shadow cursor-pointer group p-2 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center">
              <div className="text-xl mb-1 group-hover:scale-105 transition-transform">{category.icon}</div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category
