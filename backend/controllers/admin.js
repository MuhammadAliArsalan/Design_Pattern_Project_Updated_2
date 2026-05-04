/**
 * Admin Controller
 *
 * Patterns in use:
 *   • Repository — CourseRepository / UserRepository for all DB calls
 *   • Factory    — ApiResponseFactory for consistent responses
 */

const User = require('../models/user');
const Course = require('../models/course');
const Category = require('../models/category');
const CourseProgress = require('../models/courseProgress');
const Profile = require('../models/profile');
const RatingAndReview = require('../models/ratingAndReview');
const ApiResponseFactory = require('../patterns/factory/ApiResponseFactory');
const courseRepo = require('../repositories/CourseRepository');
const userRepo = require('../repositories/UserRepository');

// ================ DASHBOARD STATISTICS ================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ accountType: 'Student' });
    const totalInstructors = await User.countDocuments({ accountType: 'Instructor' });
    const totalAdmins = await User.countDocuments({ accountType: 'Admin' });
    
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: 'Published' });
    const draftCourses = await Course.countDocuments({ status: 'Draft' });
    
    const totalCategories = await Category.countDocuments();
    
    const enrollments = await CourseProgress.countDocuments();
    
    // Calculate total revenue
    const courseData = await Course.find({ status: 'Published' }).select('price studentEnrolled');
    const totalRevenue = courseData.reduce((sum, course) => {
      return sum + (course.price * (course.studentEnrolled?.length || 0));
    }, 0);
    
    const averageRevenue = courseData.length > 0 ? totalRevenue / courseData.length : 0;

    return ApiResponseFactory.success(res, {
      message: 'Dashboard statistics fetched successfully',
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          instructors: totalInstructors,
          admins: totalAdmins,
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          draft: draftCourses,
        },
        categories: totalCategories,
        enrollments,
        revenue: {
          total: totalRevenue,
          average: averageRevenue,
        },
      },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error fetching dashboard statistics');
  }
};

