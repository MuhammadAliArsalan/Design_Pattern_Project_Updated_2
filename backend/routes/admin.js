const express = require('express');
const router = express.Router();

// Import admin controllers
const {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserAccountType,
  approveInstructor,
  rejectInstructor,
  toggleUserStatus,
  deleteUser,
  getAllCoursesAdmin,
  updateCourseStatus,
  deleteCourseAdmin,
  getCourseAnalytics,
  getAllCategories,
  deleteCategory,
  getPaymentAnalytics,
  getUserEnrollments,
} = require('../controllers/admin');

// Middleware
const { auth, isAdmin } = require('../middleware/auth');

// =====================================
//  DASHBOARD & STATISTICS
// =====================================

// Get dashboard statistics
router.get('/dashboard-stats', auth, getDashboardStats);

// =====================================
//  USER MANAGEMENT
// =====================================

// Get all users
router.get('/users', auth, getAllUsers);

// Get user details
router.get('/users/:userId', auth, getUserDetails);

// Update user account type
router.put('/users/:userId/account-type', auth, updateUserAccountType);

// Approve instructor
router.put('/users/:userId/approve-instructor', auth, approveInstructor);

// Reject instructor
router.put('/users/:userId/reject-instructor', auth, rejectInstructor);

// Block/Unblock user
router.put('/users/:userId/toggle-status', auth, toggleUserStatus);

// Delete user
router.delete('/users/:userId', auth, deleteUser);

// Get user enrollments
router.get('/users/:userId/enrollments', auth, isAdmin, getUserEnrollments);

// =====================================
//  COURSE MANAGEMENT
// =====================================

// Get all courses (admin view)
router.get('/courses', auth, getAllCoursesAdmin);

// Update course status
router.put('/courses/:courseId/status', auth, updateCourseStatus);

// Delete course
router.delete('/courses/:courseId', auth, deleteCourseAdmin);

// Get course analytics
router.get('/courses/:courseId/analytics', auth, getCourseAnalytics);

// =====================================
//  CATEGORY MANAGEMENT
// =====================================

// Get all categories
router.get('/categories', auth, getAllCategories);

// Delete category
router.delete('/categories/:categoryId', auth, deleteCategory);

// =====================================
//  ANALYTICS
// =====================================

// Get payment analytics
router.get('/analytics/payments', auth, getPaymentAnalytics);

module.exports = router;
