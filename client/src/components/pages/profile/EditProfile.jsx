import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Avatar,
  Modal,
  Card,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useParams, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageFileList, setImageFileList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = Cookies.get("authToken");

        if (authToken && id) {
          const response = await axios.get(`/auths/user-data/${id}`, {
            baseURL: process.env.REACT_APP_PROXY,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          const userData = response.data.user;
          setUsername(userData.username);
          setProfileImage(userData.profileImage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Failed to fetch user data. Please try again later.");
      }
    };

    fetchData();
  }, [id]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleProfileImageChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
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
    try {
      const authToken = Cookies.get("authToken");

      if (authToken && id) {
        const response = await axios.put(
          `/auths/user/update/${id}`,
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
          navigate(`/`);
        } else {
          message.error("Failed to update profile. Please try again later.");
        }
      } else {
        message.error("Authentication failed. Please log in again.");
      }
    } catch (error) {
      message.error("Failed to update profile. Please try again later.");
    } 
  };

  return (
    <div className="bg-slate-100">
      <div className="flex flex-col w-full items-center justify-center h-screen text-center p-5">
        <Card title="Edit Profile">
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
                  {imageFileList.length === 0 && (
                    <Avatar src={profileImage} size={100} />
                  )}
                </Upload>
              </ImgCrop>
              <Modal
                visible={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancelPreview}
              >
                <img
                  alt="preview"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
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
                className=" w-full"
                onClick={() => handleUpdateProfile(true)}
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
