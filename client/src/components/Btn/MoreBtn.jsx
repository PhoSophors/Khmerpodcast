import React, { useRef, useState } from "react";
import { Card, Modal, message, Menu, Dropdown } from "antd";
import UpdatePodcast from "../pages/create/UpdatePodcast";
import { useUser } from "../../context/UserContext";
import { useFavorites } from "../../services/useFavorites";
import QRCode from "qrcode.react";
import logo from "../assets/logo.jpg";
import html2canvas from "html2canvas";
import {
  ShareAltOutlined,
  LinkOutlined,
  MoreOutlined,
  EditOutlined,
  CloseOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
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

const MoreBtn = ({ file }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some((fav) => fav._id === file._id);
  // Assuming you have access to the current user and their login status
  const { isLoggedIn, currentUser } = useUser();
  // Assuming `file.user` contains the ID of the uploader
  const isUploader = file.user && currentUser && file.user === currentUser._id;
  const [isEditing, setIsEditing] = useState(false);
  const qrCodeRef = useRef(null);

  const handleToggleFavorite = () => {
    toggleFavorite(file._id, isFavorite);
  };

  const handleToggleUpdateMode = () => {
    setIsUpdateMode((prevMode) => !prevMode);
    setIsEditing(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const shareUrl = `https://khmerpodcast.vercel.app/watch-podcast/${file._id}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    message.success("Link copied to clipboard");
  };

  //
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

  const shareMenu = (
    <Menu style={{ width: "250px", cursor: "pointer" }}>
      <Menu.Item key="uniqueKey1" onClick={showModal}>
        <ShareAltOutlined />
        <span className="mx-2">Share</span>
      </Menu.Item>
      <Menu.Item key="uniqueKey2" onClick={handleCopyLink}>
        <LinkOutlined />
        <span className="mx-2">Copy Link</span>
      </Menu.Item>

      {isLoggedIn && (
        <Menu.Item key="uniqueKey3" onClick={handleToggleFavorite}>
          {isFavorite ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg
                className="w-3.5 h-3.5 text-gray-500 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 14 20"
              >
                <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z" />
              </svg>
              <span className="mx-2">Remove from Favorites</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg
                className="w-3.5 h-3.5 text-gray-200 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 20"
              >
                <path
                  stroke="gray"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z"
                />
              </svg>
              <span className="mx-2">Add to favorites</span>
            </div>
          )}
        </Menu.Item>
      )}

      {isUploader && (
        <Menu.Item key="uniqueKey4" onClick={handleToggleUpdateMode}>
          <EditOutlined /> <span className="mx-2">Edit Podcast</span>
        </Menu.Item>
      )}
    </Menu>
  );

  if (isUpdateMode) {
    return <UpdatePodcast file={file} />;
  }

  return (
    <div>
      {!isEditing && (
        <div className="p-3 text-white bg-amber-400 h-8 w-8 flex justify-center items-center rounded-full">
          <Dropdown overlay={shareMenu} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "18px" }} />
          </Dropdown>
        </div>
      )}
      <Modal
        style={{
          body: {
            padding: "0",
            overflow: "auto",
            maxHeight: `calc(100vh - 200px)`,
          },
        }}
        bodyStyle={{
          padding: "0",
          overflow: "auto",
          maxHeight: `calc(100vh - 200px)`,
        }}
        title="Share Podcast"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
        closeIcon={
          <CloseOutlined className="text-white bg-indigo-600 hover:bg-red-500 rounded-full p-3" />
        }
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
                fgColor="red"
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  border: "2px solid red",
                  borderRadius: "50%",
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
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

        <Card className="mt-5">
          <div className="text-center mb-5 mt-5 dark:text-gray-300 gap-auto justify-around flex flex-wrap sm:flex-row md:flex-row">
            <FacebookShareButton
              url={shareUrl}
              className="flex flex-col items-center"
              style={{ margin: "0 5px 10px" }}
            >
              <FacebookIcon size={45} round />
              <span>Facebook</span>
            </FacebookShareButton>
            <TwitterShareButton
              className="flex flex-col items-center"
              url={shareUrl}
              style={{ margin: "0 5px 10px" }}
            >
              <TwitterIcon size={45} round />
              <span>Twitter</span>
            </TwitterShareButton>
            <LinkedinShareButton
              url={shareUrl}
              className="flex flex-col items-center"
              style={{ margin: "0 5px 10px" }}
            >
              <LinkedinIcon size={45} round />
              <span>LinkedIn</span>
            </LinkedinShareButton>
            <TelegramShareButton
              url={shareUrl}
              className="flex flex-col items-center"
              style={{ margin: "0 5px 10px" }}
            >
              <TelegramIcon size={45} round />
              <span>Telegram</span>
            </TelegramShareButton>
            <WhatsappShareButton
              url={shareUrl}
              className="flex flex-col items-center"
              style={{ margin: "0 5px 10px" }}
            >
              <WhatsappIcon size={45} round />
              <span>WhatsApp</span>
            </WhatsappShareButton>
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default MoreBtn;
