"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const UpdateForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    foodName: "",
    category: "",
    quantity: "",
    unit: "",
    location: "",
    expiredDate: "",
  })
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)

  const categories = ["Protein", "Vegetables", "Fruits", "Fast Food", "Frozen Food"]
  const units = ["kg", "gram", "liter", "ml", "pcs", "pack", "botol", "kaleng", "sachet", "bungkus"]

  const showNotification = (type, title, message) => {
    setNotification({ type, title, message })
    setTimeout(() => setNotification(null), 5000) // Auto hide after 5 seconds
  }

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id")
    if (storedUserId) setUserId(Number.parseInt(storedUserId))

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(`http://localhost:5000/api/food/${id}`)
        const data = res.data

        setFormData({
          foodName: data.name,
          category: data.category,
          quantity: data.quantity,
          unit: data.unit,
          location: data.location,
          expiredDate: data.expired_date ? data.expired_date.split("T")[0] : "",
        })
      } catch (err) {
        console.error("Gagal memuat data:", err)
        showNotification("error", "Gagal Memuat Data", "Tidak dapat memuat data makanan. Silakan coba lagi.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axios.put(`http://localhost:5000/api/food/${id}`, {
        name: formData.foodName,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        expired_date: formData.expiredDate || null,
      })

      showNotification("success", "Berhasil!", "Data makanan berhasil diperbarui.")

      // Delay navigation to show notification
      setTimeout(() => {
        navigate("/storage")
      }, 2000)
    } catch (err) {
      console.error("Gagal update:", err)
      showNotification("error", "Gagal Update", "Terjadi kesalahan saat memperbarui data. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      foodName: "",
      category: "",
      quantity: "",
      unit: "",
      location: "",
      expiredDate: "",
    })
    showNotification("info", "Form Direset", "Semua field telah dikosongkan.")
  }

  const handleCancel = () => {
    navigate("/storage")
  }

  const closeNotification = () => {
    setNotification(null)
  }

  const today = new Date().toISOString().split("T")[0]

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Memuat data makanan...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 relative">
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

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 px-6 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Form Edit Makanan</h2>
              <p className="text-blue-100 opacity-90">Ubah informasi makanan yang disimpan</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Makanan */}
            <div className="space-y-2">
              <label htmlFor="foodName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nama Makanan <span className="text-red-500">*</span>
              </label>
              <input
                id="foodName"
                type="text"
                placeholder="Masukkan nama makanan"
                value={formData.foodName}
                onChange={(e) => handleInputChange("foodName", e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                <option value="">Pilih kategori makanan</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah & Satuan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Jumlah <span className="text-red-500">*</span>
                </label>
                <input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Pilih satuan</option>
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lokasi Penyimpanan */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Lokasi Penyimpanan <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                placeholder="Contoh: Kulkas, Freezer, Pantry, dll"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Tanggal Kedaluwarsa */}
            <div className="space-y-2">
              <label htmlFor="expiredDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Kedaluwarsa
                <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">(Opsional)</span>
              </label>
              <input
                id="expiredDate"
                type="date"
                min={today}
                value={formData.expiredDate}
                onChange={(e) => handleInputChange("expiredDate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Memperbarui...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Update Data</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Reset Form</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Batal</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateForm
