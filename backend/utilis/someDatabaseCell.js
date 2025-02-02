// utils/database.js (or wherever you define your functions)
const Comment = require('../models/comment');

async function someDatabaseCall(commentData) {
  const { videoId, commentText, authorName } = commentData;

  // Create a new comment
  const newComment = new Comment({
    videoId,
    commentText,
    authorName,
    timestamp: new Date(),
  });

  // Save the comment to the database
  return await newComment.save();
}

module.exports = { someDatabaseCall };
