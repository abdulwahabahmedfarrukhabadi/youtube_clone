import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Header from "./components/HeaderSection/Header";
import Feed from "./components/FeedSection/Feed";
import SearchVideoResult from "./components/SearchSection/SearchVideoResult";
import VideoDetails from "./components/VideoSection/VideoDetails";
import { AppContext } from "./useContextHook/useContextApi";
import { ThemeProvider } from "./useContextHook/useTheme";
import Success from "./components/HeaderSection/success";
import Channel from "./components/Channel/channel";
import Playlist from "./components/Channel/Playlist";
import YouTubeShorts from "./components/VideoSection/ShortDetails";
import Subscription from "./components/OtherChnnels/Subscription";
import LikedVideos from "./components/LikedVideos/likedVideos";
function App() {
    
  return(
    <Router>
    <AppContext>
       
    <ThemeProvider>
 <div className="flex flex-col w-full ">
  <Header/>
  
  <Routes>
    <Route path="/" element={<Feed/>}/>
    <Route path="/search/:searchQuery" element={<SearchVideoResult/>}/>
    <Route path="/video/:categoryId/:videoId" element={<VideoDetails/>}/>
    <Route path="/success" element={<Success/>}/>
   <Route path={`/channel/:id`} element={<Channel />}/>
   <Route path="/playlist/:playlistId" element={<Playlist />} />
   <Route path="/shorts/:category/:videoId" element={<YouTubeShorts />} />
   <Route path="/subscriptions" element={<Subscription/>}/>
   <Route path="/likedVideos" element={<LikedVideos/>}/>
   </Routes>
 </div>
 </ThemeProvider>
 </AppContext>
 </Router>
  );
}

export default App
