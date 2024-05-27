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
  MoonOutlined,
  MoonFilled,
} from "@ant-design/icons";

export const iconMapping = {
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
    selected: <FileTextFilled />,
    default: <FileTextOutlined />,
  },
  "/logout": {
    selected: <LogoutOutlined />,
    default: <LogoutOutlined />,
  },
  "/theme": { selected: <MoonFilled />, default: <MoonOutlined /> },
  "/app-logo": {
    selected: <></>,
    default: <></>,
  },

  default: <HomeOutlined />,
};

export const getIcon = (key, selectedMenuItem, theme) => {
  const iconSet = iconMapping[key];
  if (!iconSet) return null; // Return null if there's no icon set for the key

  // Return the selected icon if the key matches the selected menu item, otherwise return the default icon
  return selectedMenuItem === key
    ? iconSet.selected
    : iconSet.default && theme === "dark"
    ? iconSet.selected
    : iconSet.default;
};