// ================ GET ALL USERS ================
exports.getAllUsers = async (req, res) => {
  try {
    const { accountType, page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    if (accountType && accountType !== 'All') {
        filter.accountType = new RegExp(`^${accountType}$`, "i");
    }

    if (search) {
  filter.$or = [
    { firstName: new RegExp(search, "i") },
    { lastName: new RegExp(search, "i") },
    { email: new RegExp(search, "i") },
  ];
}

    const users = await User.find(filter)
      .select('-password -token -resetPasswordTokenExpires')
      .populate('additionalDetails')
      .populate('courses')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    return ApiResponseFactory.success(res, {
      message: 'All users fetched successfully',
      data: {
        users,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error fetching users');
  }
};

// ================ GET SINGLE USER DETAILS ================
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password -token -resetPasswordTokenExpires')
      .populate('additionalDetails')
      .populate('courses')
      .populate('courseProgress');

    if (!user) {
      return ApiResponseFactory.notFound(res, 'User not found');
    }

    return ApiResponseFactory.success(res, {
      message: 'User details fetched successfully',
      data: user,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error fetching user details');
  }
};

// ================ UPDATE USER ACCOUNT TYPE ================
exports.updateUserAccountType = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accountType } = req.body;

    if (!['Admin', 'Instructor', 'Student'].includes(accountType)) {
      return ApiResponseFactory.badRequest(res, 'Invalid account type');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { accountType },
      { new: true }
    ).select('-password -token -resetPasswordTokenExpires');

    return ApiResponseFactory.success(res, {
      message: 'User account type updated successfully',
      data: user,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error updating user account type');
  }
};

// ================ APPROVE INSTRUCTOR ================
exports.approveInstructor = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { approved: true, accountType: 'Instructor' },
      { new: true }
    ).select('-password -token -resetPasswordTokenExpires');

    if (!user) {
      return ApiResponseFactory.notFound(res, 'User not found');
    }

    return ApiResponseFactory.success(res, {
      message: 'Instructor approved successfully',
      data: user,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error approving instructor');
  }
};

// ================ REJECT INSTRUCTOR ================
exports.rejectInstructor = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { approved: false, accountType: 'Student' },
      { new: true }
    ).select('-password -token -resetPasswordTokenExpires');

    if (!user) {
      return ApiResponseFactory.notFound(res, 'User not found');
    }

    return ApiResponseFactory.success(res, {
      message: 'Instructor rejected successfully',
      data: user,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error rejecting instructor');
  }
};

// ================ BLOCK/UNBLOCK USER ================
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return ApiResponseFactory.notFound(res, 'User not found');
    }

    user.active = !user.active;
    await user.save();

    return ApiResponseFactory.success(res, {
      message: `User ${user.active ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error toggling user status');
  }
};

// ================ DELETE USER ================
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return ApiResponseFactory.notFound(res, 'User not found');
    }

    // Delete associated profile
    await Profile.findByIdAndDelete(user.additionalDetails);

    return ApiResponseFactory.success(res, {
      message: 'User deleted successfully',
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error deleting user');
  }
};

// ================ GET ALL COURSES ================
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search = '', instructorId } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (search) {
      filter.courseName = { $regex: search, $options: 'i' };
    }
    if (instructorId) {
      filter.instructor = instructorId;
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'firstName lastName email')
      .populate('category', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filter);

    return ApiResponseFactory.success(res, {
      message: 'All courses fetched successfully',
      data: {
        courses,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error fetching courses');
  }
};

// ================ UPDATE COURSE STATUS ================
exports.updateCourseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { status } = req.body;

    if (!['Draft', 'Published', 'Archived'].includes(status)) {
      return ApiResponseFactory.badRequest(res, 'Invalid course status');
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { status },
      { new: true }
    ).populate('instructor', 'firstName lastName email')
     .populate('category', 'name');

    if (!course) {
      return ApiResponseFactory.notFound(res, 'Course not found');
    }

    return ApiResponseFactory.success(res, {
      message: 'Course status updated successfully',
      data: course,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error updating course status');
  }
};

// ================ DELETE COURSE ================
exports.deleteCourseAdmin = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return ApiResponseFactory.notFound(res, 'Course not found');
    }

    // Remove course from instructor's courses
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: courseId }
    });

    // Remove course from category
    await Category.findByIdAndUpdate(course.category, {
      $pull: { courses: courseId }
    });

    // Delete course and all associated data
    await CourseProgress.deleteMany({ courseID: courseId });
    await RatingAndReview.deleteMany({ course: courseId });
    await Course.findByIdAndDelete(courseId);

    return ApiResponseFactory.success(res, {
      message: 'Course deleted successfully',
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error deleting course');
  }
};

// ================ GET COURSE ANALYTICS ================
exports.getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate('instructor', 'firstName lastName')
      .populate('studentEnrolled', 'email')
      .populate('ratingAndReviews');

    if (!course) {
      return ApiResponseFactory.notFound(res, 'Course not found');
    }

    const totalStudents = course.studentEnrolled?.length || 0;
    const totalRevenue = course.price * totalStudents;
    const averageRating = course.ratingAndReviews?.length > 0
      ? (course.ratingAndReviews.reduce((sum, r) => sum + r.rating, 0) / course.ratingAndReviews.length).toFixed(2)
      : 0;

    const progressData = await CourseProgress.find({ courseID: courseId });
    const averageCompletion = progressData.length > 0
      ? ((progressData.filter(p => p.completedVideos.length > 0).length / progressData.length) * 100).toFixed(2)
      : 0;

    return ApiResponseFactory.success(res, {
      message: 'Course analytics fetched successfully',
      data: {
        course,
        analytics: {
          totalStudents,
          totalRevenue,
          averageRating,
          averageCompletion: `${averageCompletion}%`,
          totalReviews: course.ratingAndReviews?.length || 0,
        },
      },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error fetching course analytics');
  }
};

// ================ GET ALL CATEGORIES ================
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('courses')
      .sort({ createdAt: -1 });

    return ApiResponseFactory.success(res, {
      message: 'All categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error fetching categories');
  }
};

// ================ DELETE CATEGORY ================
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return ApiResponseFactory.notFound(res, 'Category not found');
    }

    if (category.courses && category.courses.length > 0) {
      return ApiResponseFactory.badRequest(res, 'Cannot delete category with existing courses. Please delete or reassign courses first.');
    }

    await Category.findByIdAndDelete(categoryId);

    return ApiResponseFactory.success(res, {
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error deleting category');
  }
};

// ================ GET PAYMENT ANALYTICS ================
exports.getPaymentAnalytics = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'Published' })
      .select('courseName price studentEnrolled');

    const totalRevenue = courses.reduce((sum, course) => {
      return sum + (course.price * (course.studentEnrolled?.length || 0));
    }, 0);

    const totalTransactions = courses.reduce((sum, course) => {
      return sum + (course.studentEnrolled?.length || 0);
    }, 0);

    const averageTransactionValue = totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : 0;

    const topCourses = courses
      .map(course => ({
        courseName: course.courseName,
        enrollments: course.studentEnrolled?.length || 0,
        revenue: course.price * (course.studentEnrolled?.length || 0),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return ApiResponseFactory.success(res, {
      message: 'Payment analytics fetched successfully',
      data: {
        totalRevenue,
        totalTransactions,
        averageTransactionValue,
        topCourses,
      },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error fetching payment analytics');
  }
};

// ================ GET USER ENROLLMENTS ================
exports.getUserEnrollments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).select('courses');
    if (!user) {
      return ApiResponseFactory.notFound(res, 'User not found');
    }

    const enrollments = await Course.find({ _id: { $in: user.courses } })
      .populate('instructor', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit));

    const total = user.courses.length;

    return ApiResponseFactory.success(res, {
      message: 'User enrollments fetched successfully',
      data: {
        enrollments,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error fetching user enrollments');
  }
};
