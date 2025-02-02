const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const axios = require("axios"); // We'll use axios to make HTTP requests
const User = require("../models/userModels");
const JWTService = require("./jwttoken");
const jwt = require("jsonwebtoken")
const { someDatabaseCall } = require('./someDatabaseCell');
require("dotenv").config();

exports.GoogleProvider = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URI,
    scope: [
      "email",
      "profile",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.force-ssl"//  // YouTube scope added
    ],
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      // Fetch YouTube Channel data using the access token
      function isValidUrl(url) {
        const pattern = new RegExp('^(https?:\\/\\/)?([a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}|([0-9]{1,3}\\.){3}[0-9]{1,3})(:\\d+)?(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?$');
        return pattern.test(url);
      }
           
      const youtubeData = await getYouTubeChannelData(accessToken);
      const subscriptions= await this.fetchSubscriptionStatus(accessToken);
            
      // Now, include youtube data in the profile (or you can store it separately in your DB)
      profile.accessToken = accessToken
      profile.youtubeData = youtubeData;
      profile.subscriptions = subscriptions;
      profile.refreshToken = refreshToken;
     
      
      // Return profile with YouTube channel info
      console.log("Profile Data:", profile);

      const userData = {
        googleId: profile.id,
        userId: profile.id,
        displayName: profile.displayName || profile.name.givenName + " " + profile.name.familyName,
        name: {
          givenName: profile.name.givenName,
          familyName: profile.name.familyName,
        },
        email: {
          value: profile.emails[0].value || "",
          verified: profile.emails[0].verified || false,
        },
        profilePicture: profile.photos[0].value || "",
        provider: profile.provider,
        accessToken:accessToken,
        refreshToken:refreshToken,
        youtube: youtubeData
          ? {
              channel: {
                id: youtubeData.id,
                title: youtubeData.snippet?.title,
                description: youtubeData.snippet?.description,
                customUrl: youtubeData.snippet?.customUrl,
                publishedAt: youtubeData.snippet?.publishedAt,
                thumbnails: {
                  default: youtubeData.snippet?.thumbnails.default.url,
                  medium: youtubeData.snippet?.thumbnails.medium.url,
                  high: youtubeData.snippet?.thumbnails.high.url,
                },
              },
              statistics: youtubeData.statistics || {},
              contentDetails: youtubeData.contentDetails || {},
              subscriptions: (subscriptions && subscriptions.length > 0)
                ? subscriptions.map(sub => ({
                    id: sub.id,
                    snippet: {
                      title: sub.snippet?.title || '',
                      description: sub.snippet?.description || '',
                      channelId: sub.snippet?.resourceId?.channelId || '',
                      customUrl: isValidUrl(sub.snippet?.customUrl) ? sub.snippet?.customUrl : '',
                      publishedAt: sub.snippet?.publishedAt || new Date(),
                      thumbnails: {
                        default: sub.snippet?.thumbnails?.default?.url || '',
                        medium: sub.snippet?.thumbnails?.medium?.url || '',
                        high: sub.snippet?.thumbnails?.high?.url || '',
                      },
                    },
                  }))
                : [],
            }
          : {},
      };
      
      
      // Now you can use `userData` to save it to the database
      
            // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // Save new user to the database
        user = new User(userData);
        await user.save();
        console.log("New user saved:", user);
      } else {
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
        console.log("User already exists:", user);
      }
      const token = JWTService.generateToken({userId:user._id})
      console.log("Token:",token)
      // Pass the user to the next middleware
      cb(null, {token,user});
    } catch (error) {
      console.error("Error during authentication:", error);
      cb(error, null);
    }
  }
);
exports.refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", null, {
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      },
    });

    const { accessToken } = response.data;

    if (accessToken) {
      return accessToken; // Return the new access token
    }

    throw new Error("Unable to refresh access token");
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Failed to refresh access token");
  }
};

exports.getRefreshedToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required." });
    }

    const newAccessToken = await exports.refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ error: "Failed to refresh access token." });
  }
};

