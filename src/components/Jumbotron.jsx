const Jumbotron = () => {
  return (
    <section
      className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm"></div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
            Welcome to Frigora
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Keep track of your food, reduce waste, and never forget what's in
            your fridge again. Frigora helps you manage your kitchen inventory
            efficiently.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 px-2">
          {/* Item */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">🥬</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                  Add Food Items
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Track new groceries & leftovers
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">⏰</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                  Expiring Soon
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Prioritize items to use first
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">🍳</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                  Recipe Ideas
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Based on your inventory
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Jumbotron;
