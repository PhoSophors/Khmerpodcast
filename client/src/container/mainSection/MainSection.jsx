import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "antd";
import "./MainSection.css";
import RightSection from "../rightSection/RightSection";
import Header from "../../components/header/Header";
import ViewDetailPodcast from "../../components/pages/viewDetailPodcast/ViewDetailPodcast";
import Footer from "../../components/footer/Footer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../api/config";
import { message } from "antd";
import SideMenu from "../../components/sidemenu/SideMenu";

const { Content, Sider } = Layout;

const MainSection = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const selectedMenuItem = useMemo(() => location.pathname, [location.pathname]);

  useEffect(() => {
    const fetchPodcast = async () => {
      if (id) {
        try {
          const response = await axios.get(`${api_url}/files/get-file/${id}`);
          if (response.data) {
            setSelectedPodcast(response.data);
          } else {
            message.error("Podcast not found");
          }
        } catch (error) {
          message.error("Error fetching podcast");
        }
      } else {
        setSelectedPodcast(null);
      }
    };

    fetchPodcast();
  }, [id]);

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

  const handleCloseDetailPodcast = () => {
    navigate("/");
  };

  return (
    <Layout>
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
              <ViewDetailPodcast
                id={id}
                file={selectedPodcast}
                onClose={handleCloseDetailPodcast}
              />
            ) : (
              <RightSection
                selectedMenuItem={selectedMenuItem}
                onPodcastSelected={handlePodcastSelected}
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
