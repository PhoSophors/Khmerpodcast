import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Card, Modal, message, Menu, Dropdown } from "antd";
import UpdatePodcast from "../pages/create/UpdatePodcast";
import { api_url } from "../../api/config";
import axios from "axios";
import { useFavoritePodcasts } from "../../context/FavoritePodcastsContext";
import {
  ShareAltOutlined,
  LinkOutlined,
  MoreOutlined,
  EditOutlined,
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

const MoreBtn = ({ file }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const authToken = Cookies.get("authToken");
  const id = Cookies.get("id");
  const {
    favoritePodcasts,
    addPodcastToFavorites,
    removePodcastFromFavorites,
  } = useFavoritePodcasts();
  const isFavorite = favoritePodcasts.includes(file.id);

  useEffect(() => {
    if (authToken) {
      // Fetch user data if user is logged in
      axios
        .get(`${api_url}/auths/user-data/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const userData = response.data.user;
          if (userData) {
            // Update user data only if valid data is received
            setUser(userData);
            setIsLoggedIn(true);
          }
        })
        .catch((error) => {
          message.error("Error fetching user data");
        });
    }
  }, [authToken, id]);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removePodcastFromFavorites(file.id);
      message.success("Podcast removed from favorites");
    } else {
      await addPodcastToFavorites(file.id);
      message.success("Podcast added to favorites");
    }
  };

  const handleToggleUpdateMode = () => {
    setIsUpdateMode(!isUpdateMode);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const shareUrl = `https://khmerpodcast.vercel.app/${file._id}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    message.success("Link copied to clipboard");
  };

  const shareMenu = (
    <Menu style={{ width: "250px" }}>
      <Menu.Item key="0" onClick={showModal}>
        <ShareAltOutlined />
        <span className="mx-2">Share</span>
      </Menu.Item>
      <Menu.Item key="1" onClick={handleCopyLink}>
        <LinkOutlined />
        <span className="mx-2">Copy Link</span>
      </Menu.Item>

      {isLoggedIn && (
        <Menu.Item key="2" onClick={handleToggleFavorite}>
          {isFavorite ? (
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
                <span className="mx-2">Remove from Favorites</span>
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
                <span className="mx-2">Add to favorites</span>
              </div>
            </>
          )}
        </Menu.Item>
      )}

      {isLoggedIn && user && user.id === file.user.id && (
        <Menu.Item key="3" onClick={handleToggleUpdateMode}>
          <EditOutlined /> <span className="mx-2">Edit Podcast</span>
        </Menu.Item>
      )}
    </Menu>
  );

  if (isUpdateMode) {
    if (file) {
      return <UpdatePodcast file={file} />;
    } else {
      return null;
    }
  }

  return (
    <div>
      <div className="p-3 text-white bg-amber-400 h-8 w-8 flex justify-center items-center rounded-full">
        <Dropdown overlay={shareMenu} trigger={["click"]}>
          <MoreOutlined style={{ fontSize: "18px" }} />
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
              <FacebookShareButton url={shareUrl} style={{ margin: "0 5px" }}>
                <FacebookIcon size={45} round />
                <span>Facebook</span>
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} style={{ margin: "0 5px" }}>
                <TwitterIcon size={45} round />
                <span>Twitter</span>
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} style={{ margin: "0 5px" }}>
                <LinkedinIcon size={45} round />
                <span>LinkedIn</span>
              </LinkedinShareButton>
              <TelegramShareButton url={shareUrl} style={{ margin: "0 5px" }}>
                <TelegramIcon size={45} round />
                <span>Telegram</span>
              </TelegramShareButton>
              <FacebookMessengerShareButton
                url={shareUrl}
                appId="521270401588372"
                style={{ margin: "0 5px" }}
              >
                <FacebookMessengerIcon size={45} round />
                <span>Messenger</span>
              </FacebookMessengerShareButton>
              <WhatsappShareButton url={shareUrl} style={{ margin: "0 5px" }}>
                <WhatsappIcon size={45} round />
                <span>WhatsApp</span>
              </WhatsappShareButton>
            </div>
          </Card>
        </Modal>
      </>
    </div>
  );
};

export default MoreBtn;
