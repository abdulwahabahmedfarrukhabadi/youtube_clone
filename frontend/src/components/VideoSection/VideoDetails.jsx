/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../../useContextHook/useContextApi";
import { useTheme } from "../../useContextHook/useTheme";
import { fetchApiFromYoutubeData } from "../../utilis/fetchApi";
import { FaDownload} from "react-icons/fa";
import VideoComments from "./VideoComments";
import Divider from '@mui/material/Divider';
import { formatPublishTime, formatViewCount } from "../../utilis/helper";
import Icon from '../Icon';
import RelatedVideos from "./RelatedVideo";
import axios from "axios";
import api from "../../axios";


const VideoDetails = () => {
  
  const [liked, setLiked] = useState(false);
  const { category, videoId } = useParams();
  const { setLoading,loading } = useAppContext();
  const { isDarkMode } = useTheme();
  const [commentText, setCommentText] = useState("");
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentsData] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSubscribedState, setIsSubscribedState] = useState(false);
  const [disliked, setDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  
  const userInfo = JSON.parse(localStorage.getItem("user-info")) || {};
  const storedSubscriptions = userInfo.youtube?.subscriptions || [];
  const channelTitle = channelData?.snippet?.title;
  const accessToken = userInfo.accessToken;
  console.log(accessToken);
   
  
  const REACT_BASE_URL = import.meta.env.REACT_BASE_URL;

  useEffect(() => {
    // Fetch the video details and set the initial like/dislike counts
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`/api/video/${videoId}`);
        setLikeCount(response.data.likeCount);
        setDislikeCount(response.data.dislikeCount);
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };
    fetchVideoDetails();
  }, [videoId]);

  const toggleLike = async () => {
    if (disliked) {
      setDisliked(false); // Unset dislike if it's active
    }
    setLiked(!liked); // Toggle the like state

    try {
      // API call to update like/dislike status on the server
      const response = await api.post(`${REACT_BASE_URL}/video/${videoId}/like`, 
      { videoId,
        accessToken,
      });

      console.log(response.data.message);

      // Update like count
      setLikeCount(likeCount + (liked ? -1 : 1));
    } catch (error) {
      console.error("Error updating like:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Unknown error:", error.message);
      }
    
    }
  };


  const toggleDislike = async () => {
    if (liked) {
      setLiked(false); // Unset like if it's active
    }
    setDisliked(!disliked); // Toggle the dislike state

    try {
      // API call to update like/dislike status on the server
     const response = await api.post(`${REACT_BASE_URL}/video/${videoId}/dislike`, {
      videoId: videoId,           // Send videoId
      accessToken: accessToken,   // Send accessToken
    });

    // Log success message
    console.log(response.data.message);

  } catch (error) {
    console.error("Error updating dislike:", error);
    if (error.response) {
      console.error("Response error:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("Unknown error:", error.message);
    }
  }
  }  

  const [selectedVideoDetails, setSelectedVideoDetails] = useState(null);

  // Utility function to safely stringify objects without circular references
function stringifySafely(obj) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return; // Prevent circular reference
      }
      cache.add(value);
    }
    return value;
  });
}
 

  const handleCommentSubmit = async () => {
    if (!commentText) return; // If comment text is empty, don't proceed
  
    setLoading(true);
    try {
      // Retrieve authToken from localStorage
      const authToken = localStorage.getItem("authToken");
      
      
      const accessToken = userInfo.accessToken;     
      console.log("accesss:",authToken)
      console.log("access",accessToken);
        // Ensure the authToken is retrieved before using it
    if (!authToken) {
      throw new Error("Authorization token is missing from localStorage.");
    }
     
      const response = await axios.post(
        `${REACT_BASE_URL}/comment`,
        {
          videoId:videoId,
          commentText:commentText,
          accessToken:accessToken
        });
  
      console.log(response);
      console.log(videoId);
  
      if (response.status === 200) {
        const newComment = await response.data;
        setCommentsData((prevComments) => [newComment, ...prevComments]);
        setCommentText(""); // Clear comment input after submitting
      } else {
        console.error("Error submitting comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const isSubscribed = (channelTitle) =>
    storedSubscriptions.some((sub) => sub.snippet.title === channelTitle);

  useEffect(() => {
    if (channelTitle) {
      setIsSubscribedState(isSubscribed(channelTitle));
    }
  }, [channelTitle]);

  const fetchSelectedVideosDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchApiFromYoutubeData("videos", {
        part: "snippet,contentDetails,statistics",
        id: videoId,
      });
      setSelectedVideoDetails(data.items[0]);
    } catch (error) {
      console.error("Error fetching video details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelData = async () => {
    if (selectedVideoDetails?.snippet?.channelId) {
      setLoading(true);
      try {
        const data = await fetchApiFromYoutubeData("channels", {
          part: "snippet,contentDetails,statistics",
          id: selectedVideoDetails.snippet.channelId,
        });
        setChannelData(data.items[0]);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchVideoComments = async () => {
    setLoading(true);
    try {
      const data = await fetchApiFromYoutubeData("commentThreads", {
        part: "snippet",
        videoId,
        maxResults: 100,
      });
      setCommentsData(data.items);
    } catch (error) {
      console.error("Error fetching video comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedVideosDetails();
    fetchVideoComments();
  }, [videoId]);

  useEffect(() => {
    fetchChannelData();
  }, [selectedVideoDetails]);



  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const description = selectedVideoDetails?.snippet?.description;
  const truncatedDescription = description?.slice(0, 240);
  return (
    <div
      className={`flex justify-center flex-row h-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="w-full flex flex-col p-4 lg:flex-row lg:space-x-4">
        <div className="flex flex-col lg:w-[70%] px-4 py-3 lg:py-5 overflow-auto">
          <div className="h-[100px] md:h-[400px]  lg:h-[400px] xl:h-[400px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
          <iframe className="rounded-xl" width="100%" height="400" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          {selectedVideoDetails && (
            <div className="mt-2 flex flex-col gap-6">
              <h2 className="text-lg font-bold">
                {selectedVideoDetails.snippet.title}
              </h2>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <div className="flex items-center mb-4 lg:mb-0">
                  <Link to={`/channel/${selectedVideoDetails.snippet.channelId}`}>
                    <img
                      src={channelData?.snippet?.thumbnails?.default?.url}
                      alt={channelData?.snippet?.title}
                      className="w-9 h-9 rounded-full"
                    />
                  </Link>
                  <div className="ml-3">
                    <h3 className="text-sm font-bold">{channelTitle}</h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {formatViewCount(
                        channelData?.statistics?.subscriberCount
                      )}{" "}
                      subscribers
                    </p>
                  </div>
                  <button
                    className={`ml-6 px-3 py-1 rounded-full font-bold text-sm ${
                      isSubscribedState
                        ? "bg-gray-300 text-gray-900"
                        : "bg-black text-white"
                    }`}
                  >
                    {isSubscribedState ? "Subscribed" : "Subscribe"}
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className={`px-5 py-2 rounded-full flex items-center ${
                      isDarkMode ? "bg-black text-white" : "bg-gray-200"
                    }`}
                  >
                  <Icon name="thumb_up" liked={liked} // Pass the liked state to the Icon component
          onClick={toggleLike} // Set the toggle function on click
          fill={liked ? 1 : 0} // Adjust the fill property dynamically
          weight={500}
          grade={0}
          opticalSize={16} className="text-xs"/>
                      <span className="ml-1">
                      {formatViewCount(selectedVideoDetails.statistics.likeCount)}{""}
                    </span>
                    <Divider orientation="vertical" flexItem sx={{ marginLeft: '8px', marginRight: '8px' }} />

                    <Icon name="thumb_down"  liked={disliked} // Pass the liked state to the Icon component
          onClick={toggleDislike} // Set the toggle function on click
          fill={disliked ? 1 : 0} // Adjust the fill property dynamically
          weight={500}
          grade={0}
          opticalSize={48} />

                  </button>
                  <button
                    className={`px-6 py-3 rounded-full flex items-center ${
                      isDarkMode ? "bg-black text-white" : "bg-gray-200"
                    }`}
                  >
                    <FaDownload className="text-base"/>
                    <span className="ml-2 text-base">Download</span>
                  </button>
                </div>
              </div>
              <div className="bg-gray-200 p-4 text-xm rounded-lg">
                <p className="text-gray-600 text-sm">
                  {formatViewCount(
                    selectedVideoDetails.statistics.viewCount
                  )}{" "}
                  views • {formatPublishTime(selectedVideoDetails.snippet.publishedAt)}
                </p>
                <p className="text-black mt-2">
                  {showFullDescription ? description : truncatedDescription}
                  {description?.length > 240 && (
                    <button
                      onClick={toggleDescription}
                      className="text-blue-500 ml-2"
                    >
                      {showFullDescription ? "Show less" : "Show more"}
                    </button>
                  )}
                </p>
              </div>
            </div>
          )}
          <div className="mt-8">
            <p className="font-semibold text-lg">
              {formatViewCount(selectedVideoDetails?.statistics?.commentCount)}{" "}
              Comments
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            
          <img src={userInfo.youtube.channel.thumbnails.high} className="rounded-full h-[40px] w-[40px]"/>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full h-12 p-4 border border-gray-500 rounded-lg bg-transparent "
              rows="1"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full"
            >
              Comment
            </button>
          </div>

          {commentData?.map((comment) => (
            <VideoComments comment={comment} key={comment.id} />
          ))}
        </div>
        <div className="lg:w-[40%] p-5">
        <RelatedVideos />
          </div>
      </div>
    </div>
  );
};

export default VideoDetails;