exports.fetchSubscriptionStatus =async(accessToken) => {
  let allSubscriptions = [];
  let nextPageToken = "";

  console.log("Access Token is here",accessToken)
  if (!accessToken) {
    console.error("No token found.");
    return { error: "Access token is required." };
  }
  try{
   response=await axios.get("https://www.googleapis.com/youtube/v3/subscriptions",{
    params:{
      part:"snippet,contentDetails",
      mine:true,
      maxResults: 100, // Maximum number of results per request
      ...(nextPageToken && { pageToken: nextPageToken })
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.data || !response.data.items) {
    console.error("Invalid YouTube API response:", response.data);
    return { error: "No subscription data found." };
  }

  console.log("YouTube API Response:", response.data);

  allSubscriptions = [...allSubscriptions, ...response.data.items];

  nextPageToken = response.data.nextPageToken;
  
  return allSubscriptions;
 

  
} catch (error) {
  console.error("Error fetching subscriptions:", error);
  return console.error("Full Error Object:", error);

}
}
// Function to get YouTube channel data using access token
const getYouTubeChannelData = async (accessToken) => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
      params: {
        part: "snippet,contentDetails,statistics", // What info we want
        mine: true, // Get data for the authenticated user's channel
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Return the channel data
    return response.data.items[0]; // YouTube channel info is in the first item
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    throw error;
  }
};


// Utility function to safely stringify objects without circular references
function stringifySafely(obj) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return; // Prevent circular reference
      }
      cache.add(value);
    }
    return value;
  });
}

// Function to post a comment to YouTube API
async function postCommentToYouTube(videoId, commentText, accessToken) {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet`,
      {
        snippet: {
          videoId: videoId,
          topLevelComment: {
            snippet: {
              textOriginal: commentText,
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If the comment is posted successfully, return the comment data
    console.log("Comment posted successfully:", response.data);
    return response.data.snippet.topLevelComment.snippet.textOriginal;
  } catch (error) {
    console.error("Error posting comment:", error.response?.data || error.message);
    
    // Check for specific YouTube API error codes
    if (error.response && error.response.status === 403) {
      throw new Error("Access forbidden. Check your API scopes or permissions.");
    } else if (error.response && error.response.status === 400) {
      throw new Error("Invalid request. Ensure the video ID and comment text are correct.");
    } else {
      throw new Error("Failed to post comment. Please try again later.");
    }
  }
}

// Function to handle comment submission in backend
exports.postComment = async (req, res) => {
    
    const { videoId, commentText, accessToken } = req.body;

    if (!videoId || !commentText || !accessToken) {
      return res.status(400).json({ error: "Video ID, comment text, and access token are required." });
    }

    // Safely log the received comment data
    console.log("Received comment data:", stringifySafely(req.body));
    try{

    const youtubeComment = await postCommentToYouTube(videoId, commentText, accessToken);

    // Save comment to database (implement your database logic here)
    const newComment = await someDatabaseCall(req.body); // Replace with actual DB call

    res.status(200).json({ 
      message: "Comment posted successfully.", 
      newComment, 
      youtubeComment 
    });
  } catch (error) {
    console.error("Error posting comment:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to post comment. Please try again later." });  }
};
exports.verifyTokens = async(req,res,next)=>{
  try {
    
    
     const authToken = req.headers["authorization"] || "";
     console
     if(!authToken || !authToken.startsWith("Bearer")){
         throw error("please login first")
     }
     const token  = authToken.split(" ")[1]
     if(!token){
      return res.status(401).json({ error: "Please login first" });
     }

     try {
      // Decoding the token (use your JWT secret here)
      const payload = jwt.verify(token,JWTService.jwt_auth);
    
      // Check the payload, it should match your expected structure
      console.log('Decoded payload:', payload);
      req.user = payload; // Attach the decoded user to the request object
    
      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      res.status(401).json({ error: "Invalid or malformed JWT token" });
    }
  }catch (error) {
    next(error);
  }
};

exports.profileController = async(req,res,next)=>{
  try {
    const user = await User.findById(req.user.userId);
    console.log("uuuuuserrr",user) // Find user by ID (assuming token contains user info)
    if (!user) return res.status(404).send("User not found");
    
    // Send user data including YouTube channel info
    res.json({
      displayName: user.displayName,
      profilePicture: user.profilePicture,
      accessToken:user.accessToken || "",
      youtube: user.youtube, // YouTube channel data
      subscriptions: user.subscriptions,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

async function likeYouTubeVideo(videoId, accessToken) {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Video liked successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error liking video:", error.response?.data || error.message);
    throw new Error("Failed to like the video. Please try again later.");
  }
}

// Adding the function to your profile controller
exports.likeVideo = async (req, res) => {
  const { videoId, accessToken } = req.body;

  if (!videoId || !accessToken) {
    return res.status(400).json({ error: "Video ID and access token are required." });
  }

  try {
    const likeResponse = await likeYouTubeVideo(videoId, accessToken);
    res.status(200).json({ message: "Video liked successfully.", likeResponse });
  } catch (error) {
    res.status(500).json({ error: "Failed to like the video. Please try again later." });
  }
};

const dislikeYouTubeVideo = async (videoId, accessToken) => {
  try {
    // Authorize the request with the access token
    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=dislike`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    

    // Log the response for debugging
    console.log('Dislike response:', response.data);

    // Return the API response
    return response.data;
  } catch (error) {
    console.error('Error disliking video:', error);
    throw new Error('Failed to dislike video');
  }
};

exports.dislikeVideo = async (req, res) => {
  const { videoId, accessToken } = req.body;

  if (!videoId || !accessToken) {
    return res.status(400).json({ error: "Video ID and access token are required." });
  }

  try {
    const dislikeResponse = await dislikeYouTubeVideo(videoId, accessToken);
    res.status(200).json({ message: "Video disliked successfully.", dislikeResponse });
  } catch (error) {
    res.status(500).json({ error: "Failed to dislike the video. Please try again later." });
  }
};


const likeYouTubeComment = async (commentId, accessToken) => {
  try {
    const commentDetails = await getCommentDetails(commentId, accessToken);
    if (commentDetails && commentDetails.items && commentDetails.items.length > 0) {
      const response = await axios.post(
        `https://www.googleapis.com/youtube/v3/comment/setRating`, 
        {}, // No body payload required
        {
                params: { id: commentId, rating: "like" },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
    
    console.log(`Like Response:, ${response.data}`); 
    
  }else {
    throw new Error("Comment not found or not accessible.");
  }
 
 } catch (error) {
    console.error(`Error liking YouTube comment:`,error);
    throw error;
  }
};

const dislikeYouTubeComment = async (commentId, accessToken) => {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/comments/rate`, 
      null, // No body payload required
      {
        params: {
          id: commentId,  // Comment ID
          rating: "dislike",  // Rating value for dislike
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Dislike Response:", response.data); // Corrected log message for dislike response
    return response.data;
  } catch (error) {
    console.error("Error disliking YouTube comment:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Backend: like comment
exports.likeComment = async (req, res) => {
  const { commentId, accessToken } = req.body;
  console.log("CommentId:",commentId,"Access Token:",accessToken);
  if (!commentId || !accessToken) {
    return res.status(400).json({ error: "Comment ID and access token are required." });
  }

  try {
    // Call the YouTube API to like the comment
    const likeResponse = await likeYouTubeComment(commentId, accessToken);
    res.status(200).json({ message: "Comment liked successfully.", data: likeResponse });
  } catch (error) {
    console.error("Error liking comment:", error.message);
    res.status(500).json({ error: "Failed to like the comment. Please try again later." });
  }
};

// Backend: dislike comment
exports.dislikeComment = async (req, res) => {
  const { commentId, accessToken } = req.body;

  if (!commentId || !accessToken) {
    return res.status(400).json({ error: "Comment ID and access token are required." });
  }

  try {
    // Call the YouTube API to dislike the comment
    const dislikeResponse = await dislikeYouTubeComment(commentId, accessToken);
    res.status(200).json({ message: "Comment disliked successfully.", data: dislikeResponse });
  } catch (error) {
    console.error("Error disliking comment:", error.message);
    res.status(500).json({ error: "Failed to dislike the comment. Please try again later." });
  }
};


const getCommentDetails = async (commentId, accessToken) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/comments?id=${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Comment details:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comment details:", error.response ? error.response.data : error.message);
    throw error;
  }
};