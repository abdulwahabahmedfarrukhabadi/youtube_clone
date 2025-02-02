const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String,
  userId: String,
  displayName: String,
  name: {
    givenName: String,
    familyName: String,
  },
  email: {
    value: String,
    verified: Boolean,
  },
  profilePicture: String,
  provider: String,
  accessToken: {
    type: String,
    select: true,
  },
  refreshToken: {
    type: String,
    select: true,
  },

  youtube: {
    channel: {
      id: String,
      title: String,
      description: String,
      customUrl: String,
      publishedAt: Date,
      thumbnails: {
        default: String,
        medium: String,
        high: String,
      },
    },
    statistics: {
      viewCount: Number,
      subscriberCount: Number,
      hiddenSubscriberCount: Boolean,
      videoCount: Number,
    },
    contentDetails: Object,
    subscriptions: [
      {
        id: String, // YouTube subscription ID
        snippet: {
          title: String,
          description: String,
          channelId: String,
          customUrl: String,
          publishedAt: Date,
          thumbnails: {
            default: String,
            medium: String,
            high: String,
          },
        },
      },
    ],
  },

  // New watchHistory field added here
  watchHistory: [
    {
      videoId: {
        type: String,
        
        unique: true, // Ensure no duplicate entries for the same video
      },
      videoTitle: {
        type: String,
      },
      videoDescription: {
        type: String,
        default: "", // Optional description
      },
      thumbnailUrl: {
        type: String,
        default: "", // Optional URL for the video thumbnail
      },
      channelId: {
        type: String,
      },
      channelTitle: {
        type: String,
      },
      watchDate: {
        type: Date,
        default: Date.now, // Set current time when the video is watched
      },
      views: {
        type: Number
         // Set current time when the video is watched
      },
      duration: {
        type: Number, // Duration in seconds (optional)
      },
      isWatched: {
        type: Boolean,
        default: true, // Mark as watched
      },
    },
  ],

  storage: {
    files: Array,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
