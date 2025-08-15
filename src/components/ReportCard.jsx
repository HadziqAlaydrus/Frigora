"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {
  FiCalendar,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiPackage,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiBarChart,
  FiFileText,
  FiX,
  FiCheck,
  FiInfo,
} from "react-icons/fi"

const ReportCard = () => {
  const [userId, setUserId] = useState(null)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [statusFilter, setStatusFilter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUserId(payload.id)
      } catch (err) {
        console.error("Token error:", err)
      }
    }
  }, [])

  const showNotification = (type, title, message) => {
    setNotification({ type, title, message })
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(`https://backend-frigora.vercel.app/api/report/${userId}`)
        setData(res.data.data)
        setFilteredData([])
      } catch (err) {
        console.error("Failed to fetch report:", err)
        showNotification("error", "Fetch Failed", "Failed to load report data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const getStatus = (expiredDateStr) => {
    if (!expiredDateStr)
      return { text: "-", color: "text-gray-500 dark:text-gray-400", bgColor: "bg-gray-100 dark:bg-gray-700" }

    const expiredDate = new Date(expiredDateStr)
    const today = new Date()
    const daysLeft = Math.ceil((expiredDate - today) / (1000 * 60 * 60 * 24))

    if (expiredDate < today) {
      return {
        text: "Expired",
        color: "text-red-700 dark:text-red-300",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        icon: FiXCircle,
      }
    }
    if (daysLeft <= 7) {
      return {
        text: "Near Expiry",
        color: "text-yellow-700 dark:text-yellow-300",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        icon: FiAlertTriangle,
      }
    }
    return {
      text: "Good",
      color: "text-green-700 dark:text-green-300",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      icon: FiCheckCircle,
    }
  }

  const filterByDate = () => {
    const { from, to } = dateRange
    if (!from || !to) {
      showNotification("error", "Invalid Filter", "Please fill in both start and end date range.")
      return
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)

    let filtered = data.filter((item) => {
      const itemDate = new Date(item.created_at)
      return itemDate >= fromDate && itemDate <= toDate
    })

    if (statusFilter) {
      filtered = filtered.filter((item) => getStatus(item.expired_date).text === statusFilter)
    }

    setFilteredData(filtered)
    showNotification("success", "Filter Applied", `Found ${filtered.length} items matching your criteria.`)
  }

  const exportToPDF = async () => {
    if (filteredData.length === 0) {
      showNotification("error", "No Data", "No data to export. Please filter data first.")
      return
    }

    setIsExporting(true)
    try {
      const doc = new jsPDF()
      const primaryColor = [59, 130, 246]
      const textColor = [31, 41, 55]

      // Header
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 35, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("FOOD STORAGE REPORT", 105, 15, { align: "center" })
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("Food Storage Management Report", 105, 25, { align: "center" })

      // Report info
      doc.setTextColor(...textColor)
      doc.setFontSize(10)
      const currentDate = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      doc.text(`Print Date: ${currentDate}`, 14, 45)
      doc.text(
        `Period: ${new Date(dateRange.from).toLocaleDateString("en-US")} - ${new Date(dateRange.to).toLocaleDateString(
          "en-US",
        )}`,
        14,
        52,
      )
      doc.text(`Total Data: ${filteredData.length} items`, 14, 59)

      // Table data
      const tableData = filteredData.map((item, index) => [
        (index + 1).toString(),
        item.name,
        item.category,
        `${item.quantity} ${item.unit}`,
        item.location,
        item.expired_date ? new Date(item.expired_date).toLocaleDateString("en-US") : "-",
        new Date(item.created_at).toLocaleDateString("en-US"),
        getStatus(item.expired_date).text,
      ])

      autoTable(doc, {
        startY: 70,
        head: [["No", "Food Name", "Category", "Quantity", "Location", "Expiry Date", "Created", "Status"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 8,
        },
      })

      const filename = `Food_Report_${dateRange.from.replace(/-/g, "")}_${dateRange.to.replace(/-/g, "")}.pdf`
      doc.save(filename)

      showNotification("success", "Export Successful!", `PDF successfully downloaded: ${filename}`)
    } catch (error) {
      console.error("Error exporting PDF:", error)
      showNotification("error", "Export Failed", "Failed to export PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const resetFilter = () => {
    setDateRange({ from: "", to: "" })
    setStatusFilter("")
    setFilteredData([])
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const closeNotification = () => {
    setNotification(null)
  }

  const summaryStats = {
    total: filteredData.length,
    good: filteredData.filter((item) => getStatus(item.expired_date).text === "Good").length,
    nearExpiry: filteredData.filter((item) => getStatus(item.expired_date).text === "Near Expiry").length,
    expired: filteredData.filter((item) => getStatus(item.expired_date).text === "Expired").length,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Notification */}
          {notification && (
            <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
              <div
                className={`max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl border-l-4 p-4 ${
                  notification.type === "success"
                    ? "border-green-500"
                    : notification.type === "error"
                      ? "border-red-500"
                      : "border-blue-500"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {notification.type === "success" ? (
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    ) : notification.type === "error" ? (
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <h3
                      className={`text-sm font-semibold ${
                        notification.type === "success"
                          ? "text-green-800 dark:text-green-200"
                          : notification.type === "error"
                            ? "text-red-800 dark:text-red-200"
                            : "text-blue-800 dark:text-blue-200"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                  </div>
                  <button
                    onClick={closeNotification}
                    className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-6 lg:p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FiBarChart className="w-7 h-7 lg:w-9 lg:h-9" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Food Storage Report</h1>
                <p className="text-blue-100 opacity-90 text-base lg:text-lg">
                  Analyze food data based on specific periods
                </p>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center space-x-3 mb-6">
              <FiFilter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Filter Options</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiPackage className="inline w-4 h-4 mr-1" />
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  disabled={!dateRange.from || !dateRange.to}
                  className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Status</option>
                  <option value="Good">Good Condition</option>
                  <option value="Near Expiry">Near Expiry</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                <button
                  onClick={filterByDate}
                  disabled={isLoading || !dateRange.from || !dateRange.to}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <FiFilter className="w-4 h-4" />
                      <span>Filter</span>
                    </>
                  )}
                </button>
                <button
                  onClick={resetFilter}
                  disabled={isLoading}
                  className="px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Export Button */}
              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  onClick={exportToPDF}
                  disabled={filteredData.length === 0 || isExporting}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <FiDownload className="w-4 h-4" />
                      <span>Export PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            {filteredData.length > 0 ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 lg:p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Items</p>
                        <p className="text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
                          {summaryStats.total}
                        </p>
                      </div>
                      <FiPackage className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 lg:p-6 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">Good Condition</p>
                        <p className="text-2xl lg:text-3xl font-bold text-green-900 dark:text-green-100">
                          {summaryStats.good}
                        </p>
                      </div>
                      <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 lg:p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Near Expiry</p>
                        <p className="text-2xl lg:text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                          {summaryStats.nearExpiry}
                        </p>
                      </div>
                      <FiAlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 p-4 lg:p-6 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">Expired</p>
                        <p className="text-2xl lg:text-3xl font-bold text-red-900 dark:text-red-100">
                          {summaryStats.expired}
                        </p>
                      </div>
                      <FiXCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Food Name
                          </th>
                          <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Expiry Date
                          </th>
                          <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {filteredData.map((item, index) => {
                          const status = getStatus(item.expired_date)
                          const StatusIcon = status.icon
                          return (
                            <tr
                              key={item.id}
                              className={index % 2 === 0 ? "bg-white dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}
                            >
                              <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                                <div className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                                  {item.name}
                                </div>
                              </td>
                              <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-sm lg:text-base text-gray-900 dark:text-gray-300">
                                {item.quantity} {item.unit}
                              </td>
                              <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-sm lg:text-base text-gray-900 dark:text-gray-300">
                                {item.location}
                              </td>
                              <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-sm lg:text-base text-gray-900 dark:text-gray-300">
                                {item.expired_date ? formatDate(item.expired_date) : "-"}
                              </td>
                              <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-sm lg:text-base text-gray-900 dark:text-gray-300">
                                {formatDate(item.created_at)}
                              </td>
                              <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-semibold ${status.bgColor} ${status.color}`}
                                >
                                  {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                                  {status.text}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 lg:py-16">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                  <FiFileText className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 lg:mb-4">
                  {data.length === 0 ? "No Data Available" : "No Filter Applied"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg">
                  {data.length === 0
                    ? "No food data has been stored yet."
                    : "Select a date range and click Filter to view the report."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportCard
