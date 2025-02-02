// googleAuthController.js
const User = require('../models/User'); // Adjust the path based on your project structure

const saveUser = async (req, res) => {
  try {
    // Extract user and YouTube data from the request body
    const { id, displayName, name, emails, photos, provider, youtubeData } = req.body;

    // Check if the user already exists in the database
    let existingUser = await User.findOne({ 'user.id': id });
    if (existingUser) {
        cb(null,existingUser);
      return res.status(200).json({ message: 'User already exists', user: existingUser });
    }

    // Create a new user document
    const newUser = new User({
      user: {
        id,
        name: {
          givenName: name.givenName,
          familyName: name.familyName,
          displayName,
        },
        email: {
          value: emails[0].value,
          verified: emails[0].verified,
        },
        profilePicture: photos[0].value,
        provider,
      },
      youtube: {
        channel: {
          id: youtubeData.id,
          title: youtubeData.snippet.title,
          description: youtubeData.snippet.description,
          customUrl: youtubeData.snippet.customUrl,
          publishedAt: youtubeData.snippet.publishedAt,
          thumbnails: {
            default: youtubeData.snippet.thumbnails.default.url,
            medium: youtubeData.snippet.thumbnails.medium.url,
            high: youtubeData.snippet.thumbnails.high.url,
          },
        },
        statistics: {
          viewCount: youtubeData.statistics.viewCount,
          subscriberCount: youtubeData.statistics.subscriberCount,
          hiddenSubscriberCount: youtubeData.statistics.hiddenSubscriberCount,
          videoCount: youtubeData.statistics.videoCount,
        },
        contentDetails: {
          relatedPlaylists: {
            likes: youtubeData.contentDetails.relatedPlaylists.likes,
            uploads: youtubeData.contentDetails.relatedPlaylists.uploads,
          },
        },
      },
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User saved successfully', user: savedUser });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { saveUser };
