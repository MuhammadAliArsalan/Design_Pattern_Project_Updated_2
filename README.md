# StudySync - Learning Management System

StudySync is a comprehensive Learning Management System (LMS) built with modern web technologies. It provides a complete platform for online education, featuring course management, user authentication, payment processing, and an admin dashboard.

## 🚀 Features

- **User Authentication & Authorization**: Secure login/signup with JWT tokens
- **Course Management**: Create, update, and manage courses with sections and subsections
- **Payment Integration**: Support for Razorpay and Stripe payment gateways
- **File Upload**: Cloudinary integration for image and video uploads
- **Email Services**: Automated email notifications using Nodemailer
- **Admin Dashboard**: Complete admin interface for user and course management
- **Progress Tracking**: Course progress monitoring for students
- **Rating & Reviews**: Course rating and review system
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Payment**: Razorpay, Stripe
- **Email**: Nodemailer with Brevo SMTP
- **Security**: bcrypt for password hashing

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: Custom components with Framer Motion animations
- **Charts**: Chart.js for analytics

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either local installation or MongoDB Atlas account
- **Git** - For cloning the repository

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd StudySync
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env  # If .env.example exists, otherwise create .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## ⚙️ Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
JWT_SECRET=your_jwt_secret_key_here

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Email Configuration (using Brevo)
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your_brevo_smtp_username
MAIL_PASS=your_brevo_smtp_password
MAIL_FROM="Your App Name <your-email@example.com>"

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=your_folder_name

# Payment Gateways
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYMENT_MODE=razorpay  # or 'stripe'
```

### Getting API Keys

1. **MongoDB**: Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/)
3. **Razorpay**: Get keys from [Razorpay Dashboard](https://dashboard.razorpay.com/)
4. **Stripe**: Get keys from [Stripe Dashboard](https://dashboard.stripe.com/)
5. **Brevo (formerly Sendinblue)**: Sign up at [Brevo](https://www.brevo.com/) for SMTP

## 🚀 Running the Application

### Development Mode

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

#### Option 2: Run Both with Concurrently (Frontend only)

```bash
cd frontend
npm run server
```

### Production Build

**Backend:**
```bash
cd backend
npm run build  # Installs dependencies
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # For preview, or serve the dist folder
```

## 📖 API Documentation

The API documentation is available in [ADMIN_API_DOCUMENTATION.md](./ADMIN_API_DOCUMENTATION.md)

### Base URL
```
http://localhost:5000/api/v1
```

### Main Endpoints
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /course/getAllCourses` - Get all courses
- `POST /payment/capturePayment` - Process payments
- `GET /admin/dashboard-stats` - Admin dashboard (Admin only)

## 👨‍💼 Admin Setup

For detailed admin dashboard setup instructions, refer to [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md)

### Quick Admin Setup:
1. Start the application
2. Create a user account
3. Update the user role to "Admin" in the database or via API
4. Access `/admin-dashboard` to manage users, courses, and view analytics

## 🗂 Project Structure

```
StudySync/
├── backend/
│   ├── config/          # Configuration files (DB, Cloudinary, etc.)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication & validation middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions
│   ├── mail/            # Email templates
│   └── patterns/        # Design patterns implementation
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── slices/      # Redux slices
│   │   └── utils/       # Frontend utilities
│   ├── public/          # Static assets
│   └── data/            # Static data files
└── screenshots/         # Project screenshots
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run lint  # Check for linting errors
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration for JavaScript/React
- Use meaningful commit messages
- Keep components modular and reusable

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](./LICENSE) file for details.

## 📞 Support

For support or questions:
- Create an issue in the repository
- Check the documentation files in the root directory
- Review the admin setup guide for common issues

## 🔄 Future Enhancements

- [ ] Mobile app development
- [ ] Video streaming optimization
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with learning tools (SCORM, etc.)
- [ ] API rate limiting and caching

---

**Happy Learning with StudySync! 🎓**
