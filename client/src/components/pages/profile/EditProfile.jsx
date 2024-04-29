import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Form, Input, Button, message, Upload, Avatar, Modal } from "antd";
import {
  LeftOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

const EditProfile = ({ user }) => {
  const [username, setUsername] = useState(user.username);
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [loading, setLoading] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageFileList, setImageFileList] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setUsername(user.username);
    setProfileImage(user.profileImage);
  }, [user]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleProfileImageChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setProfileImage(imageUrl);
        setLoading(false);
      });
    } else if (info.file.status === "error" || info.file.status === "removed") {
      setLoading(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancelPreview = () => setPreviewOpen(false);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUpdateProfile = async () => {
    setConfirmLoading(true);
    try {
      const authToken = Cookies.get("authToken");

      if (authToken && user._id) {
        const response = await axios.put(
          `http://localhost:4000/auths/user/${user._id}`, 
          {
            username,
            profileImage,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 200) {
          message.success("Profile updated successfully");
          // Refresh the page
          window.location.reload();
        } else {
          message.error("Failed to update profile. Please try again later.");
        }
      } else {
        message.error("Authentication failed. Please log in again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile. Please try again later.");
    } finally {
      setConfirmLoading(false);
      setConfirmVisible(false);
    }
  };

  return (
    <div>
      <Button
        className="back-button bg-slate-500 h- text-white mt-5"
        type="text"
        icon={<LeftOutlined />}
        // onClick={() => history.goBack()}
      >
        Back
      </Button>

      <div className="flex justify-center items-center mt-5">
        <Form layout="vertical" className="w-96">
          <Form.Item className="text-center">
            <ImgCrop>
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                imageFileList={imageFileList}
                onChange={handleProfileImageChange}
                onPreview={handlePreview}
              >
                {imageFileList.length === 0}
                {loading ? (
                  <LoadingOutlined />
                ) : profileImage ? (
                  <Avatar src={profileImage} size={100} />
                ) : (
                  <Avatar size={100} icon={<UploadOutlined />} />
                )}
              </Upload>
            </ImgCrop>
            <Modal
              visible={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancelPreview}
            >
              <img alt="preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Form.Item>
          <Form.Item label="Username *">
            <Input
              value={username}
              onChange={handleUsernameChange}
              className="input-field"
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="submit-button"
              type="primary"
              onClick={() => setConfirmVisible(true)}
              style={{
                backgroundColor: "#3730a3",
                color: "#ffffff",
              }}
            >
              Save Changes
            </Button>
            <Modal
              title="Confirm"
              visible={confirmVisible}
              onOk={handleUpdateProfile}
              confirmLoading={confirmLoading}
              onCancel={() => setConfirmVisible(false)}
            >
              <p>Are you sure you want to update your profile?</p>
            </Modal>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
