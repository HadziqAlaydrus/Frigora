"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const ReportCard = () => {
  const [userId, setUserId] = useState(null)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
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
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const filterByDate = () => {
    const { from, to } = dateRange
    if (!from || !to) {
      showNotification("error", "Invalid Filter", "Please fill in both start and end date range.")
      return
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.created_at)
      return itemDate >= fromDate && itemDate <= toDate
    })

    setFilteredData(filtered)
  }

  const getStatus = (expiredDateStr) => {
    if (!expiredDateStr) return { text: "-", color: "text-gray-500 dark:text-gray-400" }

    const expiredDate = new Date(expiredDateStr)
    const today = new Date()
    const daysLeft = Math.ceil((expiredDate - today) / (1000 * 60 * 60 * 24))

    if (expiredDate < today) return { text: "Expired", color: "text-red-600 dark:text-red-400" }
    if (daysLeft <= 7) return { text: "Near Expiry", color: "text-yellow-600 dark:text-yellow-400" }
    return { text: "Good", color: "text-green-600 dark:text-green-400" }
  }

  const exportToPDF = async () => {
    if (filteredData.length === 0) {
      showNotification("error", "No Data", "No data to export. Please filter data first.")
      return
    }

    setIsExporting(true)
    try {
      const doc = new jsPDF()

      // Colors
      const primaryColor = [59, 130, 246] // Blue
      const secondaryColor = [147, 51, 234] // Purple
      const textColor = [31, 41, 55] // Gray-800
      const lightGray = [243, 244, 246] // Gray-100

      // Header Section
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 35, "F")

      // Title
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("FOOD STORAGE REPORT", 105, 15, { align: "center" })

      // Subtitle
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("Food Storage Management Report", 105, 25, { align: "center" })

      // Report Info Section
      doc.setTextColor(...textColor)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const currentDate = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      doc.text(`Print Date: ${currentDate}`, 14, 45)
      doc.text(
        `Period: ${new Date(dateRange.from).toLocaleDateString("en-US")} - ${new Date(dateRange.to).toLocaleDateString("en-US")}`,
        14,
        52,
      )
      doc.text(`Total Data: ${filteredData.length} items`, 14, 59)

      // Summary Statistics
      const totalItems = filteredData.length
      const goodItems = filteredData.filter((item) => getStatus(item.expired_date).text === "Good").length
      const nearExpiry = filteredData.filter((item) => getStatus(item.expired_date).text === "Near Expiry").length
      const expired = filteredData.filter((item) => getStatus(item.expired_date).text === "Expired").length

      // Summary Box
      doc.setFillColor(...lightGray)
      doc.rect(14, 70, 182, 25, "F")
      doc.setDrawColor(200, 200, 200)
      doc.rect(14, 70, 182, 25, "S")

      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...textColor)
      doc.text("DATA SUMMARY", 20, 80)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.text(`• Good Condition: ${goodItems} items`, 20, 87)
      doc.text(`• Near Expiry: ${nearExpiry} items`, 70, 87)
      doc.text(`• Expired: ${expired} items`, 130, 87)

      // Table
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
        startY: 105,
        head: [["No", "Food Name", "Category", "Quantity", "Location", "Expiry Date", "Created", "Status"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3,
          valign: "middle",
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 12 }, // No
          1: { cellWidth: 35 }, // Name
          2: { halign: "center", cellWidth: 25 }, // Category
          3: { halign: "center", cellWidth: 20 }, // Quantity
          4: { halign: "center", cellWidth: 25 }, // Location
          5: { halign: "center", cellWidth: 25 }, // Expiry
          6: { halign: "center", cellWidth: 25 }, // Created
          7: { halign: "center", cellWidth: 23 }, // Status
        },
        didParseCell: (data) => {
          // Color coding for status column
          if (data.column.index === 7) {
            const status = data.cell.text[0]
            if (status === "Expired") {
              data.cell.styles.textColor = [220, 38, 38] // Red
              data.cell.styles.fontStyle = "bold"
            } else if (status === "Near Expiry") {
              data.cell.styles.textColor = [217, 119, 6] // Orange
              data.cell.styles.fontStyle = "bold"
            } else if (status === "Good") {
              data.cell.styles.textColor = [22, 163, 74] // Green
              data.cell.styles.fontStyle = "bold"
            }
          }
        },
        margin: { left: 14, right: 14 },
        tableWidth: "auto",
      })

      // Footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        // Footer line
        doc.setDrawColor(...primaryColor)
        doc.setLineWidth(0.5)
        doc.line(14, 285, 196, 285)

        // Footer text
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.setFont("helvetica", "normal")
        doc.text("Generated by Food Storage Management System", 14, 292)
        doc.text(`Page ${i} of ${pageCount}`, 196, 292, { align: "right" })

        // Company info (optional)
        doc.text("© 2025 Frigora - Food Storage Assistant", 105, 292, { align: "center" })
      }

      // Save with better filename
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

  return (
    <>
      {/* Notification Popup */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div
            className={`max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl border-l-4 ${
              notification.type === "success"
                ? "border-green-500"
                : notification.type === "error"
                  ? "border-red-500"
                  : "border-blue-500"
            } p-4`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : notification.type === "error" ? (
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Food Storage Report</h1>
                <p className="text-blue-100 opacity-90">Analyze food data based on specific periods</p>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Period</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={filterByDate}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                      <span>Filter</span>
                    </>
                  )}
                </button>
                <button
                  onClick={resetFilter}
                  disabled={isLoading}
                  className="px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <button
                  onClick={exportToPDF}
                  disabled={filteredData.length === 0 || isExporting}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Export PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {filteredData.length > 0 ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Items</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{filteredData.length}</p>
                      </div>
                      <div className="text-2xl">📦</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">Good Condition</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {filteredData.filter((item) => getStatus(item.expired_date).text === "Good").length}
                        </p>
                      </div>
                      <div className="text-2xl">✅</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Near Expiry</p>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                          {filteredData.filter((item) => getStatus(item.expired_date).text === "Near Expiry").length}
                        </p>
                      </div>
                      <div className="text-2xl">⚠️</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">Expired</p>
                        <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                          {filteredData.filter((item) => getStatus(item.expired_date).text === "Expired").length}
                        </p>
                      </div>
                      <div className="text-2xl">🗑️</div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Expiry Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {filteredData.map((item, index) => {
                          const status = getStatus(item.expired_date)
                          return (
                            <tr
                              key={item.id}
                              className={index % 2 === 0 ? "bg-white dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {item.quantity} {item.unit}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {item.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {item.expired_date ? formatDate(item.expired_date) : "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {formatDate(item.created_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    status.text === "Expired"
                                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                      : status.text === "Near Expiry"
                                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                        : status.text === "Good"
                                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                  }`}
                                >
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
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-4xl">📊</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {data.length === 0 ? "No Data Available" : "No Filter Applied"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {data.length === 0
                    ? "No food data has been stored yet."
                    : "Select a date range and click Filter to view the report."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportCard
