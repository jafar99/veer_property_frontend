import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
  const { type } = useParams(); // Get the URL parameter

  console.log(type);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;

    const whatsappMessage = `Hi there! Here are my details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Message: ${message}`;

    const whatsappURL = `https://wa.me/7057048846?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">
        {type === "be-an-agent" ? "Become an Agent" : "Contact Us"}
      </h1>
      <p className="contact-description">
        {type === "be-an-agent"
          ? "Join us as an agent and start your real estate journey."
          : "Have any questions? We'd love to hear from you! Fill out the form below."}
      </p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            rows="5"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          {type === "be-an-agent" ? "Apply Now" : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
