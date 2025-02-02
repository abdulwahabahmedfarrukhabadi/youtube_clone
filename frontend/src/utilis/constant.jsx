import {Home,Subscriptions,Settings,History,PlaylistPlay,SmartDisplay,Schedule, ThumbUpOutlined, LocalFireDepartment, MusicNote, SportsEsports, Newspaper} from "@mui/icons-material"
import {  AiOutlineFlag } from "react-icons/ai";
import {  FiHelpCircle } from "react-icons/fi";
import { SiYoutubekids, SiYoutubemusic, SiYoutubeshorts, SiYoutubestudio } from "react-icons/si";
import {  RiFeedbackLine } from "react-icons/ri";
import { BsTrophy } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
export const categories1 = [
    { id: "0", name: "Home", icon: <Home />, type: "category" },
    { id: "1", name: "Shorts", icon: <SiYoutubeshorts />, type: "category" },
    { id: "2", name: "Subscription", icon: <Subscriptions />,link:"/subscriptions" },
    ]
    
  export const categories2 = [
    { id: "10", name: "History", icon: <History />, link:"/history" },
    { id: "15", name: "Playlists", icon: <PlaylistPlay />, type: "category" },
    { id: "17", name: "My Videos", icon: <SmartDisplay/>, type: "category" },
    { id: "19", name: "Watch Later", icon: <Schedule />, type: "category" },
    { id: "20", name: "Liked Videos", icon: <ThumbUpOutlined />, link:"/likedVideos" },
    ]
  export const categories3=[
    { id: "22", name: "Trending", icon: <LocalFireDepartment />, type: "category" },
    { id: "23", name: "Music", icon: <MusicNote />, type: "category" },
    { id: "24", name: "Gaming", icon: <SportsEsports />, type: "category", divider: true },
    { id: "25", name: "News", icon: <Newspaper />, type: "category" },
    { id: "26", name: "Sports", icon: <BsTrophy />, type: "category" },
];

export const categories4=[
    { id: "22", name: "YouTube Premium", icon: <FaYoutube />, type: "category" },
    { id: "23", name: "YouTube Studio", icon: <SiYoutubestudio/>, type: "category" },
    { id: "24", name: "YouTube Music", icon: <SiYoutubemusic />, type: "category", divider: true },
    { id: "25", name: "YouTube Kids", icon: <SiYoutubekids />, type: "category" },
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