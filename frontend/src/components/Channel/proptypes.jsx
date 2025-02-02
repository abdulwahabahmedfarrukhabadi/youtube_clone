import PropTypes from "prop-types";

const ChannelContentPropTypes = {
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Playlist ID
      snippet: PropTypes.shape({
        thumbnails: PropTypes.shape({
          medium: PropTypes.shape({
            url: PropTypes.string.isRequired, // Playlist thumbnail URL
          }),
        }),
        title: PropTypes.string.isRequired, // Playlist title
        channelTitle: PropTypes.string, // Playlist's channel name (optional)
      }).isRequired,
      contentDetails: PropTypes.shape({
        itemCount: PropTypes.number, // Number of videos in the playlist (optional)
      }),
    })
  ).isRequired,
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.shape({
          videoId: PropTypes.string.isRequired, // Video ID
        }),
        PropTypes.string, // Support for a direct string ID if necessary
      ]),
      snippet: PropTypes.shape({
        thumbnails: PropTypes.shape({
          medium: PropTypes.shape({
            url: PropTypes.string.isRequired, // Video thumbnail URL
          }),
        }),
        title: PropTypes.string.isRequired, // Video title
        channelTitle: PropTypes.string, // Video's channel name (optional)
        publishedAt: PropTypes.string.isRequired, // Publish date
      }).isRequired,
    })
  ).isRequired,
};
export default ChannelContentPropTypes;