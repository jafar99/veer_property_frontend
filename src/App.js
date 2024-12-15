import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import PropertyDetails from "./components/PropertyDetails";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./services/ProtectedRoute";
import { AuthProvider } from "./services/AuthContext";
import PropertyList from "./components/PropertyList";

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <div className="content">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Dynamic route for property types */}
        <Route path="/properties/:type" element={<PropertyList />} />

        {/* Admin route (protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Property details */}

          <Route path="/property/:id" element={<PropertyDetails />} />
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      <Footer />
    </Router>
  </AuthProvider>
);

export default App;
