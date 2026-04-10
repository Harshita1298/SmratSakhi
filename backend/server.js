const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/services',      require('./routes/serviceRoutes'));
app.use('/api/cart',          require('./routes/cartRoutes'));
app.use('/api/bookings',      require('./routes/bookingRoutes'));
app.use('/api/payment',       require('./routes/paymentRoutes'));
app.use('/api/admin',         require('./routes/adminRoutes'));
app.use('/api/chatbot',       require('./routes/chatbotRoutes'));
app.use('/api/reviews',       require('./routes/reviewRoutes'));
app.use('/api/gallery',       require('./routes/galleryRoutes'));
app.use('/api/offers',        require('./routes/offerRoutes'));
app.use('/api/coins',         require('./routes/coinRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/enquiries',     require('./routes/enquiryRoutes'));

app.get('/', (req, res) => res.json({ message: '💄 Sakhi Beauty App chal raha hai!' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chal raha hai: http://localhost:${PORT}`));
