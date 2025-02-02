/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import ChannelContentPropTypes from "./proptypes"; // Import the PropTypes definition
import { formatDuration, formatViewCount, formatPublishTime, formatDuration2 } from "../../utilis/helper";
import { useTheme } from "../../useContextHook/useTheme";
import { Link } from "react-router-dom";

const Card = ({ video, isShort }) => {
  const decodeHTML = (html) => {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html").body.textContent;
  };
  return (
    <Link to={`/${isShort ? "shorts" : "video"}/${video.snippet.categoryId || "general"}/${video.id.videoId}`}>
      <div className="relative rounded-lg">
        <img
          src={video.snippet.thumbnails.high.url}
          alt={video.snippet.title}
          className={`${isShort ? "max-w-[130px] h-[35vh]" : "w-full h-25"} object-cover rounded-lg`}
        />
        {!isShort && (
          <span className="absolute bottom-28 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video?.contentDetails?.duration)}
          </span>
        )}
        <div className="p-2">
          <h3 className="text-xs font-bold">{decodeHTML(video.snippet.title)}</h3>
          <p className="text-xs text-gray-500">
            {formatViewCount(video?.statistics?.viewCount)} views · {formatPublishTime(video.snippet.publishedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};

const ChannelContent = ({ playlists, videos, shorts }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const { isDarkMode } = useTheme();

  const decodeHTML = (html) => {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html").body.textContent;
  };


  // Non-shorts videos: longer than 60 seconds
  const nonShortsVideos = useMemo(() => {
    return videos.filter((video) => {
      const totalSeconds = formatDuration2(video?.contentDetails?.duration);
      return totalSeconds > 60; // Only include videos longer than 60 seconds
    });
  }, [videos]);

  // Shorts videos: 60 seconds or less
  const shortsVideos = useMemo(() => {
    return shorts.filter((video) => {
      const totalSeconds = formatDuration2(video?.contentDetails?.duration);
      return totalSeconds <= 60; // Only include videos shorter than or equal to 60 seconds
    });
  }, [shorts]);

  // For You section: Non-shorts first, followed by shorts
  const forYouContent = useMemo(() => {
    return [
      ...nonShortsVideos.slice(0, 4), // First 6 non-shorts
      ...shortsVideos.slice(5, 8),    // Then first 6 shorts
    ];
  }, [nonShortsVideos, shortsVideos]);

  // Popular Videos section: Non-shorts first, followed by shorts
  const popularContent = useMemo(() => {
    return [
      ...nonShortsVideos.slice(8, 12), // Next 6 non-shorts
      ...shortsVideos.slice(12, 16),    // Then next 6 shorts
    ];
  }, [nonShortsVideos, shortsVideos]);

  // All videos: Unique and sorted by publish date
  const allVideos = useMemo(() => {
    const uniqueVideos = [];
    const videoIds = new Set();
    nonShortsVideos.forEach((video) => {
      if (!videoIds.has(video.id.videoId)) {
        videoIds.add(video.id.videoId);
        uniqueVideos.push(video);
      }
    });
    return uniqueVideos.sort(
      (a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
    );
  }, [nonShortsVideos]);

  const cardClasses = `relative rounded-lg`;


  const hasPlaylists = playlists && playlists.length > 0;
  const hasVideos = allVideos && allVideos.length > 0;
  const hasShorts = shortsVideos && shortsVideos.length > 0;

  const visibleTabs = [
    { name: "Home", visible: true },
    { name: "Playlists", visible: hasPlaylists },
    { name: "Videos", visible: hasVideos },
    { name: "Shorts", visible:hasShorts},
  ].filter((tab) => tab.visible);

  return (
    <div className={`p-4 ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-800"} min-h-screen`}>
      {/* Tabs */}
      <div className="flex border-b mb-4">
        {visibleTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-6 py-1 text-base font-semibold ${activeTab === tab.name ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Home" && (
        <div>
          {/* For You Section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">For You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {forYouContent.map((content) => (
                <Card
                  key={content.id.videoId || content.id}
                  video={content}
                  isShort={formatDuration2(content?.contentDetails?.duration) <= 60}
                />
              ))}
            </div>
          </section>

          {/* Popular Videos Section */}
          <section>
            <h2 className="text-xl font-bold mb-4">Popular Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularContent.map((content) => (
                <Card
                  key={content.id.videoId || content.id}
                  video={content}
                  isShort={formatDuration2(content?.contentDetails?.duration) <= 60}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Shorts Section */}
      {activeTab === "Shorts" && hasShorts &&(
        <div>
          <h2 className="text-3xl font-bold mb-4">Shorts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-15">
            {shortsVideos.map((video) => (
                <Link to={`/shorts/${video.snippet.categoryId || "general"}/${video.id.videoId}`} key={video.id.videoId}>
                  <div className={cardClasses}>
                    <img
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                      className="max-w-[150px] h-[40vh] object-cover rounded-lg"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-bold">{decodeHTML(video.snippet.title)}</p>
                    <p className="text-xs text-gray-500">
                      {formatViewCount(video?.statistics?.viewCount)} views ·{" "}
                      {formatPublishTime(video.snippet.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
            )}

      {/* Playlists Section */}
      {activeTab === "Playlists" && hasPlaylists &&(
        <div>
          <h2 className="text-lg font-bold mb-4">Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
                <div key={playlist.id} className={cardClasses}>
                  <img
                    src={playlist.snippet.thumbnails.high.url}
                    alt={playlist.snippet.title}
                    className="w-full h-15 object-cover rounded-lg"
                  />
                  <span className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {playlist.contentDetails.itemCount} videos
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold">{decodeHTML(playlist.snippet.title)}</h3>
                  <p className="text-xs text-gray-600">{playlist.snippet.channelTitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {activeTab === "Videos" && hasVideos &&(
        <div>
          <h2 className="text-xl font-bold mb-4">All Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allVideos.map((video) => (
              <Link to={`/video/${video.snippet.categoryId || "general"}/${video.id.videoId}`} key={video.id.videoId}>
                <div className={cardClasses}>
                  <img
                    src={video.snippet.thumbnails.high.url}
                    alt={video.snippet.title}
                    className="w-full h-25 object-cover rounded-lg"
                  />
                  <span className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video?.contentDetails?.duration)}
                  </span>
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-bold">{decodeHTML(video.snippet.title)}</h3>
                  <p className="text-xs text-gray-500">
                    {formatViewCount(video?.statistics?.viewCount)} views · {formatPublishTime(video.snippet.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ChannelContent.propTypes = ChannelContentPropTypes;

export default ChannelContent;
