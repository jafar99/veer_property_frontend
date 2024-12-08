import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Rent from './pages/Rent';
import Sale from './pages/Sale';
import Land from './pages/Land';
import Admin from './pages/Admin';
import PropertyDetails from './components/PropertyDetails';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

const App = () => (
  <Router>
    {/* <Navbar /> */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rent" element={<Rent />} />
      <Route path="/sale" element={<Sale />} />
      <Route path="/land" element={<Land />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/details/:id" element={<PropertyDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    {/* <Footer /> */}
  </Router>
);

export default App;
