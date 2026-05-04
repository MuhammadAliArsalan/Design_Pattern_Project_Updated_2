# Admin Dashboard Setup & Testing Guide

## Overview
This guide walks you through setting up and testing the new Admin Dashboard feature in StudySync.

## What's New?

✅ **Backend Admin APIs** - 17 comprehensive endpoints for admin operations
✅ **Frontend Admin Dashboard** - Full-featured admin interface  
✅ **Redux Admin Slice** - State management for admin operations
✅ **User Management** - Approve/reject instructors, manage users
✅ **Course Management** - Approve courses, view analytics
✅ **Payment Analytics** - Revenue tracking and insights

---

## Setup Instructions

### Backend Setup

1. **No additional packages needed** - All code uses existing dependencies

2. **Restart the backend server:**
   ```bash
   cd d:\StudySync\backend
   npm run dev
   ```

3. **Verify admin routes are loaded:**
   - Check console for "🚀 Server running on PORT 5000"
   - No errors should appear

### Frontend Setup

1. **No additional packages needed** - Uses existing Tailwind & React

2. **Restart the frontend server:**
   ```bash
   cd d:\StudySync\frontend
   npm run dev
   ```

3. **Verify the app loads correctly**
   - No console errors
   - Dashboard page works

---

## Testing the Admin Dashboard

### Step 1: Create an Admin User

**Option A: Signup as Admin (if supported)**
1. Go to signup page
2. Select "Admin" as account type
3. Complete signup

**Option B: Update Existing User to Admin**

Using curl or Postman:
```bash
PUT http://localhost:5000/api/v1/admin/users/:userId/account-type
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "accountType": "Admin"
}
```

Or directly in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { accountType: "Admin" } }
)
```

### Step 2: Login as Admin

1. Open `http://localhost:5173`
2. Click "Login"
3. Enter admin credentials
4. Click "Login"

### Step 3: Access Admin Dashboard

1. Navigate to `http://localhost:5173/admin-dashboard`
2. If not logged in, you'll see a login prompt
3. If logged in but not admin, you'll see an access denied message
4. If logged in as admin, you'll see the full dashboard with:
   - Dashboard statistics
   - User management section
   - Course management section
   - Payment analytics

**Note**: The admin dashboard is now accessible directly via URL without requiring login first. Authentication checks happen on the page itself.

---

## Testing Each Feature

### Dashboard Statistics

1. Go to **Dashboard** tab
2. View key metrics:
   - Total users, students, instructors, admins
   - Total courses, published, drafts
   - Total enrollments
   - Total revenue

### User Management

1. Go to **User Management** tab
2. **Search Users**: Type in search box (e.g., "john")
3. **Filter by Type**: Select from dropdown
4. **View User Details**: Click the eye icon
5. **Approve Instructor**: Click on user, click "Approve as Instructor"
6. **Block/Unblock User**: Click the edit icon
7. **Delete User**: Click trash icon (confirm delete)

**Expected Results:**
- Users list updates in real-time
- Filters work correctly
- Modal shows detailed user information
- Status changes are reflected immediately

### Course Management

1. Go to **Course Management** tab
2. **Search Courses**: Type course name
3. **Filter by Status**: Choose "Published", "Draft", or "Archived"
4. **Change Status**: Click dropdown, select new status
5. **View Analytics**: Click the eye icon
6. **Delete Course**: Click trash icon

**Expected Results:**
- Courses list shows all courses with filters
- Status updates immediately
- Analytics modal shows course metrics
- Deleted courses removed from list

### Payment Analytics

1. Go to **Analytics** tab
2. View:
   - Total revenue
   - Total transactions
   - Average transaction value
   - Top 10 performing courses
   - Growth metrics

**Expected Results:**
- All metrics display correctly
- Top courses listed by revenue
- Progress bars show revenue distribution

---

## API Testing

### Using Curl

#### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/v1/admin/dashboard-stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get All Users
```bash
curl -X GET "http://localhost:5000/api/v1/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get All Courses
```bash
curl -X GET "http://localhost:5000/api/v1/admin/courses?status=Published" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Approve Instructor
```bash
curl -X PUT http://localhost:5000/api/v1/admin/users/:userId/approve-instructor \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Get Payment Analytics
```bash
curl -X GET http://localhost:5000/api/v1/admin/analytics/payments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Open Postman
2. Create new request
3. Set method to GET/PUT/DELETE
4. Enter URL: `http://localhost:5000/api/v1/admin/...`
5. Go to **Headers** tab
6. Add: `Authorization: Bearer YOUR_JWT_TOKEN`
7. Send request

---

## File Structure

```
Backend:
- /backend/controllers/admin.js - Admin controller with all logic
- /backend/routes/admin.js - Admin routes
- /backend/server.js - Updated to include admin routes

Frontend:
- /frontend/src/pages/Admin/AdminDashboard.jsx - Main dashboard page
- /frontend/src/components/admin/
  - AdminSidebar.jsx - Navigation menu
  - DashboardStats.jsx - Statistics cards
  - UserManagement.jsx - User CRUD
  - UserModal.jsx - User details popup
  - CourseManagement.jsx - Course CRUD
  - CourseModal.jsx - Course analytics popup
  - PaymentAnalytics.jsx - Revenue analytics
- /frontend/src/services/operations/adminAPI.js - API calls
- /frontend/src/slices/adminSlice.js - Redux slice
- /frontend/src/reducer/index.js - Updated to include admin reducer
- /frontend/src/App.jsx - Updated with admin route
```

---

## Troubleshooting

### Admin Dashboard not loading
**Solution:**
- Verify user has `accountType: "Admin"`
- Check JWT token in localStorage
- Clear browser cache
- Check browser console for errors

### API returns 401/403
**Solution:**
- Ensure JWT token is valid
- Token might be expired - login again
- Check isAdmin middleware in backend

### Data not showing
**Solution:**
- Check network tab in DevTools
- Verify backend is running
- Check API responses in console
- Ensure data exists in database

### UI not styled properly
**Solution:**
- Ensure Tailwind CSS is configured
- Clear browser cache
- Restart frontend server
- Check if all class names are correct

---

## Database Test Data

To test with sample data:

```javascript
// Create test users
db.users.insertMany([
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@test.com",
    password: "hashed_password",
    accountType: "Admin",
    active: true,
    approved: true
  },
  {
    firstName: "John",
    lastName: "Instructor",
    email: "instructor@test.com",
    password: "hashed_password",
    accountType: "Instructor",
    active: true,
    approved: true
  },
  {
    firstName: "Jane",
    lastName: "Student",
    email: "student@test.com",
    password: "hashed_password",
    accountType: "Student",
    active: true,
    approved: true
  }
])

// Create test courses
db.courses.insertMany([
  {
    courseName: "Python for Beginners",
    price: 999,
    status: "Published",
    instructor: ObjectId("admin_user_id"),
    studentEnrolled: [ObjectId("student_id")],
    category: ObjectId("category_id")
  }
])
```

---

## Performance Notes

- Dashboard loads all statistics at once
- Pagination limits user/course lists to 10 items per page
- Search is performed server-side for efficiency
- Consider adding caching for high-traffic scenarios

---

## Next Steps

1. **Test all features** using this guide
2. **Check browser console** for any errors
3. **Verify data updates** are reflected in real-time
4. **Test edge cases** (delete, large numbers, etc.)
5. **Check responsive design** on different screen sizes

---

## Support Resources

- Admin API Documentation: `ADMIN_API_DOCUMENTATION.md`
- Backend admin.js: Full comments on each function
- Frontend components: Organized with clear naming

---

## Checklist

- [ ] Backend server running without errors
- [ ] Frontend server running without errors
- [ ] Can access admin dashboard
- [ ] Can view dashboard statistics
- [ ] Can search and filter users
- [ ] Can view user details
- [ ] Can approve/reject instructors
- [ ] Can view and manage courses
- [ ] Can view payment analytics
- [ ] All API calls working in network tab
- [ ] No console errors

---

## Questions?

Refer to `ADMIN_API_DOCUMENTATION.md` for complete API reference.
