import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Card, Modal, message, Menu, Dropdown } from "antd";
import {
  ShareAltOutlined,
  LinkOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  FacebookMessengerIcon,
  WhatsappIcon,
} from "react-share";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
} from "react-share";

const SocialBtn = ({ file }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isAddedToFavorites, setIsAddedToFavorites] = useState(() => {
    const cookie = Cookies.get(`favorite-${file._id}`);
    return cookie ? JSON.parse(cookie) : false;
  });

  useEffect(() => {
    Cookies.set(`favorite-${file._id}`, JSON.stringify(isAddedToFavorites));
  }, [file._id, isAddedToFavorites]);

  const handleTogglePodcastInPlaylist = async () => {
    try {
      const authToken = Cookies.get("authToken");
      let response;

      if (isAddedToFavorites) {
        response = await fetch(`/files/remove-favorite/${file._id}`, {
          method: "POST",
          baseUrl: process.env.REACT_APP_PROXY,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        response = await fetch(`/files/favorite/${file._id}`, {
          method: "POST",
          baseUrl: process.env.REACT_APP_PROXY,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Toggle the state after a successful request
      setIsAddedToFavorites(!isAddedToFavorites);
      message.success(
        isAddedToFavorites
          ? "Podcast removed from favorites"
          : "Podcast added to favorites"
      );
    } catch (error) {
      message.error("Error toggling podcast in favorites");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const shareUrl = `http://localhost:3000/viewdetailpodcast/${file._id}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    message.success("Link copied to clipboard");
  };

  const shareMenu = (
    <Menu style={{ width: "250px" }}>
      <Menu.Item key="0" onClick={showModal}>
        <ShareAltOutlined />
        {""} Share
      </Menu.Item>
      <Menu.Item key="1" onClick={handleCopyLink}>
        <LinkOutlined /> Copy Link
      </Menu.Item>
      <Menu.Item key="2" onClick={handleTogglePodcastInPlaylist}>
        {isAddedToFavorites ? (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg
                className="w-3.5 h-3.5 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 14 20"
              >
                <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z" />
              </svg>
              <span> Remove from Favorites</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg
                className="w-3.5 h-3.5 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 20"
              >
                <path
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z"
                />
              </svg>
              <span> Add to favorites</span>
            </div>
          </>
        )}
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div className="p-3 text-white  bg-indigo-600 h-8 w-8 flex justify-center items-center rounded-full">
        <Dropdown overlay={shareMenu} trigger={["click"]}>
          <MoreOutlined />
        </Dropdown>
      </div>
      <>
        <Modal
          title="Share"
          visible={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          centered
        >
          <Card>
            <div className="text-center gab-5">
              <FacebookShareButton
                className="text-center"
                url={shareUrl}
                style={{ margin: "0 5px" }}
              >
                <FacebookIcon size={45} round />
                <span>Facebook</span>
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} style={{ margin: "0 5px" }}>
                <TwitterIcon size={45} round />
                <span>Twiiter</span>
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} style={{ margin: "0 5px" }}>
                <LinkedinIcon size={45} round />
                <span>Linkedin</span>
              </LinkedinShareButton>
              <TelegramShareButton url={shareUrl} style={{ margin: "0 5px" }}>
                <TelegramIcon size={45} round />
                <span>Telegran</span>
              </TelegramShareButton>
              <FacebookMessengerShareButton
                url={shareUrl}
                appId="521270401588372"
                style={{ margin: "0 5px" }}
              >
                <FacebookMessengerIcon size={45} round />
                <span> Messenger</span>
              </FacebookMessengerShareButton>
              <WhatsappShareButton url={shareUrl} style={{ margin: "0 5px" }}>
                <WhatsappIcon size={45} round />
                <span> Whatapp</span>
              </WhatsappShareButton>
            </div>
          </Card>
        </Modal>
      </>
    </div>
  );
};

export default SocialBtn;
