import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get playlistId from the URL
import { fetchPlaylistDetails } from "./api"; // Function to fetch playlist details
import axios from "axios";
import { formatDuration,formatViewCount,formatPublishTime } from "../../utilis/helper";
import { Link } from "react-router-dom";
const PlaylistPage = () => {
  const { playlistId } = useParams(); // Get playlistId from the URL
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradient, setGradient] = useState(""); 
  const [currentVideo, setCurrentVideo] = useState(null); // State to track the currently playing video
  const REACT_BASE_URL = import.meta.env.REACT_BASE_URL;
  // Fetch playlist data
  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        const data = await fetchPlaylistDetails(playlistId); // Fetch playlist details
        setPlaylistData(data);
        console.log(fetchPlaylistDetails)

        // Extract color from the playlist thumbnail
        const thumbnailUrl = data?.items[0]?.snippet?.thumbnails?.high?.url;
        if (thumbnailUrl) {
          const { data: colorData } = await axios.get(
            `${REACT_BASE_URL}/thumbnail-color?imageUrl=${encodeURIComponent(
              thumbnailUrl
            )}`
          );
       
          if (colorData?.gradient) {
            setGradient(colorData.gradient); // Set the gradient from the backend
          }
        }
      } catch (error) {
        console.error("Error fetching playlist data or color:", error);
      } finally {
        setLoading(false);
      }
    };

    getPlaylistData();
  }, [playlistId]);

  const handleVideoClick = async (video) => {
    setCurrentVideo(video); // Update the current playing video
    console.log("Video clicked:", video); // Debugging log
  };

  if (loading) return <div className="text-center mt-8 text-xl">Loading...</div>;
  

  return (
    <div className="relative  bg-gray-100 p-4 w-full">
      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Red Banner Section */}
        <div
          className="text-white p-6 rounded-lg w-full md:w-1/6 flex-shrink-0 stiky top-0 h-[90vh]"
          style={{ background: gradient,borderRadius: '12px', // Adjust this value to control the corner radius
            overflow: 'hidden' }}
        >
          {/* Show the first video if no current video is selected, otherwise show the selected video */}
          {(currentVideo || playlistData?.items[0]) && (
            <div>
              <img
                src={currentVideo?.snippet.thumbnails.high.url || playlistData?.items[0].snippet.thumbnails.high.url}
                alt={currentVideo?.snippet.title || playlistData?.items[0].snippet.title}
                className="w-full h-30 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xs font-bold mt-4 ">{currentVideo?.snippet.title || playlistData?.items[0].snippet.title}</h3>
              <p className="text-xs text-white font-bold">By {currentVideo?.snippet.channelTitle || playlistData?.items[0].snippet.channelTitle}</p>
              {currentVideo?.statistics && (
                <p className="text-xs text-white">
              {formatViewCount(currentVideo.statistics.viewCount)} views ·{" "}
              {formatPublishTime(currentVideo.snippet.publishedAt)}
              </p>
              )}
            </div>
          )}

          {/* Playlist Details */}
          <h1 className="text-4xl font-bold">{playlistData?.snippet?.title}</h1>
          <p className="mt-2 text-lg">{playlistData?.snippet?.description}</p>
          <div className="mt-4 text-sm">
          </div>
        </div>

        {/* Right Video List Section */}
        <div className="flex-grow overflow-y-auto max-h-screen">
          <div className="video-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlistData?.items?.map((video) => {
               const videoId = video.snippet.resourceId.videoId;

               return (
              <Link to={`/video/${video.snippet.channelId}/${videoId}`} key={videoId}>
              <div
                key={video.id.videoId}
                className="video-card rounded-lg overflow-hidden"
                onClick={() => handleVideoClick(video)} // Handle video click
              >
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full h-30 object-cover rounded-lg"
                />
                   <span className="absolute bottom-2 right-2 bg-gray-800 text-white text-lg px-2 py-1 rounded">
                                      {formatDuration(video?.contentDetails?.duration)}
                                    </span>
                <div className="p-4">
                  <h3 className="text-xs font-bold">{video.snippet.title}</h3>
                  <p className="text-xs text-gray-600">
                    {video.snippet.channelTitle}
                  </p>
                    <p className="text-xs text-gray-500">
                                      {formatViewCount(video?.statistics?.viewCount)} views ·{" "}
                                      {formatPublishTime(video.snippet.publishedAt)}
                                    </p>
                </div>
              </div>
              </Link>
                 );
              })}
            
          </div>
        </div>
      </div>
      </div>
      
 
  );
};

export default PlaylistPage;
