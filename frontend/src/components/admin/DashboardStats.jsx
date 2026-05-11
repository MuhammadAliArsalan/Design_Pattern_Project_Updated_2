import React from "react"
import { FiUsers, FiBook, FiList, FiDollarSign } from "react-icons/fi"

export default function DashboardStats({ stats, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No data available</p>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, bgColor }) => (
    <div className={`${bgColor} rounded-lg shadow p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
        </div>
        <Icon className="text-4xl opacity-30" />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FiUsers}
          title="Total Users"
          value={stats?.users?.total || 0}
          bgColor="bg-blue-500"
        />
        <StatCard
          icon={FiBook}
          title="Total Courses"
          value={stats?.courses?.total || 0}
          bgColor="bg-green-500"
        />
        <StatCard
          icon={FiList}
          title="Categories"
          value={stats?.categories || 0}
          bgColor="bg-purple-500"
        />
        {/* <StatCard
          icon={FiDollarSign}
          title="Total Revenue"
          value={`PKR ${(stats?.revenue?.total || 0).toLocaleString()}`}
          bgColor="bg-orange-500"
        /> */}
      </div>

      {/* User Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Students</span>
              <span className="font-bold text-blue-600">{stats?.users?.students || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Instructors</span>
              <span className="font-bold text-green-600">{stats?.users?.instructors || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Admins</span>
              <span className="font-bold text-purple-600">{stats?.users?.admins || 0}</span>
            </div>
          </div>
        </div>

        {/* Course Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Published</span>
              <span className="font-bold text-green-600">{stats?.courses?.published || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Drafts</span>
              <span className="font-bold text-yellow-600">{stats?.courses?.draft || 0}</span>
            </div>
          </div>
        </div>

        {/* Revenue Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Total Enrollments</span>
              <span className="font-bold text-blue-600">{stats?.enrollments || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              {/* <span className="text-gray-700">Avg per Course</span> */}
              {/* <span className="font-bold text-orange-600">PKR {(stats?.revenue?.average || 0).toLocaleString()}</span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
