// Sidebar.jsx
import { useState,useEffect } from "react";
import { useAppContext } from "../../useContextHook/useContextApi";
import { useTheme } from "../../useContextHook/useTheme";
import { categories1, categories2, categories3, categories4, menuItems } from "../../utilis/constant";
import MenuItem from "./MenuItem";
import { useNavigate } from "react-router-dom";
import {Home,Search,Notifications,AccountCircle,Settings,VideoLibrary,ChevronRight} from "@mui/icons-material"
import { Link } from "react-router-dom";
import { fetchApiFromYoutubeData } from "../../utilis/fetchApi";

const Sidebar = () => {
  const { mobileMenu, selectedCategory, setSelectedCategory } = useAppContext();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [channelDetails, setChannelDetails] = useState([]);
  
  const { loading, setLoading } = useAppContext();
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user-info")) || {};
    
    const storedSubscriptions = userInfo.youtube?.subscriptions || [];
    
    // ✅ Get only the first 5 subscriptions
    const limitedSubscriptions = storedSubscriptions.slice(0, 5);
    setSubscriptions(limitedSubscriptions);
  }, []);

   useEffect(() => {
      const status = {};
      subscriptions.forEach((sub) => {
        status[sub.snippet.channelId] = true; // Assume all fetched subscriptions are subscribed
      });
      
    }, [subscriptions]);
  
    // Fetch channel details from the YouTube API
    const fetchMultipleChannelDetails = async () => {
      const channelIds = subscriptions.map((sub) => sub.snippet.channelId).join(",");
      if (channelIds) {
        setLoading(true);
        let allChannels = [];
        let nextPageToken = null;
        try {
          do{
          const data = await fetchApiFromYoutubeData("channels", {
            part: "snippet,statistics,brandingSettings",
            id: channelIds,
             // Ensure max 50 per request
            pageToken: nextPageToken,
            
          });
          if (data && data.items) {
            allChannels = allChannels.concat(data.items);
          } else {
            console.error("No 'items' found in response:", data);
            break;
          }
          nextPageToken = data.nextPageToken; // Update next page token
        } while (nextPageToken);
        setChannelDetails(allChannels);        
        } catch (error) {
          console.error("Error fetching multiple channel details:", error);
        } finally {
          setLoading(false); // Ensure loading is false after fetching
        }
      }
    };
    
    useEffect(() => {
      if (subscriptions.length > 0) {
        fetchMultipleChannelDetails();
      }
    }, [subscriptions]);
  


  const handleCategoryClick = (id, name) => {
    setSelectedCategory(id);
    if (name === "Home") {
      navigate("/");
    }
  };

  return (
    <div
    className={`${
      mobileMenu ? "md:block" : "md:hidden"
    } md:block w-[280px] mt-2 absolute md:relative z-10 overflow-y-auto h-full py-4 ${
      isDarkMode ? "border-gray-700" : "border-gray-200"
    }`}
>
<div className="flex flex-col px-5 mb-20">
        {/* Mobile Collapse Sidebar - Just Icons */}
        <div className="md:hidden flex flex-col items-center">
          <div className="space-y-4">
            <button className="flex flex-col items-center">
              <Home className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <Search className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <Notifications className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <AccountCircle className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <Settings className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <VideoLibrary className="text-2xl" />
            </button>
          </div>
        </div>
        <div className="flex flex-col px-0 mb-20 text-black">
        {categories1.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedCategory}
            onClick={() => handleCategoryClick(item.id, item.name)}
          />
        ))}
        <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
        <div className="text-black font-bold flex items-center">
        <span>You</span><ChevronRight/>
        </div>
        {categories2.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedCategory}
            onClick={() => handleCategoryClick(item.id, item.name)}
          />
        ))}
         <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
         <div className="text-black font-bold flex items-center">
        <span>Subscriptions</span><ChevronRight/>
        </div>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : subscriptions.length > 0 ? (
          <div className="flex flex-col space-y-2">
          {channelDetails.map((channelDetail) => (
              <div key={channelDetail.snippet.channelId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
               <Link to={`/channel/${channelDetail.id}`} key={channelDetail.id}>
                <img
                  src={channelDetail.snippet.thumbnails?.medium?.url }
                  alt={channelDetail.snippet.title}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm font-semibold text-gray-800">{channelDetail.snippet.title}</span>
                </Link>
            </div>
          ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No subscriptions found</p>
        )}

        <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
         <div className="text-black font-bold flex items-center">
        <span>Explore</span><ChevronRight/>
        </div>
        

        {categories3.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedCategory}
            onClick={() => handleCategoryClick(item.id, item.name)}
          />
        ))}
                 <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
                 <div className="text-black font-bold flex items-center">
        <span>More from YouTube</span><ChevronRight/>
        </div>
        {categories4.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedCategory}
            onClick={() => handleCategoryClick(item.id, item.name)}
          />
        ))}
        <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />

        {menuItems.map((item) => (
          <MenuItem key={item.name} item={item} isSelected={false} />
        ))}

        <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
        <div className="flex items-center text-sm justify-center">Made By Abdul Wahab</div>
      </div>
    </div>
    </div>
    
  );
};

export default Sidebar;
