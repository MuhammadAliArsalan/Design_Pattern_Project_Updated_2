# Admin Dashboard API Documentation

## Overview
Complete admin dashboard system for StudySync with user management, course management, analytics, and more.

## Access Admin Dashboard
- **URL**: `http://localhost:5173/admin-dashboard`
- **Requires**: Admin account type
- **Authentication**: JWT token

---

## Backend API Endpoints

### Base URL: `/api/v1/admin`

All endpoints require authentication with `isAdmin` middleware.

---

## Dashboard Statistics

### Get Dashboard Stats
```
GET /dashboard-stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "students": 120,
      "instructors": 25,
      "admins": 5
    },
    "courses": {
      "total": 45,
      "published": 40,
      "draft": 5
    },
    "categories": 8,
    "enrollments": 320,
    "revenue": {
      "total": 150000,
      "average": 3750
    }
  }
}
```

---

## User Management APIs

### Get All Users
```
GET /users?accountType=Student&page=1&limit=10&search=john
```

**Query Parameters:**
- `accountType` (optional): "Admin", "Instructor", "Student", "All"
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 150,
      "pages": 15,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```

### Get User Details
```
GET /users/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "accountType": "Student",
    "active": true,
    "approved": true,
    "courses": [...],
    "courseProgress": [...]
  }
}
```

### Update User Account Type
```
PUT /users/:userId/account-type
```

**Body:**
```json
{
  "accountType": "Instructor"
}
```

### Approve Instructor
```
PUT /users/:userId/approve-instructor
```

**Response:** Updated user object with `accountType: "Instructor"` and `approved: true`

### Reject Instructor
```
PUT /users/:userId/reject-instructor
```

**Response:** Updated user object with `accountType: "Student"` and `approved: false`

### Block/Unblock User
```
PUT /users/:userId/toggle-status
```

**Response:** Updated user object with toggled `active` status

### Delete User
```
DELETE /users/:userId
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Get User Enrollments
```
GET /users/:userId/enrollments?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollments": [...],
    "pagination": {...}
  }
}
```

---

## Course Management APIs

### Get All Courses (Admin View)
```
GET /courses?status=Published&page=1&limit=10&search=python
```

**Query Parameters:**
- `status` (optional): "Published", "Draft", "Archived", "All"
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by course name
- `instructorId` (optional): Filter by instructor

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [...],
    "pagination": {...}
  }
}
```

### Update Course Status
```
PUT /courses/:courseId/status
```

**Body:**
```json
{
  "status": "Published"
}
```

### Delete Course
```
DELETE /courses/:courseId
```

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

### Get Course Analytics
```
GET /courses/:courseId/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {...},
    "analytics": {
      "totalStudents": 45,
      "totalRevenue": 45000,
      "averageRating": "4.5",
      "averageCompletion": "72.5%",
      "totalReviews": 23
    }
  }
}
```

---

## Category Management APIs

### Get All Categories
```
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### Delete Category
```
DELETE /categories/:categoryId
```

**Note:** Can only delete empty categories

---

## Analytics APIs

### Get Payment Analytics
```
GET /analytics/payments
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 150000,
    "totalTransactions": 320,
    "averageTransactionValue": "468.75",
    "topCourses": [
      {
        "courseName": "Python Basics",
        "enrollments": 45,
        "revenue": 45000
      }
    ]
  }
}
```

---

## Frontend Components

### Main Components

1. **AdminDashboard** (`/src/pages/Admin/AdminDashboard.jsx`)
   - Main admin dashboard page
   - Tab-based navigation
   - Displays statistics, users, courses, analytics

2. **AdminSidebar** (`/src/components/admin/AdminSidebar.jsx`)
   - Navigation menu
   - Quick access to different sections
   - Logout functionality

3. **DashboardStats** (`/src/components/admin/DashboardStats.jsx`)
   - Displays key metrics
   - User distribution
   - Course status
   - Revenue information

