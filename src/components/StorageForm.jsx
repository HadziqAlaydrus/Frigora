"use client"

import { useState, useEffect } from "react"
import axios from "axios"

// Ambil userId dari token
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.id
  } catch (err) {
    console.error("Invalid token:", err)
    return null
  }
}

const StorageForm = () => {
  const [formData, setFormData] = useState({
    foodName: "",
    category: "",
    quantity: "",
    unit: "",
    location: "",
    expiredDate: "",
  })

  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const id = getUserIdFromToken()
    if (id) {
      setUserId(id)
    } else {
      alert("User belum login.")
    }
  }, [])

  const categories = [
    "Protein","Vegetables","Fruits","Fast Food","Frozen Food"
  ]

  const units = ["kg", "gram", "liter", "ml", "pcs", "pack", "botol", "kaleng", "sachet", "bungkus"]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userId) {
      alert("User ID tidak ditemukan. Pastikan sudah login.")
      return
    }

    try {
      const response = await axios.post("http://localhost:5000/api/food", {
        users_id: userId,
        name: formData.foodName,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        expired_date: formData.expiredDate || null,
      })

      console.log("Data berhasil disimpan:", response.data)
      alert("Data berhasil disimpan!")
      handleReset()
    } catch (error) {
      console.error("Gagal menyimpan data:", error)
      alert("Gagal menyimpan data. Silakan cek kembali.")
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
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Form Penyimpanan Makanan</h2>
              <p className="text-sm text-gray-600">Masukkan informasi makanan yang akan disimpan</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">
                Nama Makanan <span className="text-red-500">*</span>
              </label>
              <input
                id="foodName"
                type="text"
                placeholder="Masukkan nama makanan"
                value={formData.foodName}
                onChange={(e) => handleInputChange("foodName", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="">Pilih kategori makanan</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
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

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Lokasi Penyimpanan <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                placeholder="Contoh: Kulkas, Freezer, Pantry, dll"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="expiredDate" className="block text-sm font-medium text-gray-700">
                Tanggal Kedaluwarsa
              </label>
              <input
                id="expiredDate"
                type="date"
                min={today}
                value={formData.expiredDate}
                onChange={(e) => handleInputChange("expiredDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Simpan Data
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StorageForm
