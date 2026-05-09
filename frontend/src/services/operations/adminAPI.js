import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { adminEndpoints } from "../apis"

const {
  GET_DASHBOARD_STATS_API,
  GET_ALL_USERS_API,
  GET_USER_DETAILS_API,
  UPDATE_USER_ACCOUNT_TYPE_API,
  APPROVE_INSTRUCTOR_API,
  REJECT_INSTRUCTOR_API,
  TOGGLE_USER_STATUS_API,
  DELETE_USER_API,
  GET_USER_ENROLLMENTS_API,
  GET_ALL_COURSES_ADMIN_API,
  UPDATE_COURSE_STATUS_API,
  DELETE_COURSE_ADMIN_API,
  GET_COURSE_ANALYTICS_API,
  GET_ALL_CATEGORIES_API,
  DELETE_CATEGORY_API,
  GET_PAYMENT_ANALYTICS_API,
} = adminEndpoints

// ================= UTIL =================
// const buildUrl = (base, params) => {
//   const query = new URLSearchParams(params || {}).toString()
//   return query ? `${base}?${query}` : base
// }

const buildUrl = (base, params = {}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  )

  const query = new URLSearchParams(filteredParams).toString()

  return query ? `${base}?${query}` : base
}

// ================= DASHBOARD =================
export async function getDashboardStats(token) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("GET", GET_DASHBOARD_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.success) throw new Error(response.data.message)

    return response.data.data
  } catch (error) {
    toast.error("Could Not Get Dashboard Stats")
    return null
  } finally {
    toast.dismiss(toastId)
  }
}

// ================= USERS =================
export async function getAllUsers(token, params = {}) {
  const toastId = toast.loading("Loading...")
  try {
    const url = buildUrl(GET_ALL_USERS_API, params)

    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.success) throw new Error(response.data.message)

    return response.data.data
  } catch (error) {
    toast.error("Could Not Get Users")
    return null
  } finally {
    toast.dismiss(toastId)
  }
}

// 🔥 FIXED: THIS WAS YOUR ERROR SOURCE
export async function getUserDetailsAdmin(token, userId) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      `${GET_USER_DETAILS_API}/${userId}`,
      null,
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error(response.data.message)

    return response.data.data
  } catch (error) {
    toast.error("Could Not Get User Details")
    return null
  } finally {
    toast.dismiss(toastId)
  }
}

// ================= USER ACTIONS =================
export async function updateUserAccountType(token, userId, accountType) {
  try {
    const response = await apiConnector(
      "PUT",
      `${UPDATE_USER_ACCOUNT_TYPE_API}/${userId}/account-type`,
      { accountType },
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error()

    toast.success("Updated")
    return response.data.data
  } catch {
    toast.error("Failed")
    return null
  }
}

export async function approveInstructor(token, userId) {
  try {
    const response = await apiConnector(
      "PUT",
      `${APPROVE_INSTRUCTOR_API}/${userId}/approve-instructor`,
      {},
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error()

    toast.success("Approved")
    return response.data.data
  } catch {
    toast.error("Failed")
    return null
  }
}

export async function rejectInstructor(token, userId) {
  try {
    const response = await apiConnector(
      "PUT",
      `${REJECT_INSTRUCTOR_API}/${userId}/reject-instructor`,
      {},
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error()

    toast.success("Rejected")
    return response.data.data
  } catch {
    toast.error("Failed")
    return null
  }
}

export async function toggleUserStatus(token, userId) {
  try {
    const response = await apiConnector(
      "PUT",
      `${TOGGLE_USER_STATUS_API}/${userId}/toggle-status`,
      {},
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error()

    toast.success("Updated")
    return response.data.data
  } catch {
    toast.error("Failed")
    return null
  }
}

export async function deleteUserAdmin(token, userId) {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_USER_API}/${userId}`,
      null,
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error()

    toast.success("Deleted")
    return true
  } catch {
    toast.error("Failed")
    return false
  }
}

// ================= COURSES =================
export async function getAllCoursesAdmin(token, params = {}) {
  try {
    const url = buildUrl(GET_ALL_COURSES_ADMIN_API, params)

    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.success) throw new Error()

    return response.data.data
  } catch {
    toast.error("Could Not Get Courses")
    return null
  }
}

export async function updateCourseStatus(token, courseId, status) {
  try {
    const response = await apiConnector(
      "PUT",
      `${UPDATE_COURSE_STATUS_API}/${courseId}/status`,
      { status },
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error()

    toast.success("Updated")
    return response.data.data
  } catch {
    toast.error("Failed")
    return null
  }
}

export async function deleteCourseAdmin(token, courseId) {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_COURSE_ADMIN_API}/${courseId}`,
      null,
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error()

    toast.success("Deleted")
    return true
  } catch {
    toast.error("Failed")
    return false
  }
}

export async function getCourseAnalytics(token, courseId) {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_COURSE_ANALYTICS_API}/${courseId}/analytics`,
      null,
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error()

    return response.data.data
  } catch {
    toast.error("Failed")
    return null
  }
}

// ================= CATEGORIES =================
export async function getAllCategoriesAdmin(token) {
  try {
    const response = await apiConnector("GET", GET_ALL_CATEGORIES_API, null, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.success) throw new Error()

    return response.data.data
  } catch {
    toast.error("Failed")
    return null
  }
}

export async function deleteCategory(token, categoryId) {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_CATEGORY_API}/${categoryId}`,
      null,
      { Authorization: `Bearer ${token}` }
    )

    if (!response.data.success) throw new Error()

    toast.success("Deleted")
    return true
  } catch {
    toast.error("Failed")
    return false
  }
}

// ================= ANALYTICS =================
export async function getPaymentAnalytics(token) {
  try {
    const response = await apiConnector("GET", GET_PAYMENT_ANALYTICS_API, null, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.success) throw new Error()

    return response.data.data
  } catch {
    toast.error("Failed")
    return null
  }
}