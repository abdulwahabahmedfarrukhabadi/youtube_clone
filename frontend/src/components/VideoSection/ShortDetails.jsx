import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../useContextHook/useContextApi";
import { useTheme } from "../../useContextHook/useTheme";
import { fetchApiFromYoutubeData } from "../../utilis/fetchApi";
import VideoComments from "./VideoComments";
import { formatViewCount } from "../../utilis/helper";

const YouTubeShorts = () => {
  const { videoId } = useParams();
  const { setLoading } = useAppContext();
  const { isDarkMode } = useTheme();

  const [selectedVideoDetails, setSelectedVideoDetails] = useState(null);
  const [commentData, setCommentData] = useState([]);

  // Fetch selected video details
  const fetchSelectedVideo = async () => {
    try {
      const data = await fetchApiFromYoutubeData("videos", {
        part: "snippet,statistics",
        id: videoId,
      });
      setSelectedVideoDetails(data.items[0]);
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const data = await fetchApiFromYoutubeData("commentThreads", {
        part: "snippet",
        videoId: videoId,
        maxResults: 20,
      });
      setCommentData(data.items);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchSelectedVideo();
    fetchComments();
  }, [videoId]);

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center h-screen bg-gray-100 p-4 gap-6">
      {/* Video Player Centered */}
      <div className="sticky top-8 left-6 lg:left-80 w-[650px] max-w-full flex-1 flex justify-center">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube Shorts"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full max-w-[690px] h-[94vh] rounded-lg shadow-md"
        ></iframe>
      </div>

      {/* Comments Section */}
      <div className="ml-[670px] lg:ml-[700px] flex-1 flex flex-col gap-6 overflow-y-auto h-screen p-4">
        <h3 className="font-bold text-lg">
          Comments ({formatViewCount(selectedVideoDetails?.statistics?.commentCount || 0)})
        </h3>
        {commentData.length > 0 ? (
          commentData.map((comment) => (
            <VideoComments comment={comment} key={comment.id} />
          ))
        ) : (
          <p className="text-gray-500">No comments available.</p>
        )}
      </div>
    </div>
  );
};

export default YouTubeShorts;
