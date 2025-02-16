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
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Reviews from "./pages/Reviews";

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <div className="content">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Dynamic route for property types */}
        <Route path="/properties/:type/:subtype?" element={<PropertyList />} />


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

        <Route path="/about" element={<AboutUs />} />

        <Route path="/faq" element={<FAQ />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
  <Route path="/contact/:type" element={<Contact />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      <Footer />
    </Router>
  </AuthProvider>
);

export default App;
