import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Form, Input, Button, message, Upload, Card } from "antd";
import ImgCrop from "antd-img-crop";
import "./create.css";
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { api_url } from "../../../api/config";
import { useTranslation } from "react-i18next";

const UpdatePodcast = ({ file }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const authToken = Cookies.get("authToken")
    ? atob(Cookies.get("authToken"))
    : null;
  const { t } = useTranslation();

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      if (audioFile) {
        formData.append("audioFile", audioFile.originFileObj);
      }
      if (imageFile) {
        formData.append("imageFile", imageFile.originFileObj);
      }
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
        onUploadProgress: (progressEvent) => {
          // Calculate the upload progress
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Cap the progress at 99% until the server response is received
          percentCompleted = percentCompleted >= 100 ? 99 : percentCompleted;
          setUploadProgress(percentCompleted); // Update the upload progress state
        },
      };
      await axios.put(`${api_url}/files/update/${file._id}`, formData, config);
      // Set the progress to 100% once the server response is received
      setUploadProgress(100);
      message.success("File updated successfully");
      setIsModalVisible(false);
      window.location.reload();
    } catch (error) {
      message.error(`Error updating file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  // function used to convert a file to a base64 encoded string asynchronously.
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Functions for handleCancel Image popup
  const handleCancel = () => setPreviewOpen(false);

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle change audio file
  const handleChangeAudio = () => {
    setFileList([]);
  };

  // Function to handle change audio file
  const handleFileChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);

    // upload one file
    if (info.fileList.length > 1) {
      info.fileList = [info.fileList.pop()];
    }
    setAudioFile(info.fileList.length ? info.fileList[0] : null);
  };

  return (
    <div>
      <Modal
        className="modal-container xl:min-w-[800px]  md:min-w-[800px]"
        title="Update Podcast"
        visible={isModalVisible}
        onCancel={handleModalCancel}
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            title: file.title,
            description: file.description,
          }}
        >
          <Card className="mt-5 bg-slate-50 create-card-bg">
            <p className="font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wide">
              Title *
            </p>
            <Form.Item name="title">
              <Input.TextArea
                className="create-textarea mt-5 caret-pink-500 dark:text-slate-100"
                showCount
                maxLength={200}
                style={{ height: "100px" }}
              />
            </Form.Item>

            <p className="font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wide">
              Description *
            </p>
            <Form.Item name="description">
              <Input.TextArea
                className="create-textarea mt-5 caret-pink-500 dark:text-slate-100"
                showCount
                maxLength={800}
                style={{ height: "200px" }}
              />
            </Form.Item>
          </Card>

          <div className="upload-section mt-5">
            <div className="audio-update-container">
              <h1 className="mt-5  text-base text-start  font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-300">
                {t("create.audioSupport")}
              </h1>
              <h1 className="text-gray-500 text-base text-start dark:text-gray-300">
                {t("create.audioFormat")}
              </h1>
              <Card className="create-audio-thumnaill-card mt-5 bg-slate-50">
                <Form.Item
                  name="audioFile"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
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
                            Your browser does not support the audio element.
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
                        className="upload-audio mt-6"
                        listType="picture-card"
                        customRequest={() => {}}
                        fileList={fileList}
                        onChange={handleFileChange}
                        accept=".mp3"
                        showUploadList={false}
                      >
                        <div className="dark:text-gray-300 flex flex-col items-center justify-center">
                          <CloudUploadOutlined
                            style={{
                              fontSize: "50px",
                              color: `var(--gray-300)`,
                            }}
                          />
                          {"Upload Audio"}
                        </div>
                      </Upload>
                    </div>
                  )}
                </Form.Item>
              </Card>
            </div>

            <div className="thumnaill-update-container">
              <h1 className="mt-5  text-base  text-start  font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wide">
                {t("create.imageSupport")}
              </h1>
              <h1 className=" text-base  text-gray-500 dark:text-gray-300 text-start ">
                {t("create.imageFormat")}
              </h1>
              <Card
                // title="Thumnaill File"
                className="create-audio-thumnaill-card mt-5 bg-slate-50"
              >
                <Form.Item
                  name="imageFile"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ImgCrop>
                    <Upload
                      className="upload-image mt-6"
                      action={null}
                      listType="picture-card"
                      onPreview={handlePreview}
                      fileList={imageFile ? [imageFile] : []}
                      maxCount={1}
                      accept=".jpg, .jpeg, .png, .webp, .gif"
                      onChange={(info) => {
                        if (info.fileList.length > 1) {
                          info.fileList = [info.fileList.pop()];
                        }
                        setImageFile(
                          info.fileList.length ? info.fileList[0] : null
                        );
                      }}
                    >
                      {(!imageFile || imageFile.length === 0) && (
                        <div className="dark:text-gray-300 flex flex-col items-center justify-center">
                          <CloudUploadOutlined
                            style={{
                              fontSize: "50px",
                              color: `var(--gray-300)`,
                            }}
                          />
                          {"Upload Thumbnail"}
                        </div>
                      )}
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
                </Form.Item>
              </Card>
            </div>
          </div>

          {loading && (
            <div className="w-full mt-5 bg-white rounded-full ">
              <div
                className="bg-indigo-500 text-xs font-medium text-white text-center p-0 leading-none rounded-full"
                style={{ width: `${uploadProgress}%`, height: "0.5rem" }}
              >
                {" "}
                {uploadProgress}%
              </div>
            </div>
          )}

          <div className="mt-5 gap-5 mb-20  w-36">
            <Button
              className="button-style cursor-progress"
              loading={loading}
              htmlType="submit"
            >
              <CloudUploadOutlined />
              Upload
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdatePodcast;
