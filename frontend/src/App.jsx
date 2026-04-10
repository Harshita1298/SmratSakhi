import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import ProtectedRoute from './components/ProtectedRoute';

import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Services       from './pages/Services';
import Cart           from './pages/Cart';
import Booking        from './pages/Booking';
import Payment        from './pages/Payment';
import Profile        from './pages/Profile';
import MyBookings     from './pages/MyBookings';
import Reviews        from './pages/Reviews';
import Gallery        from './pages/Gallery';
import Offers         from './pages/Offers';
import Notifications  from './pages/Notifications';
import Enquiry        from './pages/Enquiry';
import Wallet         from './pages/Wallet';
import PrivacyPolicy  from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import AdminDashboard     from './pages/admin/Dashboard';
import AdminAddBooking    from './pages/admin/AddBooking';
import AdminBookings      from './pages/admin/ManageBookings';
import AdminServices      from './pages/admin/ManageServices';
import AdminReports       from './pages/admin/Reports';
import AdminReviews       from './pages/admin/AdminReviews';
import AdminGallery       from './pages/admin/AdminGallery';
import AdminOffers        from './pages/admin/AdminOffers';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminEnquiries     from './pages/admin/AdminEnquiries';
import AdminProfile       from './pages/admin/AdminProfile';

export default function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const loginRedirect = user?.role === 'admin' ? '/admin' : '/';

  return (
    <>
      {!isAdminPage && <Navbar />}
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/login"            element={user ? <Navigate to={loginRedirect} replace /> : <Login />} />
        <Route path="/register"         element={user ? <Navigate to={loginRedirect} replace /> : <Register />} />
        <Route path="/services"         element={<Services />} />
        <Route path="/gallery"          element={<Gallery />} />
        <Route path="/reviews"          element={<Reviews />} />
        <Route path="/offers"           element={<Offers />} />
        <Route path="/enquiry"          element={<Enquiry />} />
        <Route path="/privacy-policy"   element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        <Route path="/cart"                  element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/booking"               element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/payment/:bookingId"    element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/profile"               element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-bookings"           element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/notifications"         element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/wallet"                element={<ProtectedRoute><Wallet /></ProtectedRoute>} />

        <Route path="/admin"               element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/bookings"      element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
        <Route path="/admin/add-booking"   element={<ProtectedRoute adminOnly><AdminAddBooking /></ProtectedRoute>} />
        <Route path="/admin/services"      element={<ProtectedRoute adminOnly><AdminServices /></ProtectedRoute>} />
        <Route path="/admin/reports"       element={<ProtectedRoute adminOnly><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/reviews"       element={<ProtectedRoute adminOnly><AdminReviews /></ProtectedRoute>} />
        <Route path="/admin/gallery"       element={<ProtectedRoute adminOnly><AdminGallery /></ProtectedRoute>} />
        <Route path="/admin/offers"        element={<ProtectedRoute adminOnly><AdminOffers /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute adminOnly><AdminNotifications /></ProtectedRoute>} />
        <Route path="/admin/enquiries"     element={<ProtectedRoute adminOnly><AdminEnquiries /></ProtectedRoute>} />
        <Route path="/admin/profile"       element={<ProtectedRoute adminOnly><AdminProfile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAdminPage && <ChatBot />}
    </>
  );
}
