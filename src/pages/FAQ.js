import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Is your plot Non-Agricultural (NA)?",
      answer: "Yes/No (as per the actual status).",
    },
    {
      question: "How wide is the internal road?",
      answer: `The internal road is 30 feet wide.
      
If the road is shown as 30 feet in the layout, then there will be no issue in obtaining NA approval.`,
    },
    {
      question: "What are the charges for individual registration?",
      answer: `The charges for individual registration include:
      
- Stamp duty: 6%
- Advocate fees: ₹3,000
- Other miscellaneous charges as applicable.`,
    },
    {
      question:
        "After individual registration, how long does it take to reflect in the 7/12 extract?",
      answer: `It usually takes around 40 days for the changes to be reflected in the 7/12 extract.
      
The responsibility of updating the 7/12 extract lies with the developer.`,
    },
    {
      question:
        "Does your apartment have RERA registration and Town Planning (T.P.) sanction?",
      answer: `RERA registration is required for buildings with more than 5 Guntha.
      
T.P. sanction should also be obtained.`,
    },
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
                {faq.answer.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
