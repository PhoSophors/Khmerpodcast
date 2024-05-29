import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { message, Input, Modal } from "antd";
import { CloseOutlined, DeleteFilled } from "@ant-design/icons";
import { api_url } from "../../api/config";

const DeletePodcastBtn = ({ file }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [title, setTitle] = useState("");
  const filename = title.split(" ")[0];
  const authToken = Cookies.get('authToken') ? atob(Cookies.get('authToken')) : null;


  // Function to handle delete podcast
  const handleDeletePodcast = async () => {
    if (confirmDelete !== filename) {
      alert("You must enter the filename to confirm deletion.");
      return;
    }
    try {
      const response = await axios.delete(
        `${api_url}/files/delete/${deleteFileId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        message.success("Podcast deleted successfully");
        setIsDeleteModalVisible(false);
      }
    } catch (error) {
      message.error("Error deleting podcast");
    }
  };

  return (
    <div>
      <div
        onClick={() => {
          setIsDeleteModalVisible(true);
          setDeleteFileId(file._id);
          setTitle(file.title);
        }}
        className="p-3 cursor-pointer text-white bg-red-600 h-8 w-8 flex justify-center items-center rounded-full"
      >
        <DeleteFilled />
      </div>
      <>
        <Modal
          className="xl:min-w-96"
          title="Are you sure?"
          visible={isDeleteModalVisible}
          onCancel={() => setIsDeleteModalVisible(false)}
          footer={null}
          centered
          width={300}
          closeIcon={
            <CloseOutlined className="text-white bg-indigo-600 hover:bg-red-500 rounded-full p-3" />
          }
        >
          <div className="modal-logout mt-10 flex flex-col items-center">
            <DeleteFilled style={{ color: "red", fontSize: "70px" }} />
            <h1 className="text-center text-xl text-red-500 font-semibold mb-4 mt-5">
              Are you sure you want to delete this podcast?
            </h1>
            <h1 className="text-center  text-gray-500 dark:text-gray-300">
              This Action{" "}
              <span className="font-semibold  text-gray-600 dark:text-gray-100">CANNOT</span> be
              undone. This will permanently delete the Podcast file, and remove
              all collaborator ssositions.{" "}
            </h1>
            <p className="text-center text-gray-800 dark:text-gray-300 mt-5">
              Enter the title of podcast name{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-100">{filename}</span> to
              continue:
            </p>

            <Input
              className="mt-5 caret-pink-500 "
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder={`Enter ${filename} to confirm deletion`}
              style={{ height: "50px" }}
            />

            <button
              onClick={() => {
                if (confirmDelete === filename) {
                  handleDeletePodcast();
                } else {
                  message.warning(
                    "Incorrect confirmation. Please enter the correct filename."
                  );
                }
              }}
              className="bg-indigo-600 w-32 hover:bg-red-500 text-white p-10 font-bold py-2 px-4 rounded-3xl mt-5"
            >
              Delete
            </button>

            <button
              onClick={() => setIsDeleteModalVisible(false)}
              className="text-slate-600 hover:text-indigo-600 dark:text-gray-300 p-10 font-bold py-2 px-4 rounded-3xl mt-2"
            >
              Cancel
            </button>
          </div>
        </Modal>
      </>
    </div>
  );
};

export default DeletePodcastBtn;
