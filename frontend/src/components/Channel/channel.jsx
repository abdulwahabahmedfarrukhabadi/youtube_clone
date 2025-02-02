import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChannelHeader from "./channelHeader";
import ChannelTabs from "./channelTabs";
import ChannelContent from "./channelContent";
import { fetchApiFromYoutubeData } from "../../utilis/fetchApi";

const Channel = () => {
  const { id } = useParams(); // Extract channel ID from the URL
  const [channelDetails, setChannelDetails] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]); // State for shorts
  const [loading, setLoading] = useState(false);

  // Fetch channel details
  const fetchChannelDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchApiFromYoutubeData("channels", {
        part: "snippet,statistics,brandingSettings",
        id,
      });
      setChannelDetails(data.items[0]); // Assuming the first item is the desired channel
    } catch (error) {
      console.error("Error fetching channel details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch playlists for the channel
  const fetchChannelPlaylists = async () => {
    setLoading(true);
    try {
      const data = await fetchApiFromYoutubeData("playlists", {
        part: "snippet,contentDetails",
        channelId: id,
        maxResults: 10,
      });
      setPlaylists(data.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch videos for the channel and separate shorts
  const fetchChannelVideos = async () => {
    setLoading(true);
    try {
      const data = await fetchApiFromYoutubeData("search", {
        part: "snippet",
        channelId: id,
        maxResults: 90,
        order: "date",
      });
      const videoIds = data.items.map((video) => video.id.videoId).join(",");
      if (videoIds) {
        // Fetch video details (including contentDetails) for these video IDs
        const videoDetails = await fetchApiFromYoutubeData("videos", {
          part: "contentDetails,snippet,statistics",
          id: videoIds,
        });

        const mergedVideos = data.items.map((video) => {
          const details = videoDetails.items.find(
            (detail) => detail.id === video.id.videoId
          );
          return {
            ...video,
            contentDetails: details?.contentDetails,
            statistics: details?.statistics,
          };
        });

        // Separate shorts (videos less than 60 seconds)
        const shortVideos = mergedVideos.filter((video) => {
          const duration = video?.contentDetails?.duration;
          if (duration) {
            const match = duration.match(/PT(\d+)M(\d+)?S?/); // Regex for duration in ISO 8601 format
            const minutes = parseInt(match?.[1] || "0", 10);
            const seconds = parseInt(match?.[2] || "0", 10);
            return minutes === 0 && seconds < 60; // Check if the video is under 1 minute
          }
          return false;
        });

        setVideos(mergedVideos); // Save all videos
        setShorts(shortVideos); // Save shorts
      } else {
        setVideos([]); // No videos found
        setShorts([]); // No shorts found
      }
    } catch (error) {
      console.error("Error fetching channel videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchChannelDetails();
      fetchChannelPlaylists();
      fetchChannelVideos();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!channelDetails) {
    return <div className="text-center mt-20">Channel not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Channel Header */}
      <ChannelHeader channelDetails={channelDetails} />

      {/* Tabs for navigating between playlists, videos, and shorts */}
      <ChannelTabs />

      {/* Channel Content */}
      <ChannelContent playlists={playlists} videos={videos} shorts={shorts} />
    </div>
  );
};

export default Channel;
