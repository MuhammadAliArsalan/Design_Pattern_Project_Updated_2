import React from "react"
import { FiX } from "react-icons/fi"

export default function CourseModal({ courseData, onClose }) {
  if (!courseData) return null

  const { course, analytics } = courseData

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Course Analytics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Course Name</p>
                <p className="text-lg font-semibold text-gray-900">{course?.courseName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="text-lg font-semibold text-gray-900">
                  {course?.instructor?.firstName} {course?.instructor?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-lg font-semibold text-gray-900">PKR {course?.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-lg font-semibold ${
                  course?.status === "Published" ? "text-green-600" : "text-yellow-600"
                }`}>
                  {course?.status}
                </p>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">
                  {analytics?.totalStudents}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  PKR {analytics?.totalRevenue?.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics?.averageRating}/5
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-orange-600">
                  {analytics?.averageCompletion}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Reviews</h3>
            <p className="text-2xl font-bold text-gray-900">{analytics?.totalReviews}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
