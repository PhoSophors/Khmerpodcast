import logo from "../assets/logo.jpg";
import { 
  HomeFilled,
  HomeOutlined,
  SearchOutlined,
  HeartFilled,
  HeartOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  SettingFilled,
  SettingOutlined,
  UserOutlined,
  DashboardFilled,
  DashboardOutlined,
  FileTextFilled,
  FileTextOutlined,
  LogoutOutlined,
 } from "@ant-design/icons";

export const iconMapping = {
  "default": <img src={logo} alt="logo" />,
  "/": { selected: <HomeFilled />, default: <HomeOutlined /> },
  "/search": { selected: <SearchOutlined />, default: <SearchOutlined /> },
  "/favorite": { selected: <HeartFilled />, default: <HeartOutlined /> },
  "/create": {
    selected: <PlusCircleFilled />,
    default: <PlusCircleOutlined />,
  },
  "/setting": { selected: <SettingFilled />, default: <SettingOutlined /> },
  "/profile": { selected: <UserOutlined />, default: <UserOutlined /> },
  "/dashboard": {
    selected: <DashboardFilled />,
    default: <DashboardOutlined />,
  },
  "/all-user": {
    selected: <UserOutlined />,
    default: <UserOutlined />,
  },
  "/all-user-upload": {
    selected:  <FileTextFilled />,
    default: < FileTextOutlined />
  },
  "/logout": {
    selected:  <LogoutOutlined />,
    default: < LogoutOutlined />
  },
};

// export const getIcon = (key, selectedMenuItem) => {
//   const icon = iconMapping[key];
//   return icon
//     ? selectedMenuItem === key
//       ? icon.selected
//       : icon.default
//     : null;
// };
export const getIcon = (key, selectedMenuItem) => {
  const iconSet = iconMapping[key];
  if (!iconSet) return null; // Return null if there's no icon set for the key

  // Return the selected icon if the key matches the selected menu item, otherwise return the default icon
  return selectedMenuItem === key ? iconSet.selected : iconSet.default;
};