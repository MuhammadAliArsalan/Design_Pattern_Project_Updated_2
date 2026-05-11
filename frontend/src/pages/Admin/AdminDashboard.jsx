import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getDashboardStats } from "../../services/operations/adminAPI"
import AdminSidebar from "../../components/admin/AdminSidebar"
import DashboardStats from "../../components/admin/DashboardStats"
import UserManagement from "../../components/admin/UserManagement"
import CourseManagement from "../../components/admin/CourseManagement"
import PaymentAnalytics from "../../components/admin/PaymentAnalytics"

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === "dashboard" && token && user?.accountType === "Admin") {
      fetchDashboardStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user, token])

  const fetchDashboardStats = async () => {
    setLoading(true)
    const stats = await getDashboardStats(token)
    if (stats) {
      setDashboardStats(stats)
    }
    setLoading(false)
  }

  if (user?.accountType && user?.accountType !== "Admin") {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need admin privileges to access this dashboard.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white mt-2">Manage users, courses, and platform analytics</p>
          </div>

          {/* Content based on active tab */}
          {activeTab === "dashboard" && (
            <DashboardStats stats={dashboardStats} loading={loading} />
          )}
          {activeTab === "users" && <UserManagement token={token} />}
          {activeTab === "courses" && <CourseManagement token={token} />}
          {/* {activeTab === "analytics" && <PaymentAnalytics token={token} />} */}
        </div>
      </div>
    </div>
  )
}
