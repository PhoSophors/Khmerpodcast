import React from "react";
import { createRoot } from "react-dom/client";
import App from "./router/App";
import "./index.css"; // Import Tailwind CSS styles
import "./router/App.css"; // Additional CSS styles if any
import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import Cookies from "js-cookie";
import { AudioProvider } from "./context/AudioContext";
import { ThemeProvider } from "./context/ThemeContext";

// Import translation files
import translationEN from "./components/languages/en.json";
import translationKH from "./components/languages/kh.json";

// Get the preferred language from cookies, default to 'kh' if not set
const language = Cookies.get("language") || "kh";
Cookies.set("language", language);

// Initialize i18next
i18next
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false }, // React already escapes values to prevent XSS
    lng: language, // Set the default language
    fallbackLng: "kh", // Fallback language if the selected language is not available
    resources: {
      en: { translation: translationEN },
      kh: { translation: translationKH },
    },
  })
  .then(() => {
    const rootElement = document.getElementById("root");

    if (rootElement) {
      const root = createRoot(rootElement);

      root.render(
        <React.StrictMode>
          <ThemeProvider>
            <AudioProvider>
              <App />
            </AudioProvider>
          </ThemeProvider>
        </React.StrictMode>
      );
    } else {
      console.error("Root element not found");
    }
  });
