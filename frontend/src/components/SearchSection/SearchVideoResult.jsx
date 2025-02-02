import { useEffect, useState } from "react";
import { useTheme } from "../../useContextHook/useTheme";
import { useAppContext } from "../../useContextHook/useContextApi";
import { fetchApiFromYoutubeData } from "../../utilis/fetchApi";
import { useParams } from "react-router-dom";
import Sidebar from "../SidebarSection/Sidebar";
import { Link } from "react-router-dom";
import {
  formatPublishTime,
  formatViewCount,
  formatDuration,
  formatDuration2,
} from "../../utilis/helper";
import LoadingSpinner from "../LoadingSpinner";

const SearchVideoResult = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [shortsVideos, setShortsVideos] = useState([]);
  const [nonShortsVideos, setNonShortsVideos] = useState([]);
  const { isDarkMode } = useTheme();
  const { loading, setLoading } = useAppContext();
  const { searchQuery } = useParams();

  const fetchSearchVideos = async () => {
    setLoading(true); // Start loading
    try {
      // Fetch search results
      const data = await fetchApiFromYoutubeData("search", {
        part: "snippet",
        regionCode: "IN",
        q: searchQuery,
        type: "video",
        maxResults: 50,
      });

      const videoIds = data.items.map((item) => item.id.videoId).join(",");
      const videoDetailsResponse = await fetchApiFromYoutubeData("videos", {
        part: "snippet,contentDetails,statistics",
        id: videoIds,
      });

      const allVideos = videoDetailsResponse?.items || [];

      // Separate shorts and non-shorts videos
      const shorts = allVideos.filter((video) => {
        const totalSeconds = formatDuration2(video?.contentDetails?.duration);
        return !isNaN(totalSeconds) && totalSeconds <= 60; // Videos ≤ 1 minute
      });

      const nonShorts = allVideos.filter((video) => {
        const totalSeconds = formatDuration2(video?.contentDetails?.duration);
        return !isNaN(totalSeconds) && totalSeconds > 60; // Videos > 1 minute
      });

      setSearchResults(allVideos); // All videos
      setShortsVideos(shorts); // Filtered shorts
      setNonShortsVideos(nonShorts); // Filtered non-shorts
    } catch (error) {
      console.error("Fetching search error", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchSearchVideos();
  }, [searchQuery]);

  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <div className="flex-shrink-0 overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className={`flex-grow overflow-y-auto ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"}`}
      >
        {/* Show loading spinner only when data is being fetched */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="p-4">
            {/* Non-Shorts Videos */}
            <h2 className="text-xl font-bold mb-4">Videos</h2>
            {nonShortsVideos.length > 0 ? (
              nonShortsVideos.map((video) => (
                <div className="flex flex-col md:flex-row mb-8" key={video.id}>
                  <div className="relative">
                    <Link to={`/video/${video?.snippet?.categoryId}/${video.id}`}>
                      <img
                        src={video?.snippet?.thumbnails?.medium?.url}
                        alt={video?.snippet?.title}
                        className="w-full h-auto object-cover rounded-md"
                      />
                      <span className="absolute bottom-2 right-2 bg-gray-800 text-white text-sm px-2 py-1 rounded">
                        {formatDuration(video?.contentDetails?.duration)}
                      </span>
                    </Link>
                  </div>
                  <div className="md:ml-4 md:w-2/3">
                    <h3 className="text-lg font-bold">{video?.snippet?.title}</h3>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {video?.snippet?.channelTitle}
                    </div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {formatViewCount(video?.statistics?.viewCount)} views · {formatPublishTime(video?.snippet?.publishedAt)}
                    </div>
                    <p className="mt-2">{video?.snippet?.description.slice(0, 100)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No videos found</p>
            )}

            {/* Shorts Videos */}
            <h2 className="text-xl font-bold mt-8 mb-4">Shorts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-15">
              {shortsVideos.length > 0 ? (
                shortsVideos.map((video) => (
                  <div className="flex flex-col md:flex-row gap-3 mb-8" key={video.id}>
                    <div className="relative rounded-lg">
                      <Link to={`/shorts/${video?.snippet?.categoryId}/${video.id}`}>
                        <img
                          src={video?.snippet?.thumbnails?.high?.url}
                          alt={video?.snippet?.title}
                          className="max-w-[180px] h-[49vh] object-cover rounded-lg"
                        />
                        <span className="absolute bottom-2 right-2 bg-gray-800 text-white text-sm px-2 py-1 rounded">
                          {formatDuration(video?.contentDetails?.duration)}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No shorts found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchVideoResult;
