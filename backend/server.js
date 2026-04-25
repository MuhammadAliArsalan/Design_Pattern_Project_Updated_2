/**
 * server.js — Application Entry Point
 *
 * Patterns in use:
 *   • Singleton — Database, CloudinaryService, RazorpayService, MailTransporter
 *                 are all initialised once here and re-used everywhere else.
 *
 * Boot sequence:
 *   1. Load environment variables
 *   2. Initialise all Singleton services
 *   3. Mount Express middleware
 *   4. Mount route handlers
 *   5. Start listening
 */

const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// ── SINGLETON: one instance of each external service ─────────────────────
const database = require("./config/Database"); // Singleton
const cloudinary = require("./config/CloudinaryService"); // Singleton (auto-configures)
const razorpay = require("./config/RazorpayService"); // Singleton (auto-configures)
const stripe = require("./config/StripeService"); // Singleton (auto-configures)
const mailer = require("./config/MailTransporter"); // Singleton (auto-configures)

// ── Routes ────────────────────────────────────────────────────────────────
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payments");
const courseRoutes = require("./routes/course");

// ── App setup ─────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp" }));

// ── Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

app.get("/", (_req, res) => res.send("<p>Server is up ✅</p>"));

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

(async () => {
  // SINGLETON: connect the single DB instance
  await database.connect();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on PORT ${PORT}`);
  });
})();
