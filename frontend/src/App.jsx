import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MedicalRecords from './pages/MedicalRecords';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

// Doctor Pages
import DoctorLayout from './layouts/DoctorLayout';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import AppointmentRequests from './pages/Doctor/AppointmentRequests';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import PatientsList from './pages/Doctor/PatientsList';
import AvailabilityManagement from './pages/Doctor/Availability';
import Consultation from './pages/Doctor/Consultation';
import DoctorNotifications from './pages/Doctor/DoctorNotifications';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const DoctorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (user && user.role === 'doctor') ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppointmentProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <div style={{ flex: 1 }}>
                    <Home />
                  </div>
                  <Footer />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Navbar />
                  <div style={{ flex: 1 }}>
                    <Login />
                  </div>
                  <Footer />
                </>
              } />
              <Route path="/register" element={
                <>
                  <Navbar />
                  <div style={{ flex: 1 }}>
                    <Register />
                  </div>
                  <Footer />
                </>
              } />

              {/* Protected Dashboard Routes */}
              <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="book-appointment" element={<BookAppointment />} />
                <Route path="appointments" element={<MyAppointments />} />
                <Route path="records" element={<MedicalRecords />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Doctor Routes */}
              <Route path="/doctor" element={<DoctorRoute><DoctorLayout /></DoctorRoute>}>
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="requests" element={<AppointmentRequests />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="patients" element={<PatientsList />} />
                <Route path="availability" element={<AvailabilityManagement />} />
                <Route path="consultations" element={<Consultation />} />
                <Route path="consultations/:appointmentId" element={<Consultation />} />
                <Route path="notifications" element={<DoctorNotifications />} />
                <Route path="profile" element={<DoctorProfile />} />
              </Route>
            </Routes>
          </div>
        </AppointmentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
