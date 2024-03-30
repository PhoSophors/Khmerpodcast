import React, { useState, useEffect } from "react";
import { Upload, Card, Button, Input, Form, Modal, Alert } from "antd";
import "./create.css";
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons";
import axios from "axios";
import ImgCrop from "antd-img-crop";

// =======================================================================
const Create = () => {
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  // Image state
  const [imageFileList, setImageFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchFiles();
    // handleNotification("success", "Component mounted successfully.");
  }, []);

  // Function to fetch files from the backend
  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:8085/api/upload"); // Assuming your backend endpoint is /api/upload
      setFiles(response.data);
    } catch (error) {
      setError("Error fetching files. Please try again later.");
    }
  };

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
      await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleSuccessUpload();
    } catch (error) {
      console.error("Error uploading file:", error.message);
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

    fetchFiles(); // Refresh files
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
    console.log("New File List:", newFileList);
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
    <div className="mx-auto  flex p-10  ">
      <div className="w-full ">
        <div className="uppercase tracking-wide text-xl text-indigo-500 font-semibold">
          Upload audio or video
        </div>
        <div className="tracking-wide text-sm text-gray-500">
          Create an audio or video episode in a few simple steps.
        </div>
        <div className="mt-5 font-semibold text-gray-500">
          Supported file types:
        </div>
        <div className="text-gray-500">
          Audio files: aac, mp3, m4a, wav, or mpg
        </div>

        <div className="upload-section mt-5">
          {/* upload audio */}
          <Card title="Upload Audio " className=" create-card">
            {fileList.length > 0 ? (
              <div className="audio-preview">
                <div className="flex items-center justify-between">
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
                  accept=".aac, .mp3, .m4a, .wav, .mpg"
                  showUploadList={false}
                >
                  <div>{"+ Upload"}</div>
                </Upload>
              </div>
            )}
          </Card>

          {/* upload  thumbnail */}
          <div className="mt-5 font-semibold text-gray-500">
            Supported file types:
          </div>
          <div className="text-gray-500">
            Audio files: jpeg, jpg, png and web formats
          </div>
          <Card title="Upload Thumbnail" className="mt-5 create-card">
            <ImgCrop rotate>
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                imageFileList={imageFileList}
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
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Card>

          {/* input form */}
          <Card title="Input Form" className="mt-5 create-card">
            <Form variant="filled">
              <p>Title *</p>
              <Input.TextArea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Input title"
                showCount
                maxLength={200}
                style={{ height: "90px" }}
              />

              <p className="mt-10">Description *</p>
              <Input.TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Input description"
                showCount
                maxLength={800}
                style={{ height: "200px" }}
              />
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

          {/* upload button */}
          <div className="mt-5 gap-5">
            <Button className="upload-button " style={{ backgroundColor: "#ea580c", color: "#ffffff"}}
              onClick={handleUpload}
              loading={loading}
              disabled={!isUploadEnabled()}
            >
              <CloudUploadOutlined />
              Upload
            </Button>
          </div>

          {/* nofication alert */}
          <div style={{ position: "fixed", top: 15, right: 80, zIndex: 9999 }}>
            {notification && (
              <Alert
                message={notification}
                type={
                  notification.includes("Success")
                    ? "success"
                    : notification.includes("Error")
                    ? "error"
                    : "success"
                }
                closable
                onClose={() => setNotification("")} // Clear the notification on close
              />
            )}
            {error && <Alert message={error} type="error" closable />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
