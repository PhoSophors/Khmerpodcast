import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import "./MainSection.css";
import ContentSection from "../contentSection/ContentSection";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SideMenu from "../../components/sidemenu/SideMenu";
import { useFileData } from "../../services/useFileData";

const { Content, Sider } = Layout;

const MainSection = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const { id, publicUserId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { fileData: selectedPodcast } = useFileData(id);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleSelectMenuItem = (menuItem) => {
    navigate(menuItem.key);
  };

  const handleCollapse = () => {
    setCollapsed((prevState) => !prevState);
  };

  const handlePodcastSelected = (file) => {
    navigate(`/watch-podcast/${file._id}`);
  };

  const handleUpdateProfile = () => {
    navigate(`/update-profile/${id}`);
  };

  const handleViewUserProfile = () => {
    navigate(`/public-profile/${publicUserId}`);
  };

  const renderContentSection = () => {
    if (id) {
      return <ContentSection id={id} selectedPodcast={selectedPodcast} />;
    } else {
      return (
        <ContentSection
          selectedMenuItem={location.pathname}
          onPodcastSelected={handlePodcastSelected}
          onUpdateProfile={handleUpdateProfile}
          onViewUserProfile={handleViewUserProfile}
        />
      );
    }
  };

  return (
    <Layout className="mainSection-container">
      {!isMobileView && (
        <Sider collapsed={collapsed} breakpoint="md">
          <SideMenu collapsed={collapsed} onSelectMenuItem={handleSelectMenuItem} />
        </Sider>
      )}
      <Layout>
        <Content className="content-containers">
          <Header
            onSelectMenuItem={handleSelectMenuItem}
            handleCollapse={handleCollapse}
            menuOpen={!isMobileView || !collapsed}
            collapsed={collapsed}
          />
          <div className="content-card">
            {renderContentSection()}
          </div>
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainSection;
