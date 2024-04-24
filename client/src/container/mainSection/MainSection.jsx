// MainSection.jsx

import React, { Component } from "react";
// import Footer from "../../components/footer/Footer";
import "./MainSection.css";
import LeftSection from "../leftSection/LeftSection";
import RightSection from "../rightSection/RightSection";
import Layout, { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Header from "../../components/header/Header";
import SideMenu from "../../components/sidemenu/SideMenu";

class MainSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuItem: "/",
      isLeftSectionOpen: true,
      isHeaderFullScreen: false,
      collapsed: false, // Initialize collapsed state
      isMobileView: false, // Track if in mobile view
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

  render() {
    const { isMobileView, collapsed } = this.state;
    return (
      <Layout>
        {!isMobileView && (
          <Sider
            collapsed={collapsed}
            breakpoint="md"
          >
            <LeftSection onSelectMenuItem={this.handleSelectMenuItem} />
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
              <RightSection
                selectedMenuItem={this.state.selectedMenuItem} // Pass selected menu item
                toggleLeftSection={this.toggleLeftSection} // Pass function to toggle left section
                toggleHeaderFullScreen={this.toggleHeaderFullScreen} // Pass function to toggle header full screen
              />
            </div>
            {/* <Footer /> */}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default MainSection;
