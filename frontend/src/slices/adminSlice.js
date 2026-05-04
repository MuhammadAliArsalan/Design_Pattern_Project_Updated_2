import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  dashboardStats: null,
  users: [],
  courses: [],
  categories: [],
  loading: false,
  error: null,
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setCourses: (state, action) => {
      state.courses = action.payload
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    resetAdmin: (state) => {
      state.dashboardStats = null
      state.users = []
      state.courses = []
      state.categories = []
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setDashboardStats,
  setUsers,
  setCourses,
  setCategories,
  setLoading,
  setError,
  resetAdmin,
} = adminSlice.actions

export default adminSlice.reducer