4. **UserManagement** (`/src/components/admin/UserManagement.jsx`)
   - List all users
   - Filter and search
   - User actions (view, approve, reject, block, delete)
   - Pagination

5. **CourseManagement** (`/src/components/admin/CourseManagement.jsx`)
   - List all courses
   - Filter by status
   - Update course status
   - Delete courses
   - View analytics

6. **PaymentAnalytics** (`/src/components/admin/PaymentAnalytics.jsx`)
   - Revenue statistics
   - Transaction data
   - Top performing courses
   - Growth metrics

---

## Frontend API Service

**File**: `/src/services/operations/adminAPI.js`

### Available Functions

```javascript
// Dashboard
getDashboardStats(token)

// Users
getAllUsers(token, params)
getUserDetailsAdmin(token, userId)
updateUserAccountType(token, userId, accountType)
approveInstructor(token, userId)
rejectInstructor(token, userId)
toggleUserStatus(token, userId)
deleteUserAdmin(token, userId)
getUserEnrollments(token, userId, params)

// Courses
getAllCoursesAdmin(token, params)
updateCourseStatus(token, courseId, status)
deleteCourseAdmin(token, courseId)
getCourseAnalytics(token, courseId)

// Categories
getAllCategoriesAdmin(token)
deleteCategory(token, categoryId)

// Analytics
getPaymentAnalytics(token)
```

---

## Redux Store

### Admin Slice
**File**: `/src/slices/adminSlice.js`

**Actions:**
- `setDashboardStats`: Update dashboard statistics
- `setUsers`: Update users list
- `setCourses`: Update courses list
- `setCategories`: Update categories list
- `setLoading`: Set loading state
- `setError`: Set error message
- `resetAdmin`: Reset admin state

**State Structure:**
```javascript
{
  dashboardStats: null,
  users: [],
  courses: [],
  categories: [],
  loading: false,
  error: null
}
```

---

## Usage Examples

### Access Admin Dashboard

1. User must have `accountType: "Admin"`
2. Navigate to `/admin-dashboard`
3. Dashboard automatically loads statistics
4. Use sidebar to navigate between sections

### Add Admin User

Use the signup endpoint with `accountType: "Admin"` parameter, or:

```bash
# Update an existing user to Admin
curl -X PUT http://localhost:5000/api/v1/admin/users/:userId/account-type \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountType":"Admin"}'
```

### Fetch and Display Dashboard Data

```javascript
import { getDashboardStats } from "@/services/operations/adminAPI"

const token = useSelector(state => state.auth.token)
const stats = await getDashboardStats(token)
console.log(stats.users.total) // 150
```

---

## Features

✅ Dashboard with key metrics
✅ User management (create, read, update, delete)
✅ Instructor approval system
✅ Course management and status updates
✅ Analytics and revenue tracking
✅ Category management
✅ Pagination and search
✅ Real-time updates
✅ Role-based access control
✅ Responsive design

---

## Security

All admin endpoints are protected by:
- JWT authentication
- Admin role verification (`isAdmin` middleware)
- Input validation
- Rate limiting (recommended)

---

## Testing the APIs

Use Postman or cURL to test:

```bash
# Get Dashboard Stats
curl -X GET http://localhost:5000/api/v1/admin/dashboard-stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get All Users
curl -X GET "http://localhost:5000/api/v1/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get All Courses
curl -X GET "http://localhost:5000/api/v1/admin/courses?status=Published" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Troubleshooting

### Admin Dashboard Not Accessible
- Verify user has `accountType: "Admin"`
- Check JWT token is valid
- Clear browser cache and retry

### API Errors
- Ensure token is included in Authorization header
- Check user has Admin role
- Verify request body format matches documentation

### Data Not Loading
- Check browser console for errors
- Verify backend server is running
- Check network tab in DevTools

---

## Future Enhancements

- Email notifications for approvals
- Bulk user import/export
- Advanced reporting
- Custom dashboards
- Audit logs
- User activity tracking
- Course analytics by date range
- Revenue forecasting

---

## Support

For issues or questions, contact the development team.
