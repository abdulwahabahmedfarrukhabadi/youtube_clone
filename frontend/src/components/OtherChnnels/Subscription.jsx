import { useEffect, useState } from "react"; 
import { useAppContext } from "../../useContextHook/useContextApi";
import { fetchApiFromYoutubeData } from "../../utilis/fetchApi";
import { formatViewCount } from "../../utilis/helper";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import Sidebar from "../SidebarSection/Sidebar";

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const { loading, setLoading } = useAppContext();
  const [channelDetails, setChannelDetails] = useState([]);
  const [SubscribedStatus, setSubscribedStatus] = useState(false);
  
  // Fetch subscriptions from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user-info")) || {};
    const storedSubscriptions = userInfo.youtube?.subscriptions || [];
    console.log(storedSubscriptions); // Add this line to check the structure

    setSubscriptions(storedSubscriptions);
  }, []);
   
  useEffect(() => {
    const status = {};
    subscriptions.forEach((sub) => {
      status[sub.snippet.channelId] = true; // Assume all fetched subscriptions are subscribed
    });
    setSubscribedStatus(status);
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
          maxResults: 50, // Ensure max 50 per request
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

  const toggleSubscription = (channelId) => {
    setSubscribedStatus((prevStatus) => ({
      ...prevStatus,
      [channelId]: !prevStatus[channelId],
    }));
  };
   console.log(channelDetails);
  return (
    <div className="flex flex-row h-screen hide-scrollbar">
      <div className="flex-shrink-0 h-full hide-scrollbar">
        <Sidebar />
      </div>
      <div className="w-full grow overflow-y-auto bg-gray-100 p-2 hide-scrollbar">
      <h1 className="text-xl font-bold mb-5 text-gray-800">Subscriptions</h1>
      
      {/* Show the Loading Spinner only if loading is true */}
      {loading ? <LoadingSpinner /> : (
        <>
          {subscriptions.length > 0 ? (
            <div className="grid grid-rows-1 sm:grid-3 lg:grid-3 gap-2">
              {channelDetails.map((channelDetail) => (
                <Link to={`/channel/${channelDetail.id}`} key={channelDetail.id}>
                  <div
                    className="flex items-center bg-white rounded-lg shadow-md overflow-hidden p-4 space-y-3" 
                  >
                    <img
                      src={channelDetail.snippet.thumbnails?.medium?.url || "https://via.placeholder.com/150"}
                      alt={channelDetail.snippet.title}
                      className="w-25 h-[15vh] object-cover rounded-full pr-2"
                    />
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-800">
                        {channelDetail.snippet.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-600">
                        {channelDetail.snippet.customUrl}{" . "}
                        {formatViewCount(channelDetail?.statistics?.subscriberCount)}{" "}subscribers
                      </p>
                      <p className="text-xs font-semibold text-gray-600">
  {channelDetail?.snippet?.description
    ?.split(" ")
    .slice(0, 30)
    .join(" ")}
  {channelDetail?.snippet?.description?.split(" ").length > 30 ? "..." : ""}
</p>

                      <div className="flex-2 text-xs pt-2">
                        <button
                          onClick={() => toggleSubscription(channelDetail.id)}
                          className={`font-bold px-3 py-2 lg:py-3 mt-2 lg:mt-0 ml-1 lg:ml-6 rounded-full  
                          ${SubscribedStatus[channelDetail.id] ? "bg-slate-300 text-gray-800" : "bg-black text-white"} 
                          border rounded-full shadow-lg`}
                        >
                          {SubscribedStatus[channelDetail.id] ? "Subscribed" : "Subscribe"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              You are not subscribed to any channels.
            </p>
          )}
        </>
      )}
    </div>
    </div>
  );
};

export default Subscription;
