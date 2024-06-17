import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./Profile.css";
import ImgCrop from "antd-img-crop";
import { useNavigate } from "react-router-dom";
import { api_url } from "../../../api/config";
import BackBtn from "../../Btn/BackBtn";
import { useUser } from "../../../context/UserContext";
import {
  CameraFilled,
  CloudUploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Avatar,
  Modal,
  Card,
  Spin,
} from "antd";

const EditProfile = () => {
  // username and bio
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  //  social media links
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");

  // profile image
  const [profileImage, setProfileImage] = useState("");
  const [imageFileList, setImageFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  // Get user data
  const id = user ? user._id : null;
  const authToken = Cookies.get("authToken")
    ? atob(Cookies.get("authToken"))
    : null;

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio);
      setFacebook(user.facebook);
      setWebsite(user.website);
      setTwitter(user.twitter);
      setInstagram(user.instagram);
      setYoutube(user.youtube);
      setTiktok(user.tiktok);
      setProfileImage(user.profileImage);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-10 spin-loading ">
        <Spin />
      </div>
    );
  }

  // Handle username and bio change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleFacebookChange = (e) => {
    const inputValue = e.target.value;
    const baseUrl = "https://facebook.com/";

    if (inputValue === "" || inputValue === null || inputValue === undefined) {
      setFacebook("");
    } else if (!inputValue.startsWith(baseUrl)) {
      setFacebook(baseUrl + inputValue);
    } else {
      setFacebook(inputValue);
    }
  };

  const handleWebsiteChange = (e) => {
    const inputValue = e.target.value;
    const baseUrl = "https://";

    if (inputValue === "" || inputValue === null || inputValue === undefined) {
      setWebsite("");
    } else if (!inputValue.startsWith(baseUrl)) {
      setWebsite(baseUrl + inputValue);
    } else {
      setWebsite(e.target.value);
    }
  };

  // handle social media links
  const handleTwitterChange = (e) => {
    const inputValue = e.target.value;
    const baseUrl = "https://twitter.com/";

    if (inputValue === "" || inputValue === null || inputValue === undefined) {
      setTwitter("");
    } else if (!inputValue.startsWith(baseUrl)) {
      setTwitter(baseUrl + inputValue);
    } else {
      setTwitter(inputValue);
    }
  };

  const handleInstagramChange = (e) => {
    const inputValue = e.target.value;
    const baseUrl = "https://instagram.com/";

    if (inputValue === "" || inputValue === null || inputValue === undefined) {
      setInstagram("");
    } else if (!inputValue.startsWith(baseUrl)) {
      setInstagram(baseUrl + inputValue);
    } else {
      setInstagram(inputValue);
    }
  };

  const handleYoutubeChange = (e) => {
    const inputValue = e.target.value;
    const baseUrl = "https://youtube.com/user/";

    if (inputValue === "" || inputValue === null || inputValue === undefined) {
      setYoutube("");
    } else if (!inputValue.startsWith(baseUrl)) {
      setYoutube(baseUrl + inputValue);
    } else {
      setYoutube(inputValue);
    }
  };

  const handleTiktokChange = (e) => {
    const inputValue = e.target.value;
    const baseUrl = "https://tiktok.com/@";

    if (inputValue === "" || inputValue === null || inputValue === undefined) {
      setTiktok("");
    } else if (!inputValue.startsWith(baseUrl)) {
      setTiktok(baseUrl + inputValue);
    } else {
      setTiktok(inputValue);
    }
  };

  // Handle profile image change
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
      setLoading(true);
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("facebook", facebook);
      formData.append("website", website);
      formData.append("twitter", twitter);
      formData.append("instagram", instagram);
      formData.append("youtube", youtube);
      formData.append("tiktok", tiktok);

      if (imageFileList.length > 0) {
        const file = imageFileList[0].originFileObj;
        formData.append("profileImage", file);
      }

      const response = await axios.put(
        `${api_url}/users/user-update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            percentCompleted = percentCompleted >= 100 ? 99 : percentCompleted;
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200) {
        message.success("Profile updated successfully");
        navigate(`/profile`);
      } else {
        message.error("Failed to update profile. Please try again later.");
      }
    } catch (error) {
      message.error("Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xl:p-2 md:p-2 p-0 flex flex-col w-full items-center justify-center  text-center">
      <Card className="update-profile-card p-2.5 min-w-full  flex justify-center">
        <BackBtn />
        <span className="xl:text-4xl md:text-4xl text-2xl mt-10 dark:text-gray-300 font-semibold mb-10 flex justify-center">
          Profile settings
        </span>
        <div className="xl:w-[700px]">
          <Form layout="vertical" className="min-w-full">
            <Form.Item className="text-center flex justify-center">
              <ImgCrop>
                <Upload
                  className="profile-image-upload"
                  action={null}
                  listType="picture-card"
                  fileList={imageFileList}
                  accept=".jpg, .jpeg"
                  onChange={handleProfileImageChange}
                  onPreview={handlePreview}
                >
                  {imageFileList.length === 0 && (
                    <Avatar
                      style={{ borderRadius: "10px" }}
                      src={profileImage}
                      icon={<UserOutlined />}
                      size={100}
                    />
                  )}
                </Upload>
              </ImgCrop>
              <div
                className=" edit-image p-1 cursor-pointer text-white bg-slate-200 dark:bg-slate-300 h-7 w-7 flex justify-center items-center rounded-full"
                style={{
                  position: "absolute",
                  bottom: -10,
                  right: -10,
                  fontSize: "18px",
                  color: "#000",
                  zIndex: 1000,
                  cursor: "pointer",
                }}
              >
                <CameraFilled />
              </div>

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
              <span className="text-sm text-slate-500  dark:text-gray-400 text-start flex">
                We’d like people to use real names in a community, so people
                would know who’s who.
              </span>
            </Form.Item>

            <span className="text-2xl dark:text-gray-300 mt-10 mb-10 font-semibold text-start flex">
              About you
            </span>
            <Form.Item label="Bio *">
              <Input.TextArea
                className="input-fieldcaret-pink-500 dark:text-slate-100 "
                value={bio}
                onChange={handleBioChange}
                showCount
                maxLength={101}
                style={{
                  height: "100px",
                  resize: "none",
                  borderRadius: "10px",
                }}
              />
              <span className="text-sm text-slate-500 dark:text-gray-400 text-start flex">
                Brief description for your profile.
              </span>
            </Form.Item>

            {/* map and website */}
            <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5">
              <div className="w-full sm:w-1/2">
                <Form.Item label="Facebook *">
                  <Input
                    type="text"
                    value={facebook}
                    onChange={handleFacebookChange}
                    className="input-field"
                  />
                </Form.Item>
              </div>
              <div className="w-full sm:w-1/2">
                <Form.Item label="Website *">
                  <Input
                    value={website}
                    onChange={handleWebsiteChange}
                    className="input-field"
                  />
                </Form.Item>
              </div>
            </div>

            {/* socail media link */}
            <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5">
              <div className="w-full sm:w-1/2">
                <Form.Item label="Twitter *">
                  <Input
                    type="text"
                    value={twitter}
                    onChange={handleTwitterChange}
                    className="input-field"
                  />
                </Form.Item>
              </div>
              <div className="w-full sm:w-1/2">
                <Form.Item label="Instagram *">
                  <Input
                    value={instagram}
                    onChange={handleInstagramChange}
                    className="input-field"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5">
              <div className="w-full sm:w-1/2">
                <Form.Item label="YouTube *">
                  <Input
                    value={youtube}
                    onChange={handleYoutubeChange}
                    className="input-field"
                  />
                </Form.Item>
              </div>
              <div className="w-full sm:w-1/2">
                <Form.Item label="TikTok *">
                  <Input
                    value={tiktok}
                    onChange={handleTiktokChange}
                    className="input-field"
                  />
                </Form.Item>
              </div>
            </div>

            {loading && (
              <div className="w-full uploadProgress mt-5 rounded-full">
                <div
                  className="bg-indigo-500 text-xs font-medium text-slate-100 text-center p-0 leading-none rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {" "}
                  {uploadProgress}%
                </div>
              </div>
            )}

            <Form.Item>
              <Button
                onClick={() => handleUpdateProfile(true)}
                className="update-profile-btn mt-5 mb-20"
                size="large"
                loading={isLoading}
              >
                <CloudUploadOutlined /> Update Profile
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default EditProfile;
