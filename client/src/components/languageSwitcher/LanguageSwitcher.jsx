import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "antd";
import { CheckOutlined } from "@ant-design/icons"; // Import icons as needed
import "./LanguageSwitcher.css"; // Import CSS for styling
import { Card } from "antd";
import Cookies from "js-cookie";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    Cookies.set("language", languageCode);
    setSelectedLanguage(languageCode); // Update selected language
    setModalVisible(false); // Close the language selection modal
  };

  // Define supported languages with flags
  const supportedLanguages = [
    { code: "kh", name: "Khmer", flag: "🇰🇭" },
    { code: "en", name: "English", flag: "🇺🇸" },
    // Add more languages as needed
  ];

  return (
    <div>
      <div className="language-switcher" onClick={() => setModalVisible(true)}>
        Change Language
        {supportedLanguages.map((language) => (
          <span
            key={language.code}
            className={language.code === selectedLanguage ? "selected" : ""}
          >
            {language.flag}
          </span>
        ))}
      </div>
      <Modal
        title={t("Change Language")}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Card>
          <ul className="language-menu">
            {supportedLanguages.map((language) => (
              <li
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={language.code === selectedLanguage ? "selected" : ""}
              >
                {language.name} {language.flag}
                {language.code === selectedLanguage && (
                  <CheckOutlined className="check-icon" />
                )}
              </li>
            ))}
          </ul>
        </Card>
      </Modal>
    </div>
  );
};

export default LanguageSwitcher;
