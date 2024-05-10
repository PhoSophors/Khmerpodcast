import React, { useState } from "react";
import { Upload, Card, Button, Input, Form, Modal, message } from "antd";
import "./create.css";
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import Cookies from "js-cookie";

// =======================================================================
const Create = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [notification, setNotification] = useState("");
  const [ , setNotification] = useState("");
  // Image state
  const [imageFileList, setImageFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const authToken = Cookies.get("authToken");
  const id = Cookies.get("id");
  const [uploadProgress, setUploadProgress] = useState(0);

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
      await axios.post(`${process.env.REACT_APP_BACKEND_API}/files/upload?id=${id}`, formData, {
        onUploadProgress: (progressEvent) => { 
          // Calculate the upload progress
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
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
    // console.log("New File List:", newFileList);
    // Update the imageFileList with the new file list
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
        <Card style={{ backgroundColor: "transparent" }}>
          <div className="uppercase tracking-wide text-xl text-indigo-500 font-semibold">
            Upload Podcast
          </div>
          <div className="tracking-wide text-sm text-gray-500">
            Create an Podcast episode in a few simple steps.
          </div>

          <div className="upload-section mt-5">
            <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5">
              {/* set two colum */}
              <div className="w-full sm:w-1/2">
                <div className="mt-5 font-semibold text-gray-500 uppercase tracking-wide">
                  Supported file types:
                </div>
                <div className="text-gray-500">Audio files: aac, mp3</div>
                {/* upload audio */}
                <Card title="Upload Audio " className="mt-5">
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
                        listType="picture-card"
                        customRequest={() => {}}
                        fileList={fileList}
                        onChange={handleFileChange}
                        accept=".aac, .mp3, .ogg "
                        showUploadList={false}
                      >
                        <div>{"+ Upload"}</div>
                      </Upload>
                    </div>
                  )}
                </Card>
              </div>

              {/* upload  thumbnail */}
              <div className="w-full sm:w-1/2 ">
                <div className="mt-5 font-semibold text-gray-500 uppercase tracking-wide">
                  Supported file types:
                </div>
                <div className="text-gray-500">Thumnaill files: jpeg, jpg</div>
                <Card title="Upload Thumbnail" className="mt-5">
                  <ImgCrop>
                    <Upload
                      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                      listType="picture-card"
                      fileList={imageFileList}
                      accept=".jpg, .jpeg"
                      onChange={handleChange}
                      onPreview={handlePreview}
                    >
                      {imageFileList.length === 0 && "+ Upload"}
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
            <Card title="Input Form" className="mt-5 create-card">
              <Form variant="filled">
                <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5 gap-5">
                  <div className="w-full sm:w-2/5 ">
                    <p className="font-semibold text-gray-500 uppercase tracking-wide">
                      Title *
                    </p>
                    <Input.TextArea
                      className="mt-5 caret-pink-500 "
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Input title"
                      showCount
                      maxLength={200}
                      style={{ height: "200px" }}
                    />
                  </div>
                  <div className="w-full sm:w-3/5">
                    <p className="font-semibold text-gray-500 uppercase tracking-wide">
                      Description *
                    </p>
                    <Input.TextArea
                      className="mt-5 caret-pink-500 "
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Input description"
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
                  Reset
                </Button>
              </Form>
            </Card>

            <div class="w-full mt-5 bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                class="bg-indigo-500 text-xs font-medium text-blue-100 text-center p-0 leading-none rounded-full"
                style={{ width: `${uploadProgress}%` }}
              >
                {" "}
                {uploadProgress}%
              </div>
            </div>

            {/* upload button */}
            <div className="mt-5 gap-5 mb-20">
              <Button
                className="upload-button animate-bounce cursor-progress"
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
