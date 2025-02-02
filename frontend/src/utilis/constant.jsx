import {Home,Subscriptions,Settings,History,PlaylistPlay,SmartDisplay,Schedule, ThumbUpOutlined} from "@mui/icons-material"
import {  AiOutlineFlag } from "react-icons/ai";
import { MdScience, MdSchool, MdLibraryBooks, } from "react-icons/md";
import {  FiHelpCircle } from "react-icons/fi";
import { SiYoutubeshorts } from "react-icons/si";
import { FaUserFriends, FaRegLaughBeam, FaTheaterMasks, FaTools } from "react-icons/fa";
import {  RiFeedbackLine } from "react-icons/ri";

export const categories1 = [
    { id: "0", name: "Home", icon: <Home />, type: "category" },
    { id: "1", name: "Shorts", icon: <SiYoutubeshorts />, type: "category" },
    { id: "2", name: "Subscription", icon: <Subscriptions />,link:"/subscriptions" },
    ]
    
  export const categories2 = [
    { id: "10", name: "History", icon: <History />, type: "category" },
    { id: "15", name: "Playlists", icon: <PlaylistPlay />, type: "category" },
    { id: "17", name: "My Videos", icon: <SmartDisplay/>, type: "category" },
    { id: "19", name: "Watch Later", icon: <Schedule />, type: "category" },
    { id: "20", name: "Liked Videos", icon: <ThumbUpOutlined />, type: "category" },
    ]
  export const categories3=[
    { id: "22", name: "People & Blogs", icon: <FaUserFriends />, type: "category" },
    { id: "23", name: "Comedy", icon: <FaRegLaughBeam />, type: "category" },
    { id: "24", name: "Entertainment", icon: <FaTheaterMasks />, type: "category", divider: true },
    { id: "25", name: "News & Politics", icon: <MdLibraryBooks />, type: "category" },
    { id: "26", name: "Howto & Style", icon: <FaTools />, type: "category" },
    { id: "27", name: "Education", icon: <MdSchool />, type: "category" },
    { id: "28", name: "Science & Technology", icon: <MdScience />, type: "category" }
];

export const menuItems = [
    { name: "Settings", icon: <Settings />, type: "menu" },
    { name: "Report History", icon: <AiOutlineFlag />, type: "menu" },
    { name: "Help", icon: <FiHelpCircle />, type: "menu" },
    { name: "Send feedback", icon: <RiFeedbackLine />, type: "menu" },
];





export const formatViewCount = (count) => {
  if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
  } else {
      return count?.toString();
  }
};

export const formatPublishTime = (publishTime) => {
  return formatDistanceToNow(new Date(publishTime), { addSuffix: true });
};

export const formatDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
};