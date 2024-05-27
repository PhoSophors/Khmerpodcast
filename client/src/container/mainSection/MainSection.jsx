import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./MainSection.css";
import RightSection from "../rightSection/RightSection";
import Header from "../../components/header/Header";
import ViewDetailPodcast from "../../components/pages/viewDetailPodcast/ViewDetailPodcast";
import Footer from "../../components/footer/Footer";
import { useUser } from "../../services/useUser";
import SideMenu from "../../components/sidemenu/SideMenu";

const { Content, Sider } = Layout;

const MainSection = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { fileData, fetchPodcast, user, isLoggedIn } = useUser(id);

  const selectedMenuItem = useMemo(() => location.pathname, [location.pathname]);

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

  useEffect(() => {
    if (id) {
      fetchPodcast(id);
    }
  }, [id, fetchPodcast]);

  const handleSelectMenuItem = (menuItem) => {
    selectedMenuItem(menuItem);
  };

  const handleCollapse = () => {
    setCollapsed((prevState) => !prevState);
  };

  const handlePodcastSelected = (file) => {
    navigate(`/watch-podcast/${file._id}`);
  };

  const handleCloseDetailPodcast = () => {
    navigate(location.pathname);
  };

  return (
    <Layout>
      {!isMobileView && (
        <Sider collapsed={collapsed} breakpoint="md">
          <SideMenu
            collapsed={collapsed}
            onSelectMenuItem={handleSelectMenuItem}
            isLoggedIn={isLoggedIn}
            user={user}
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
              <ViewDetailPodcast
                id={id}
                file={fileData}
                onClose={handleCloseDetailPodcast}
                selectedMenuItem={selectedMenuItem}
                handleCloseDetailPodcast={handleCloseDetailPodcast}
              />
            ) : (
              <RightSection selectedMenuItem={selectedMenuItem} onPodcastSelected={handlePodcastSelected} />
            )}
          </div>
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainSection;
