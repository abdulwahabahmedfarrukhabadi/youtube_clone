import { formatPublishTime, formatViewCount } from "../../utilis/helper";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LikedVideos = () => {
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const likedVideos = userInfo?.likedVideos || [];
  console.log(likedVideos);
  const [gradient, setGradient] = useState("");
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  // Fetch Thumbnail Gradient for the First Video
  useEffect(() => {
    const fetchGradient = async () => {
      if (likedVideos.length > 0 && likedVideos[0]?.thumbnailUrl) {
        try {
          const { data: colorData } = await axios.get(
            `${VITE_BASE_URL}/thumbnail-color?imageUrl=${encodeURIComponent(
              likedVideos[0].thumbnailUrl
            )}`
          );
          if (colorData?.gradient) setGradient(colorData.gradient);
        } catch (error) {
          console.error("Error fetching thumbnail color:", error);
        }
      }
    };
    fetchGradient();
  }, [likedVideos]);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Banner Section */}
        <div
          className="text-white p-6 rounded-lg w-full md:w-1/6 flex-shrink-0 sticky top-0 h-[90vh]"
          style={{
            background: gradient,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Display First Video Details */}
          {likedVideos.length > 0 && (
            <div>
              <img
                src={likedVideos[0]?.thumbnailUrl}
                alt={likedVideos[0]?.videoTitle}
                className="w-full h-30 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xs font-bold mt-4">
                {likedVideos[0]?.videoTitle}
              </h3>
              <p className="text-xs font-bold">{likedVideos[0]?.channelTitle}</p>
              <p className="text-xs">
                {formatViewCount(likedVideos[0]?.views)} views ·{" "}
                {formatPublishTime(likedVideos[0]?.watchDate)}
              </p>
            </div>
          )}
        </div>

        {/* Liked Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedVideos.map((video) => (
          <Link to={`/video/${video.id|| "general"}/${video.videoId}`} key={video.videoId}>
            <div key={video.id} className="rounded-2xl">
              <div>
                <img
                  src={video.thumbnailUrl}
                  alt={video.videoTitle}
                  className="w-full rounded-xl"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold">{video.videoTitle}</h3>
                <p className="text-xs text-gray-500">
                  {video.channelTitle} · {formatViewCount(video?.views)} views ·{" "}
                  {formatPublishTime(video.watchDate)}
                </p>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedVideos;
