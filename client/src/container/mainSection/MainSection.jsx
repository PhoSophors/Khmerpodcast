// MainSection.jsx

import React, { Component } from "react";
import "./MainSection.css";
import LeftSection from "../leftSection/LeftSection";
import RightSection from "../rightSection/RightSection";
import Layout, { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Header from "../../components/header/Header";
import ViewDetailPodcast from "../../components/pages/viewDetailPodcast/ViewDetailPodcast";
import UpdatePodcast from "../../components/pages/create/UpdatePodcast";
import Footer from "../../components/footer/Footer";

class MainSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuItem: "/",
      isLeftSectionOpen: true,
      isHeaderFullScreen: false,
      collapsed: false, // Initialize collapsed state
      isMobileView: false, // Track if in mobile view
      selectedPodcast: null,
      isUpdatePodcast: false,
    };
  }

  componentDidMount() {
    // Add event listener to handle window resize
    window.addEventListener("resize", this.handleWindowResize);
    // Check initial window size
    this.handleWindowResize();
  }

  componentWillUnmount() {
    // Remove event listener when component unmounts
    window.removeEventListener("resize", this.handleWindowResize);
  }

  // Function to handle window resize
  handleWindowResize = () => {
    // Update state based on window width
    this.setState({ isMobileView: window.innerWidth <= 897 });
  };

  handleSelectMenuItem = (menuItem) => {
    this.setState({ selectedMenuItem: menuItem });
  };

  toggleLeftSection = () => {
    this.setState((prevState) => ({
      isLeftSectionOpen: !prevState.isLeftSectionOpen,
    }));
  };

  toggleHeaderFullScreen = () => {
    this.setState((prevState) => ({
      isHeaderFullScreen: !prevState.isHeaderFullScreen,
    }));
  };

  handleCollapse = () => {
    this.setState((prevState) => ({
      collapsed: !prevState.collapsed, // Toggle the collapsed state
    }));
  };

  handlePodcastSelected = (file) => {
    this.setState({ selectedPodcast: file });
  };

  handleUpdatePodcast = () => {
    this.setState({ isUpdatePodcast: true });
  };
  handleCloseDetailPodcast = () => {
    this.setState({ selectedPodcast: null });
  };
  
  render() {
    const {
      isMobileView,
      collapsed,
      selectedPodcast,
      selectedMenuItem,
      isUpdatePodcast,
    } = this.state;

    if (isUpdatePodcast) {
      return <UpdatePodcast file={selectedPodcast} />;
    }

    return (
      <Layout>
        {!isMobileView && (
          <Sider collapsed={collapsed} breakpoint="md">
            <LeftSection
              onSelectMenuItem={this.handleSelectMenuItem}
            />
          </Sider>
        )}
        <Layout>
          <Content className="content-containers">
            <Header
              onSelectMenuItem={this.handleSelectMenuItem}
              handleCollapse={this.handleCollapse} // Pass function to handle collapse
              menuOpen={!isMobileView || !collapsed}
              collapsed={collapsed}
            />
            <div className="content-card">
              {selectedPodcast ? (
                <ViewDetailPodcast file={selectedPodcast} onClose={this.handleCloseDetailPodcast}  />
              ) : (
                <RightSection
                  selectedMenuItem={selectedMenuItem}
                  toggleLeftSection={this.toggleLeftSection}
                  toggleHeaderFullScreen={this.toggleHeaderFullScreen}
                  onPodcastSelected={this.handlePodcastSelected}
                  onUpdatePodcast={this.handleUpdatePodcast}
                />
              )}
            </div>
          </Content>
        </Layout>
        <Footer />
      </Layout>
    );
  }
}

export default MainSection;
