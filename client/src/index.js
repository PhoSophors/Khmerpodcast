import React from "react";
import { createRoot } from "react-dom/client";
import App from "./router/App";
import "./index.css"; // Import the Tailwind CSS styles
import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import Cookies from "js-cookie";
import { FavoritePodcastsProvider } from "./context/FavoritePodcastsContext";
import { AudioProvider } from "./context/AudioContext";
// import { AuthProvider } from "./context/AuthContext";go

// Import translation files
import translationEN from "./components/languages/en.json";
import translationKH from "./components/languages/kh.json";

const language = Cookies.get("language") || "kh";
Cookies.set("language", language);

i18next
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    lng: language,
    fallbackLng: "kh",
    resources: {
      en: { translation: translationEN },
      kh: { translation: translationKH },
    },
  })
  .then(() => {
    const root = createRoot(document.getElementById("root"));

    root.render(
      <React.StrictMode>
        {/* <AuthProvider> */}
          <FavoritePodcastsProvider>
            <AudioProvider>
              <App />
            </AudioProvider>
          </FavoritePodcastsProvider>
        {/* </AuthProvider> */}
      </React.StrictMode>,
      document.getElementById("root")
    );
  });
