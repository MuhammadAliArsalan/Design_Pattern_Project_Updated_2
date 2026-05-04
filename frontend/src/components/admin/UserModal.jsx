import React from "react"
import { FiX } from "react-icons/fi"

export default function UserModal({
  user,
  onClose,
  token,
  onUpdate,
  onApprove,
  onReject,
}) {
  if (!user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-900">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Account Type</p>
            <p className="text-lg font-semibold text-gray-900">{user.accountType}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-lg font-semibold ${user.active ? "text-green-600" : "text-red-600"}`}>
              {user.active ? "Active" : "Inactive"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Approval Status</p>
            <p className={`text-lg font-semibold ${user.approved ? "text-green-600" : "text-yellow-600"}`}>
              {user.approved ? "Approved" : "Pending"}
            </p>
          </div>

          {user.additionalDetails && (
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.additionalDetails.phoneNumber || "Not provided"}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600">Courses Enrolled</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.courses?.length || 0}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t space-y-2">
          {user.accountType === "Student" && (
            <button
              onClick={() => {
                onApprove(user._id)
                onClose()
              }}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Approve as Instructor
            </button>
          )}

          {user.accountType !== "Admin" && !user.approved && (
            <button
              onClick={() => {
                onReject(user._id)
                onClose()
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reject
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
