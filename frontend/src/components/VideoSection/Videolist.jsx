/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { formatDuration, formatViewCount, formatPublishTime } from "../../utilis/helper";
import { useTheme } from "../../useContextHook/useTheme";
import { fetchApiFromYoutubeData } from "../../utilis/fetchApi";

// eslint-disable-next-line react/prop-types
const Videolist = ({ video, isShort = false }) => {
    const { isDarkMode } = useTheme();
    const [channelData, setChannelData] = useState();

    const fetchChannelData = async () => {
        const data = await fetchApiFromYoutubeData('channels', {
            part: "snippet,contentDetails,statistics",
            id: video?.snippet?.channelId
        });
        setChannelData(data?.items[0]);
    };

    useEffect(() => {
        fetchChannelData();
    }, [video]);

    return (
        <div>
            {/* Conditional Link rendering for regular videos or Shorts */}
            <Link to={isShort ? `shorts/${video.snippet.categoryId}/${video.id}` : `video/${video.snippet.categoryId}/${video.id}`}>
                <div className="flex flex-col mb-8">
                    <div className="relative md:rounded-xl overflow-hidden">
                        <img
                            src={video?.snippet?.thumbnails?.medium?.url}
                            alt={video.snippet.title}
                            className="w-full h-full object-cover rounded-md mb-2"
                        />
                        {/* Show duration for Shorts */}
                        {!isShort && (
                            <span className="absolute bottom-4 right-0 bg-gray-800 text-white text-xs p-1 m-1 rounded">
                                {formatDuration(video?.contentDetails?.duration)}
                            </span>
                        )}
                    </div>

                    <div className="flex mt-3">
                        <div className="flex items-center">
                            <div className="flex h-9 w-9 rounded-full overflow-hidden">
                                <img
                                    src={channelData?.snippet?.thumbnails?.medium?.url}
                                    alt={channelData?.snippet?.title}
                                    className="w-full h-full object-cover rounded-md mb-2"
                                />
                            </div>
                        </div>

                        <div className={`flex flex-col ml-3 overflow-hidden ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"}`}>
                            <h3 className="text-md font-bold">{video?.snippet?.title}</h3>
                            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {video?.snippet?.channelTitle}
                            </div>
                            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {formatViewCount(video?.statistics?.viewCount)} views . {formatPublishTime(video?.snippet?.publishedAt)}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Videolist;
