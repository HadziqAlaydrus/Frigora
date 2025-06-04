const Jumbotron = () => {
  return (
    <section
      className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm"></div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          {/* Welcome Message */}
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to Frigora
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-3 max-w-2xl mx-auto">
            Keep track of your food, reduce waste, and never forget what's in
            your fridge again. Frigora helps you manage your kitchen inventory
            efficiently.
          </p>
        </div>

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">🥬</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm">Add Food</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quick add items</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">⏰</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm">Expiring Soon</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Check alerts</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm">Shopping List</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">What to buy</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">🍳</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm">Recipes</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cook something</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Your Storage
              </h3>
              <span className="text-2xl">🏠</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Items
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  24
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Categories
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  5
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Expiring Soon
              </h3>
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  This Week
                </span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  3
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Next Week
                </span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  7
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Recent Activity
              </h3>
              <span className="text-2xl">📝</span>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Added <span className="font-medium">Milk</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Used <span className="font-medium">Eggs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Jumbotron;
