// import React from 'react'
// import { Menu } from 'antd';
// import SideMenu from './SideMenu';

// const MobileMenu = ({ onSelectMenuItem }) => {
//   const [selectedMenuItem, setSelectedMenuItem] = useState("/");

//   const handleMenuItemClick = (menuItem) => {
//     setSelectedMenuItem(menuItem.key);
//     onSelectMenuItem(menuItem.key);
//   }

//   const mobileMenu = (
//     <Menu
//       selectedKeys={[selectedMenuItem]}
//       onClick={handleMenuItemClick}
//       style={{
//         width: "300px",
//         flex: 1,
//         top: "0",
//         left: 0,
//         position: "fixed",
//         zIndex: 1000,
//         backgroundColor: "none",
//         borderRadius: "0",
//         boxShadow: "0 0 0px 0 rgba(0,0,0,0.1)",
//         display: "block",
//       }}
//     >
//       <SideMenu />
//     </Menu>
//   );

//   return (
//     <div>MobileMenu</div>
//   )
// }

// export default MobileMenu