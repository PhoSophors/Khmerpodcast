import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./Profile.css";
import ImgCrop from "antd-img-crop";
import { useParams, useNavigate } from "react-router-dom";
import { api_url } from "../../../api/config";
import BackBtn from "../../Btn/BackBtn";
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

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [imageFileList, setImageFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true when fetching data
        const authToken = Cookies.get("authToken");

        if (authToken && id) {
          const response = await axios.get(`${api_url}/auths/user-data/${id}`, {
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
        message.error("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false when data fetching is done
      }
    };

    fetchData();
  }, [id]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleProfileImageChange = (info) => {
    setImageFileList([...info.fileList]); // Update imageFileList
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setProfileImage(imageUrl);
      });
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
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
      setLoading(true); // Set loading to true during update

      const formData = new FormData();
      formData.append("username", username);

      if (imageFileList.length > 0) {
        const file = imageFileList[0].originFileObj;
        formData.append("profileImage", file);
      }

      const authToken = Cookies.get("authToken");
      const response = await axios.put(
        `${api_url}/auths/user/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
          onUploadProgress: (progressEvent) => {
            // Calculate the upload progress
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            percentCompleted = percentCompleted >= 100 ? 99 : percentCompleted;
            setUploadProgress(percentCompleted); // Update the upload progress state
          },
        }
      );

      if (response.status === 200) {
        message.success("Profile updated successfully");
        navigate(`/`);
      } else {
        message.error("Failed to update profile. Please try again later.");
      }
    } catch (error) {
      message.error("Failed to update profile. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after update
    }
  };

  return (
    <div className="bg-indigo-600">
      <div className="flex flex-col w-full items-center justify-center h-screen text-center">
        <Card title="Edit Profile" className="p-2.5 h-4/6 edit-profile-card bg-slate-100" >
          <BackBtn />
          <Form layout="vertical" className="xl:w-96 md:w-96 min-w-full">
            <Form.Item className="text-center flex justify-center">
              <ImgCrop>
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  fileList={imageFileList}
                  accept=".jpg, .jpeg"
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

            <div class="w-full mt-5 bg-slate-100 rounded-full">
              <div
                class="bg-indigo-500 text-xs font-medium text-slate-100 text-center p-0 leading-none rounded-full"
                style={{ width: `${uploadProgress}%` }}
              >
                {" "}
                {uploadProgress}%
              </div>
            </div>

            <Form.Item>
              <Button
                onClick={() => handleUpdateProfile(true)}
                className="saveBtn"
                size="large"
                loading={loading} // Use loading state for the Button component
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
