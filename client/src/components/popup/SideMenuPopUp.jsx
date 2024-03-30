import React, { useState } from "react";
import { Modal, Button } from "antd";
import SideMenu from "../sidemenu/SideMenu";
import { Card } from "antd";

const SideMenuPopUp = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="dashed" onClick={showModal}>
        Open Popup
      </Button>
      <Modal visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Card>
          <SideMenu />
        </Card>
      </Modal>
    </div>
  );
};

export default SideMenuPopUp;
