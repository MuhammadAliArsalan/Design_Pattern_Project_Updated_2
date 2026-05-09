import React from "react"
import { FiHome, FiUsers, FiBook, FiBarChart, FiLogOut } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "../../services/operations/authAPI"

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "users", label: "Users", icon: FiUsers },
    { id: "courses", label: "Courses", icon: FiBook },
    { id: "analytics", label: "Analytics", icon: FiBarChart },
  ]

  const handleLogout = () => {
    dispatch(logout(navigate))
  }

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen p-6">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">StudySync</h1>
        <p className="text-sm text-gray-600 mt-2">Admin Panel</p>
      </div>

      {/* Menu Items */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-8 pt-8 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
        >
          <FiLogOut className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
