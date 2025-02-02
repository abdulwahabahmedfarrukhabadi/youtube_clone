/* eslint-disable react/prop-types */
import { useState,useEffect } from "react";
import { formatViewCount } from "../../utilis/helper";
import { TbWorld } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
const ChannelHeader = ({ channelDetails = channelDetails }) => {
  console.log(channelDetails)
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubscribedState, setIsSubscribedState] = useState(false);
  
    const userInfo = JSON.parse(localStorage.getItem("user-info")) || {};
    console.log("channel",userInfo)
    
    const isOwner = userInfo.youtube.channel.id === channelDetails?.id;

    const storedSubscriptions = userInfo.youtube?.subscriptions || [];
    
    
    const channelTitle = channelDetails.snippet?.title; 

     const isSubscribed = (channelTitle) => {
      console.log("Checking subscription for channelId:", channelTitle);
      return storedSubscriptions.some(sub => sub.snippet.title === channelTitle);
    };
    

    const checkSubscriptionStatus = () => {
      
      if (channelTitle) {
        setIsSubscribedState(isSubscribed(channelTitle));
      } else {
        console.error("No channelId found");
            
  }; 
    console.log("issuubb",checkSubscriptionStatus);
  }


  useEffect(() => {
    checkSubscriptionStatus();
  }, [channelTitle]);
  
  // Fetch subscription status for the channel
  
  const bannerUrl =
    channelDetails?.brandingSettings?.image?.bannerTabletHdImageUrl ||
    channelDetails?.brandingSettings?.image?.bannerMobileHdImageUrl ||
    channelDetails?.brandingSettings?.image?.bannerImageUrl ||
    channelDetails?.brandingSettings?.image?.bannerExternalUrl ||
    null;
    
  const description = channelDetails?.snippet?.description;
  const descriptionWords = description?.split(" ");
  const truncatedDescription = descriptionWords?.slice(0, 20).join(" ") + "...";
   
  const descriptionLinks = description?.match(/(?:https?:\/\/|www\.)[^\s<>"]+/g) || [];
  const formattedLinks = descriptionLinks.map(link => {
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      return 'https://' + link;
    }
    return link;
  });  
  

   console.log(channelDetails)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubscription = () => {
    const updatedSubscriptions = isSubscribedState
      ? storedSubscriptions.filter(sub => sub.snippet.title !== channelTitle) // Unsubscribe
      : [...storedSubscriptions, { snippet: { title: channelTitle } }]; // Subscribe
  
      const updatedUserInfo = {
        ...userInfo,
        youtube: {
          ...userInfo.youtube,
          subscriptions: updatedSubscriptions,
        },
      };
      localStorage.setItem("user-info", JSON.stringify(updatedUserInfo));
      setIsSubscribedState(!isSubscribedState);
    }
  return (
    <div>
    {bannerUrl && (
      <div className="relative flex flex-col items-center justify-center px-0">
        <img
          src={bannerUrl}
          alt="Channel Banner"
          className="w-[500px] h-40 object-cover rounded-lg shadow-lg"
          style={{
            objectPosition: "center",
            filter: "none", // Remove blur effects if any
          }}
         />
        {isOwner && (
        <button className="absolute opacity-0 top-[10px] right-[850px]  transform -translate-x-31 -translate-y-31 bg-[#00000099] hover:opacity-100 text-white font-bold py-2 px-4 rounded-full mt-4 flex items-center space-x-2"
          aria-label="Edit banner"
        title="Edit banner">
          
          <CiCamera className="text-xl"/>
          <span className="text-xl">Edit</span>
          </button>
        )}
        </div>
    )}

      {/* Profile Section */}
      <div className="relative flex flex-col items-center px-0 py-0 bg-white shadow-lg mt-0">
        
          {/* Profile Picture */}
          <div className="w-15 h-20 rounded-full border-4 border-white overflow-hidden">
            <img
              src={channelDetails?.snippet?.thumbnails?.high?.url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            
            {isOwner && (<div>
              <button className="absolute opacity-0 top-[50px] right-[400px] bg-[#00000099] hover:opacity-100 text-white font-bold py-4 px-4 rounded-full mt-4 flex items-center space-x-2">
                <CiCamera className="text-5xl"/></button>
            </div>)}
          </div>
          
                  {/* Actions */}
       
      
                      {/* Channel Text Info */}
          <div  className="text-center mt-0">
            <h1 className="text-base font-bold">{channelDetails?.snippet?.title}</h1>
            <p className="text-gray-500 text-sm">{channelDetails?.snippet?.customUrl}</p>
            <p className="text-gray-600 mt-0 text-sm">
              {formatViewCount(channelDetails?.statistics?.subscriberCount)} Subscribers ·{" "}
              {formatViewCount(channelDetails?.statistics?.videoCount)} Videos
            </p>
            <p className="text-gray-700 m1-2 text-sm">
              {showFullDescription ? description : truncatedDescription}{" "}
              {descriptionWords.length > 20 && (
                <button
                  onClick={openModal}
                  className="text-blue-500"
                >
                  Show more
                </button>
              )}
            </p>
          </div>
        
        <div className="mt-1">
        <div className="mt-1">
          {/* Conditional Rendering for Button */}
          {isOwner ? (
            <div className="flex space-x-4">
              <button className="px-4 py-3 bg-gray-300 text-black font-bold text-xs rounded-full shadow-md hover:bg-gray-400">
                Customize Channel
              </button>
              <button className="px-4 py-3  bg-gray-300 text-black font-bold text-xs rounded-full shadow-md hover:bg-gray-400">
                Manage Channel
              </button>
            </div>
          ) : (
            // Subscribe Button
            <button
              onClick={handleSubscription}
              className={`px-3 py-2 ${
                isSubscribedState ? "bg-gray-100 text-gray-600" : "bg-black text-white"
              } border rounded-full shadow-md font-semibold`}
            >
              {isSubscribedState ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>
          
        </div>
      {/* Links Section */}
      <div className="mt-4 px-6">
        {formattedLinks.length > 0 && (
          <div>
            <h2 className="text-lg font-bold">Links</h2>
            <ul className="flex space-x-4 mt-2">
              {formattedLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal for Full Description */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 max-w screen-lg w-3/12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold">About</h2>
              <button
                onClick={closeModal}
                className="text-red-500 text-xl"
              >
                &times;
              </button>
            </div>
            <p className="text-gray-700 mt-4 text-xs">{description}</p>
          
            
            
            <h2 className="text-base font-bold">Channel Details</h2>
            <div className="text-gray-600 flex items-center space-x-3 pb-2 text-xs">
            <TbWorld className="text-sm"/>
            {channelDetails?.snippet?.customUrl}
          </div>
          <div className="text-gray-600 flex items-center space-x-2 pb-2 text-xl">
          <VscAccount className="text-sm"/>
        <span>Subscribers: {formatViewCount(channelDetails?.statistics?.subscriberCount)}</span>
        </div>
          
          
        <div className="text-gray-600 flex items-center space-x-2 pb-2 text-xl">
        <MdOutlineOndemandVideo className="text-sm"/>
        <span>Videos: {formatViewCount(channelDetails?.statistics?.videoCount)}</span>
        </div>
          
          
        <div className="text-gray-600 flex items-center space-x-2 pb-2 text-xl">
        <BsGraphUpArrow className="text-sm"/>
              <span>Views: {formatViewCount(channelDetails?.statistics?.viewCount)}</span>
              
            </div>
          
          
            <div className="text-gray-600 flex items-center space-x-2 pb-2 text-xl">
            <FaInfoCircle className="text-sm"/>
              <span>Joined: {new Date(channelDetails?.snippet?.publishedAt).toLocaleDateString()}</span>
            </div>
          
        
      

            <div className="mt-6 px-6">
  <div className="flex items-center justify-start space-x-4">
    {/* Share Channel Button */}
    <button
      onClick={() =>
        navigator.share
          ? navigator.share({
              title: channelDetails?.snippet?.title,
              url: `https://www.youtube.com/channel/${channelDetails?.id}`,
            })
          : alert("Sharing not supported on this browser!")
      }
      className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#F1F1F1] text-[#0F0F0F] rounded-full shadow-md hover:bg-[#E5E5E5] transition-all duration-200"
    >
      <FaShare className="text-xl" />
      <span>Share</span>
    </button>

    {/* Report User Button */}
    <button
      onClick={() => alert('Reporting user...')}
      className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#FF0000] text-white rounded-full shadow-md hover:bg-[#D80000] transition-all duration-200"
    >
      <span>Report</span>
    </button>
  </div>
</div>        
</div>
</div>
      )}
    </div>
    </div>
  )
}

  

export default ChannelHeader;
