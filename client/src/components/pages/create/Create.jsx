import React, { useState } from "react";
import { Upload, Card, Button, Input, Form, Modal, message } from "antd";
import "./create.css";
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import Cookies from "js-cookie";
import { api_url } from "../../../api/config";
import { useTranslation } from "react-i18next";

// =======================================================================
const Create = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setNotification] = useState("");
  // Image state
  const [imageFileList, setImageFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const authToken = Cookies.get("authToken")
    ? atob(Cookies.get("authToken"))
    : null;
  const id = Cookies.get("id") ? atob(Cookies.get("id")) : null;
  const { t } = useTranslation();

  const handleFileChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
  };

  //  Function to handle upload
  const handleUpload = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("audioFile", file.originFileObj);
      });
      formData.append("title", title); // Append title and description to the formData
      formData.append("description", description);
      formData.append("imageFile", imageFileList[0].originFileObj); // Append the image file
      formData.append("user", id); // Append the user ID
      await axios.post(`${api_url}/files/upload?id=${id}`, formData, {
        onUploadProgress: (progressEvent) => {
          // Calculate the upload progress
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          percentCompleted = percentCompleted >= 100 ? 99 : percentCompleted;
          setUploadProgress(percentCompleted); // Update the upload progress state
        },
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      message.success("File uploaded successfully");
      handleSuccessUpload();
    } catch (error) {
      message.error(`Error uploading file: ${error.message}`);
      handleNotification("error", `Error uploading file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle success or error and set the notification
  const handleNotification = (type, message) => {
    setNotification(message);

    // Clear the notification after 3 seconds
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  // Function to handle change audio file
  const handleChangeAudio = () => {
    setFileList([]);
  };

  // Function to reset form fields
  const resetFormFields = () => {
    setTitle("");
    setDescription("");
    setFileList([]);
    setImageFileList([]);
  };

  // Function to handle successful upload
  const handleSuccessUpload = () => {
    handleNotification("success", "Files uploaded successfully");

    // fetchFiles(); // Refresh files
    resetFormFields(); // Clear form fields
    setImageFileList([]); // clear image from fields
  };

  // Functions for handleCancel Image popup
  const handleCancel = () => setPreviewOpen(false);

  // Functions for  handle image Preview
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

  // Function to handleChange thumnail
  const handleChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 1) {
      newFileList = [newFileList.pop()];
    }
    setImageFileList(newFileList);
  };

  // function used to convert a file to a base64 encoded string asynchronously.
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Function to handle reset form
  const handleReset = () => {
    setTitle("");
    setDescription("");
  };

  // function to handle Upload Enabled for upload button
  const isUploadEnabled = () => {
    return (
      title !== "" &&
      description !== "" &&
      fileList.length > 0 &&
      imageFileList.length > 0
    );
  };

  return (
    <div className="mx-auto flex xl:p-8">
      <div className="w-full p-2">
        <Card
          className=" text-center"
          style={{ backgroundColor: "transparent", border: "none" }}
          bodyStyle={{ padding: 0 }}
        >
          <h1 className="uppercase xl:text-start md:text-start text-ceter text-2xl md:mt-3 mt-3 text-indigo-500 font-semibold">
            {t("create.welcomeTitle")}
          </h1>
          <h1 className="tracking-wide mx-5 xl:mx-0 md:mx-0 text-base  xl:text-start md:text-start text-ceter text-gray-500 dark:text-gray-300">
            {t("create.welcomeDescription")}
          </h1>

          <div className="upload-section mt-5">
            <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5">
              {/* set two colum */}
              <div className="w-full sm:w-1/2">
                <h1 className="mt-5  text-base text-start  font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-300">
                  {t("create.audioSupport")}
                </h1>
                <h1 className="text-gray-500 text-base text-start dark:text-gray-300">
                  {t("create.audioFormat")}
                </h1>
                {/* upload audio */}
                <Card className="mt-5 create-card-bg">
                  {fileList.length > 0 ? (
                    <div className="audio-preview">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <audio controls>
                            <source
                              src={URL.createObjectURL(
                                fileList[0].originFileObj
                              )}
                              type="audio/mpeg"
                            />
                            <h1 className="text-base ">
                              Your browser does not support the audio element
                            </h1>
                          </audio>
                        </div>
                        <div className="flex items-center">
                          <Button
                            className="replace-button ml-2"
                            icon={<CloseOutlined />}
                            onClick={handleChangeAudio}
                          ></Button>
                        </div>
                      </div>
                      <p className="file-name mt-5 ml-2">{fileList[0].name}</p>
                    </div>
                  ) : (
                    <div className="upload-container">
                      <Upload
                        listType="picture-card"
                        customRequest={() => {}}
                        fileList={fileList}
                        onChange={handleFileChange}
                        accept=".aac, .mp3, .ogg "
                        showUploadList={false}
                      >
                        <div className="dark:text-gray-300">
                          {"Upload Audio"}
                        </div>
                      </Upload>
                    </div>
                  )}
                </Card>
              </div>

              {/* upload  thumbnail */}
              <div className="w-full sm:w-1/2 ">
                <h1 className="mt-5  text-base  text-start  font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wide">
                  {t("create.imageSupport")}
                </h1>
                <h1 className=" text-base  text-gray-500 dark:text-gray-300 text-start ">
                  {t("create.imageFormat")}
                </h1>
                <Card className="mt-5 items-center flex justify-center create-card-bg">
                  <ImgCrop>
                    <Upload
                      // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                      action={null}
                      listType="picture-card"
                      fileList={imageFileList ? imageFileList : []}
                      accept=".jpg, .jpeg"
                      onChange={handleChange}
                      onPreview={handlePreview}
                    >
                      {imageFileList.length === 0 && ""}
                      <div className="dark:text-gray-300">
                        {"Upload Thumnaill"}
                      </div>
                    </Upload>
                  </ImgCrop>
                  <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                </Card>
              </div>
            </div>

            {/* input form */}
            <Card className="mt-5 create-card-bg">
              <Form variant="filled">
                <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5 gap-5">
                  <div className="w-full sm:w-2/5 ">
                    <h1 className=" text-base  font-semibold  text-start text-gray-500 dark:text-gray-300 uppercase tracking-wide">
                      {t("create.title")} *
                    </h1>
                    <Input.TextArea
                      className="create-textarea mt-5 caret-pink-500 dark:text-slate-100 "
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("create.titlePlaceholder")}
                      showCount
                      maxLength={200}
                      style={{ height: "200px" }}
                    />
                  </div>
                  <div className="w-full sm:w-3/5">
                    <h1 className=" text-base  font-semibold text-start text-gray-500 dark:text-gray-300 uppercase tracking-wide">
                      {t("create.description")} *
                    </h1>
                    <Input.TextArea
                      className="create-textarea mt-5 caret-pink-500 dark:text-slate-100"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t("create.descriptionPlaceholder")}
                      showCount
                      maxLength={800}
                      style={{ height: "200px" }}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleReset}
                  style={{ float: "right" }}
                  className="mt-10"
                  disabled={!title && !description}
                >
                  <span className="dark:text-slate-100">Reset</span>
                </Button>
              </Form>
            </Card>

            {loading && (
              <div className="w-full mt-5 bg-white rounded-full">
                <div
                  className="text-xs bg-indigo-600 font-medium text-center p-0 leading-none rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <span className="text-white ">{uploadProgress}%</span>
                </div>
              </div>
            )}

            {/* upload button */}
            <div className="mt-5 gap-5 mb-20  w-36">
              <Button
                className="button-style  cursor-progress"
                style={{ backgroundColor: "#4f46e5", color: "#ffffff" }}
                onClick={handleUpload}
                loading={loading}
                disabled={!isUploadEnabled()}
              >
                <CloudUploadOutlined />
                Upload
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Create;
