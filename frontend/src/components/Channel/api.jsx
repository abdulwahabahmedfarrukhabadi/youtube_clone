import axios from 'axios';

export const fetchPlaylistDetails = async (playlistId) => {
  try {
    // Step 1: Fetch the playlist items (videos)
    const playlistResponse = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: "snippet,contentDetails",
        maxResults: 20, // Number of videos to fetch
        playlistId: playlistId,
        key: 'AIzaSyBzyo8LuRMLJ30b7k_HYvKwK8-eM0g5ImE', // Replace with your YouTube API Key
      },
    });

    const playlistItems = playlistResponse.data.items;

    // Step 2: Fetch video statistics for each video
    const videoIds = playlistItems.map(item => item.contentDetails.videoId).join(',');
    
    // Fetch video statistics (views, likes, etc.)
    const videoStatsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'statistics,contentDetails',
        id: videoIds,
        key: 'AIzaSyAbbhmVYVg_achVpqr1e-SM65P07qqcL_c', // Replace with your YouTube API Key
      },
    });

    // Step 3: Combine playlist data with statistics
    const updatedPlaylistData = playlistItems.map(item => {
      // Find the corresponding video statistics
      const videoStats = videoStatsResponse.data.items.find(
        video => video.id === item.contentDetails.videoId
      );

      return {
        ...item,
        statistics: videoStats ? videoStats.statistics : {}, // Add statistics to the video data
      };
    });

    return {
      ...playlistResponse.data,
      items: updatedPlaylistData, // Return the updated playlist with statistics
    };

  } catch (error) {
    console.error("Error fetching playlist data or video statistics:", error);
    throw error;
  }
};
