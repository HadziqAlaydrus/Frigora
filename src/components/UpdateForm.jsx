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

  const categories = ["Protein", "Vegetables", "Fruits", "Fast Food", "Frozen Food"]
  const units = ["kg", "gram", "liter", "ml", "pcs", "pack", "botol", "kaleng", "sachet", "bungkus"]

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id")
    if (storedUserId) setUserId(parseInt(storedUserId))

    const fetchData = async () => {
      try {
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
        alert("Gagal memuat data makanan.")
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
    try {
      await axios.put(`http://localhost:5000/api/food/${id}`, {
        name: formData.foodName,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        expired_date: formData.expiredDate || null,
      })
      alert("Data berhasil diperbarui!")
      navigate("/storage") // redirect ke halaman storage
    } catch (err) {
      console.error("Gagal update:", err)
      alert("Gagal memperbarui data.")
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
              <h2 className="text-xl font-semibold text-gray-900">Form Edit Makanan</h2>
              <p className="text-sm text-gray-600">Ubah informasi makanan yang disimpan</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Food Name */}
            <div className="space-y-2">
              <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">
                Nama Makanan <span className="text-red-500">*</span>
              </label>
              <input
                id="foodName"
                type="text"
                value={formData.foodName}
                onChange={(e) => handleInputChange("foodName", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Jumlah <span className="text-red-500">*</span>
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
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

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Lokasi Penyimpanan <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Expired Date */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Update Data
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md"
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

export default UpdateForm
