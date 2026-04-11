const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware to parse JSON data
app.use(express.json({ limit: "10mb" }));

// Enable CORS to allow frontend requests (normalize URL to drop trailing slash)
const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, '');
app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin || incomingOrigin === clientUrl) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/offers", require("./routes/offerRoutes"));
app.use("/api/coins", require("./routes/coinRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/enquiries", require("./routes/enquiryRoutes"));

// Default route (check if server is running)
app.get("/", (req, res) => {
  res.json({ message: "💄 Sakhi Beauty App is running!" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
