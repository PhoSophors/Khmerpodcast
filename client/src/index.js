import React from "react";
import { createRoot } from "react-dom/client";
import App from "./router/App";
import "./index.css"; // Import the Tailwind CSS styles
import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import { AudioContext } from "./context/AudioContext";

// Import translation files
import translationEN from "./components/languages/en.json";
import translationKH from "./components/languages/kh.json";

// Read proxyUrl from environment variable
const proxyUrl = process.env.REACT_APP_PROXY;

// Initialize i18next
i18next.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: "kh",
  fallbackLng: "kh",
  resources: {
    en: { translation: translationEN },
    kh: { translation: translationKH },
  },
});

// Render the App component
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
