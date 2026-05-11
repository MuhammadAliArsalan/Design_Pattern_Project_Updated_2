/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
} from "react-icons/fi"

import {
  getAllUsers,
  getUserDetailsAdmin,
  toggleUserStatus,
  deleteUserAdmin,
} from "../../services/operations/adminAPI"

import UserModal from "./UserModal"
import toast from "react-hot-toast"

export default function UserManagement({ token }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  })

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPagination((p) => ({ ...p, page: 1 }))
    }, 500)

    return () => clearTimeout(t)
  }, [search])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const result = await getAllUsers(token, {
        accountType: filter !== "All" ? filter : undefined,
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
      })

      if (result) {
        setUsers(result.users || [])
        setPagination((prev) => ({
          ...prev,
          total: result.pagination?.total || 0,
          pages: result.pagination?.pages || 1,
        }))
      }
    } catch {
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, pagination.page, debouncedSearch, token])

  const handleViewDetails = async (userId) => {
    const data = await getUserDetailsAdmin(token, userId)
    if (data) {
      setSelectedUser(data)
      setShowModal(true)
    }
  }

  const handleAction = async (fn) => {
    const res = await fn()
    if (res !== false) fetchUsers()
  }

  if (!token) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-700 text-lg font-semibold mb-3">Admin access required</p>
        <p className="text-gray-500">Login first to load user management data.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              setPagination((p) => ({ ...p, page: 1 }))
            }}
            className="border px-3 py-2 rounded-lg"
          >
            <option>All</option>
            <option>Student</option>
            <option>Instructor</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-b-2 border-blue-600 rounded-full" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No users found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.firstName} {u.lastName}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded bg-gray-100">{u.accountType}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded ${u.active ? "bg-green-100" : "bg-red-100"}`}>
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3">
                    <button onClick={() => handleViewDetails(u._id)}>
                      <FiEye />
                    </button>
                    <button onClick={() => handleAction(() => toggleUserStatus(token, u._id))}>
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleAction(() => deleteUserAdmin(token, u._id))}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-white">
        <p>Showing {users.length} of {pagination.total}</p>
        <div className="flex gap-2">
          <button
            disabled={pagination.page === 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Prev
          </button>
          <span>{pagination.page} / {pagination.pages}</span>
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && <UserModal user={selectedUser} onClose={() => setShowModal(false)} />}
    </div>
  )
}
