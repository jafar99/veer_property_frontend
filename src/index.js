import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// document.addEventListener("contextmenu", (event) => event.preventDefault());

// document.addEventListener("keydown", (event) => {
//   if (
//     event.key === "F12" || 
//     (event.ctrlKey && event.shiftKey && event.key === "I") || 
//     (event.ctrlKey && event.shiftKey && event.key === "C") || 
//     (event.ctrlKey && event.shiftKey && event.key === "J") || 
//     (event.ctrlKey && event.key === "U")
//   ) {
//     event.preventDefault();
//   }
// });


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
