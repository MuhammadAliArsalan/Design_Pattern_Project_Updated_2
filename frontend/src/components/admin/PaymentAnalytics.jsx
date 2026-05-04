import React, { useEffect, useState } from "react"
import { getPaymentAnalytics } from "../../services/operations/adminAPI"

export default function PaymentAnalytics({ token }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      fetchAnalytics()
    }
  }, [token])

  if (!token) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-700 text-lg font-semibold mb-3">Admin access required</p>
        <p className="text-gray-500">Login first to load payment analytics.</p>
      </div>
    )
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    const result = await getPaymentAnalytics(token)
    if (result) {
      setAnalytics(result)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-4xl font-bold text-green-600 mb-2">
            PKR {analytics.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">All time</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Total Transactions</p>
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {analytics.totalTransactions}
          </p>
          <p className="text-xs text-gray-500">Course enrollments</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Average Transaction</p>
          <p className="text-4xl font-bold text-orange-600 mb-2">
            PKR {analytics.averageTransactionValue}
          </p>
          <p className="text-xs text-gray-500">Per enrollment</p>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Courses</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Course Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Enrollments</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analytics.topCourses.map((course, index) => {
                const percentage = ((course.revenue / analytics.totalRevenue) * 100).toFixed(2)
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{course.courseName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.enrollments}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      PKR {course.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-sm text-gray-700">
                Average revenue per course is PKR {(analytics.totalRevenue / (analytics.topCourses.length || 1)).toLocaleString()}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-sm text-gray-700">
                Top course contributes {((analytics.topCourses[0]?.revenue / analytics.totalRevenue) * 100).toFixed(2)}% of total revenue
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-sm text-gray-700">
                Average students per course: {Math.round(analytics.totalTransactions / (analytics.topCourses.length || 1))}
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Total Revenue Generated</span>
              <span className="font-bold text-green-600">PKR {analytics.totalRevenue.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Total Enrollments</span>
              <span className="font-bold text-green-600">{analytics.totalTransactions}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Courses Listed</span>
              <span className="font-bold text-green-600">{analytics.topCourses.length}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
