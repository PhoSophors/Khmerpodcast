
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
    selected:  <FileTextFilled />,
    default: < FileTextOutlined />
  },
};

export const getIcon = (key, selectedMenuItem) => {
  const icon = iconMapping[key];
  return icon
    ? selectedMenuItem === key
      ? icon.selected
      : icon.default
    : null;
};