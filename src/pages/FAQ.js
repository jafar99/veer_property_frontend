import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer property listings for buying, selling, renting, and leasing. Our platform provides comprehensive property details and personalized assistance."
    },
    {
      question: "How do I list my property?",
      answer: "You can list your property by creating an account, navigating to the 'Add Property' section, and filling out the required details."
    },
    {
      question: "Are there any fees for property listings?",
      answer: "Basic property listings are free, but we offer premium listing options for better visibility and exposure."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team via email at support@realestate.com or call us at (123) 456-7890."
    },
    {
      question: "Can I schedule a property visit?",
      answer: "Yes, you can schedule a visit by contacting the property owner or agent directly through our platform."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="faq-items">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h3>{faq.question}</h3>
              <span className="faq-icon">
                {activeIndex === index ? "-" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
