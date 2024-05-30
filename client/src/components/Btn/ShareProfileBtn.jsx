import React, { useState, useRef } from "react";
import { Card, Modal, message } from "antd";
import { useUser } from "../../context/UserContext";
import QRCode from "qrcode.react";
import logo from "../assets/logo.jpg";
import html2canvas from "html2canvas";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  CloseOutlined,
  LinkOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const ShareProfileBtn = ({ userId }) => {
  const { user } = useUser();
  const id = userId || (user ? user._id : null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const qrCodeRef = useRef(null);

  const handleShowModalMode = () => {
    setIsModalVisible(true);
  };

  const shareUrl = `https://khmerpodcast.vercel.app/public-profile/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    message.success("Link copied to clipboard");
  };

  const handleDownloadQRCode = () => {
    const qrCodeDiv = qrCodeRef.current;
    if (!qrCodeDiv) {
      console.error("Cannot find QR code div");
      return;
    }
    html2canvas(qrCodeDiv).then((canvas) => {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      // downloadLink.download = `${id}_khmerPodcast_QR.png`;
      downloadLink.download = `KhmerPodcast_User_Profile_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  };

  return (
    <>
      <div
        onClick={handleShowModalMode}
        className="mt-5 cursor-pointer rounded-xl p-3 relative border w-full"
      >
        <h2 className="text-gray-500 text-base dark:text-gray-300 mt- mx-7 text-center text-lg">
          Share Profile
        </h2>
      </div>
      <Modal
        className="modal-container w-auto"
        title="Share Profile"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        closeIcon={
          <CloseOutlined className="text-white bg-indigo-600 hover:bg-red-500 rounded-full p-3" />
        }
        bodyStyle={{
          padding: "0",
          overflow: "auto",
          maxHeight: `calc(100vh - 200px)`,
        }}
      >
        <Card className="mt-5 bg-slate-50 flex justify-center">
          <div
            ref={qrCodeRef}
            style={{
              width: "200px",
              height: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="relative p-5  bg-white rounded-xl">
              <QRCode
                value={shareUrl}
                renderAs="canvas"
                size={170}
                fgColor="#4f46e5"
                bgColor="white"
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </div>
          </div>
          <div className="text-center flex flex-row mt-3 justify-center gap-5 mt-5">
            <div className="flex flex-col items-center">
              <DownloadOutlined
                onClick={handleDownloadQRCode}
                className="text-white cursor-pointer bg-red-500 hover:bg-red-500 rounded-full p-3"
              />
              <span className="dark:text-gray-300">Download</span>
            </div>

            <div className="flex flex-col items-center">
              <LinkOutlined
                onClick={handleCopyLink}
                className="text-white cursor-pointer bg-red-500 hover:bg-red-500 rounded-full p-3"
              />
              <span className="dark:text-gray-300">Copy Link</span>
            </div>
          </div>
        </Card>

        <Card className="mt-5" title="Share to socail media">
          <div className="text-center mb-5 mt-5 dark:text-gray-300 gap-5">
            <FacebookShareButton
              url={shareUrl}
              style={{ margin: "0 5px 10px" }}
            >
              <FacebookIcon size={45} round />
              <span>Facebook</span>
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} style={{ margin: "0 5px 10px" }}>
              <TwitterIcon size={45} round />
              <span>Twitter</span>
            </TwitterShareButton>
            <LinkedinShareButton
              url={shareUrl}
              style={{ margin: "0 5px 10px" }}
            >
              <LinkedinIcon size={45} round />
              <span>LinkedIn</span>
            </LinkedinShareButton>
            <TelegramShareButton
              url={shareUrl}
              style={{ margin: "0 5px 10px" }}
            >
              <TelegramIcon size={45} round />
              <span>Telegram</span>
            </TelegramShareButton>
            <WhatsappShareButton
              url={shareUrl}
              style={{ margin: "0 5px 10px" }}
            >
              <WhatsappIcon size={45} round />
              <span>WhatsApp</span>
            </WhatsappShareButton>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default ShareProfileBtn;
