// MainSection.jsx

import React, { Component } from "react";
import "./MainSection.css";
import LeftSection from "../leftSection/LeftSection";
import RightSection from "../rightSection/RightSection";
import Layout, { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Header from "../../components/header/Header";
import ViewDetailPodcast from "../../components/pages/viewDetailPodcast/ViewDetailPodcast";

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
    this.setState({ isMobileView: window.innerWidth <= 768 });
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

  handlePodcastSelected = (podcast) => {
    this.setState({ selectedPodcast: podcast });
  };

  render() {
    const { isMobileView, collapsed, selectedPodcast, selectedMenuItem } =
      this.state;

    return (
      <Layout>
        {!isMobileView && (
          <Sider collapsed={collapsed} breakpoint="md">
            <LeftSection
              onSelectMenuItem={this.handleSelectMenuItem}
              onPodcastSelected={this.handlePodcastSelected}
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
                <ViewDetailPodcast podcast={selectedPodcast} />
              ) : (
                <RightSection
                  selectedMenuItem={selectedMenuItem}
                  toggleLeftSection={this.toggleLeftSection}
                  toggleHeaderFullScreen={this.toggleHeaderFullScreen}
                  onPodcastSelected={this.handlePodcastSelected}
                />
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default MainSection;
