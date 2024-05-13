import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Form, Input, Button, message, Upload, Card } from "antd";
import ImgCrop from "antd-img-crop";
import "./create.css";
import { CloseOutlined } from "@ant-design/icons";
import { api_url } from "../../../api/config";

const UpdatePodcast = ({ file }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const authToken = Cookies.get("authToken");
  const [form] = Form.useForm();
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

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
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
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
        className="modal-container xl:min-w-[800px]"
        title="Update Podcast"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
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
          <Card className="mt-5 bg-slate-50">
            <p className="font-semibold text-gray-500 uppercase tracking-wide">
              Title *
            </p>
            <Form.Item name="title">
              <Input.TextArea
                className="bg-slate-50"
                showCount
                maxLength={200}
                style={{ height: "100px" }}
              />
            </Form.Item>

            <p className="font-semibold text-gray-500 uppercase tracking-wide">
              Description *
            </p>
            <Form.Item name="description">
              <Input.TextArea
                className="bg-slate-50"
                showCount
                maxLength={800}
                style={{ height: "150px" }}
              />
            </Form.Item>
          </Card>

          <Card title="Audio File" className="mt-5 bg-slate-50">
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
                          src={URL.createObjectURL(fileList[0].originFileObj)}
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
                    listType="picture-card"
                    customRequest={() => {}}
                    fileList={fileList}
                    onChange={handleFileChange}
                    accept=".aac, .mp3, .m4a"
                    showUploadList={false}
                  >
                    <div>{"+ Upload"}</div>
                  </Upload>
                </div>
              )}
            </Form.Item>
          </Card>

          <Card title="Thumnaill File" className="mt-5 bg-slate-50">
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
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  onPreview={handlePreview}
                  fileList={imageFile ? [imageFile] : []}
                  maxCount={1}
                  accept=".jpg, .jpeg"
                  onChange={(info) => {
                    if (info.fileList.length > 1) {
                      info.fileList = [info.fileList.pop()];
                    }
                    setImageFile(
                      info.fileList.length ? info.fileList[0] : null
                    );
                  }}
                >
                  <div>{"+ Upload "}</div>
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

          <div class="w-full mt-5 bg-white rounded-full ">
            <div
              class="bg-indigo-500 text-xs font-medium text-white text-center p-0 leading-none rounded-full"
              style={{ width: `${uploadProgress}%`, height: "0.5rem" }}
            >
              {" "}
              {uploadProgress}%
            </div>
          </div>

          <Button
            className="upload-button mt-10 mb-5 "
            style={{ backgroundColor: "#f43f5e", color: "#ffffff" }}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Update
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdatePodcast;
