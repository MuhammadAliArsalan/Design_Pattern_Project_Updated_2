/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import {
  FiEye,
  FiTrash2,
  FiSearch,
  FiFilter,
} from "react-icons/fi"

import {
  getAllCoursesAdmin,
  updateCourseStatus,
  deleteCourseAdmin,
  getCourseAnalytics,
} from "../../services/operations/adminAPI"

import CourseModal from "./CourseModal"

export default function CourseManagement({ token }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)

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
    }, 400)

    return () => clearTimeout(t)
  }, [search])

  const fetchCourses = async () => {
    setLoading(true)
    const res = await getAllCoursesAdmin(token, {
      status: filter !== "All" ? filter : undefined,
      page: pagination.page,
      limit: pagination.limit,
      search: debouncedSearch || undefined,
    })

    if (res) {
      setCourses(res.courses || [])
      setPagination((p) => ({
        ...p,
        total: res.pagination?.total || 0,
        pages: res.pagination?.pages || 1,
      }))
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!token) return
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, pagination.page, debouncedSearch, token])

  const handleAction = async (fn) => {
    const res = await fn()
    if (res !== false) fetchCourses()
  }

  const handleAnalytics = async (id) => {
    const data = await getCourseAnalytics(token, id)
    if (data) {
      setSelected(data)
      setShowModal(true)
    }
  }

  if (!token) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-700 text-lg font-semibold mb-3">Admin access required</p>
        <p className="text-gray-500">Login first to load course management data.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full pl-10 border p-2 rounded"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option>All</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="h-64 flex justify-center items-center">
            <div className="animate-spin w-10 h-10 border-b-2 border-blue-600 rounded-full" />
          </div>
        ) : courses.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No courses found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Course</th>
                <th className="p-3">Instructor</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Enrollments</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{c.courseName}</td>
                  <td className="p-3">{c.instructor?.firstName} {c.instructor?.lastName}</td>
                  <td className="p-3">PKR {c.price}</td>
                  <td className="p-3">
                    <select
                      value={c.status}
                      onChange={(e) => handleAction(() => updateCourseStatus(token, c._id, e.target.value))}
                    >
                      <option>Published</option>
                      <option>Draft</option>
                      <option>Archived</option>
                    </select>
                  </td>
                  <td className="p-3">{c.studentsEnrolled?.length || 0}</td>
                  <td className="p-3 flex gap-3">
                    <button onClick={() => handleAnalytics(c._id)}>
                      <FiEye />
                    </button>
                    <button onClick={() => handleAction(() => deleteCourseAdmin(token, c._id))}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between text-sm">
        <p>Showing {courses.length} of {pagination.total}</p>
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

      {showModal && (
        <CourseModal courseData={selected} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
