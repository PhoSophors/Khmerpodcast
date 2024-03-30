// LeftSection component
import React from "react";
import SideMenu from "../../components/sidemenu/SideMenu";

const LeftSection = ({ onSelectMenuItem }) => {
  return (
    <div>
      <SideMenu onSelectMenuItem={onSelectMenuItem} />
    </div>
  );
};

export default LeftSection;
