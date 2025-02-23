import React from "react";
import "./WhatsAppPopup.css";

const WhatsAppPopup = ({ onClose }) => {
  const phoneNumber = "919876543210"; // Change to your number

  return (
    <div className="whatsapp-popup">
      <div className="popup-content">
        <h3>Chat with Us</h3>
        <p>Need help? Chat with us on WhatsApp!</p>
        <a
          href={`https://wa.me/${phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-chat-button"
        >
          Open Chat
        </a>
        <button onClick={onClose} className="popup-close">×</button>
      </div>
    </div>
  );
};

export default WhatsAppPopup;
