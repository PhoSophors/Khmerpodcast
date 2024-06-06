import React from "react";
import AudioControl from "../audio/AudioControl";
import { useAudio } from "../../context/AudioContext";
import "./Footer.css";

const Footer = () => {
  const { currentAudio } = useAudio();

  if(!currentAudio) return null;
  
  return (
    <div className="footer-container">
      <AudioControl />
    </div>
  );
};

export default Footer;
