import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "antd";
import "./MainSection.css";
import RightSection from "../rightSection/RightSection";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SideMenu from "../../components/sidemenu/SideMenu";
import { useFileData } from "../../services/useFileData";

const { Content, Sider } = Layout;

const MainSection = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const { id } = useParams();
  const { publicUserId } = useParams();
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

  const selectedMenuItem = useMemo(
    () => location.pathname,
    [location.pathname]
  );

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

  return (
    <Layout className="mainSection-container">
      {!isMobileView && (
        <Sider collapsed={collapsed} breakpoint="md">
          <SideMenu
            collapsed={collapsed}
            onSelectMenuItem={handleSelectMenuItem}
          />
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
            {id ? (
              <RightSection
                id={id}
                selectedPodcast={selectedPodcast}
              />
            ) : (
              <RightSection
                selectedMenuItem={selectedMenuItem}
                onPodcastSelected={handlePodcastSelected}
                onUpdateProfile={handleUpdateProfile}
                onViewUserProfile={handleViewUserProfile}
              />
            )}
          </div>
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainSection;
