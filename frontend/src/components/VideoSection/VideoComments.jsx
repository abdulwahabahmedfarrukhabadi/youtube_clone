/* eslint-disable react/prop-types */
import { formatPublishTime, formatViewCount } from "../../utilis/helper";
import Icon from "../Icon";
import DOMPurify from "dompurify";
import axios from "axios";
import { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../useContextHook/useContextApi";
import { fetchApiFromYoutubeData } from "../../utilis/fetchApi";
import MoreOptionsIcon from "./MoreIcon";

const VideoComments = ({ comment }) => {
 
  const commentSnippet = comment?.snippet?.topLevelComment?.snippet;
  const sanitizedText = DOMPurify.sanitize(commentSnippet?.textDisplay || "");
  const { videoId } = useParams();
  const [selectedVideoDetails, setSelectedVideoDetails] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [liked, setLiked] = useState(false); // Track the like state
  const [disliked, setDisliked] = useState(false); // Track the dislike state
  const [likeCount, setLikeCount] = useState(commentSnippet?.likeCount || 0);
  const [repliesMap, setRepliesMap] = useState({});
  const [repliesMap2, setRepliesMap2] = useState({}); // State to store replies for each comment
  const [showReplies, setShowReplies] = useState(false); // State to control replies visibility
  const { setLoading } = useAppContext();
  
  const [originalText, setOriginalText] = useState("");
  const [replyText, setReplyText] = useState(""); // State for holding the reply input text

 const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef(null);

   const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  
  
  
  const saveEditedComment = () => {
    handleEditComment(editedText);
    setIsEditing(false);
  };


  const handleToggleOptions = () => {
    setShowOptions((prev) => !prev);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInfo = JSON.parse(localStorage.getItem("user-info")) || {};
  const accessToken = userInfo.accessToken;
  const loggedInUserChannelId = userInfo?.youtube?.channel?.customUrl;
  
 

  const fetchSelectedVideosDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchApiFromYoutubeData("videos", {
        part: "snippet,contentDetails,statistics",
        id: videoId,
      });
      setSelectedVideoDetails(data.items[0]);
    } catch (error) {
      console.error("Error fetching video details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelData = async () => {
    if (selectedVideoDetails?.snippet?.channelId) {
      setLoading(true);
      try {
        const data = await fetchApiFromYoutubeData("channels", {
          part: "snippet,contentDetails,statistics",
          id: selectedVideoDetails.snippet.channelId,
        });
        setChannelData(data.items[0]);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      } finally {
        setLoading(false);
      }
    }
  };
   
  useEffect(() => {
    fetchSelectedVideosDetails();
  }, [videoId]);

  useEffect(() => {
    fetchChannelData();
  }, [selectedVideoDetails]);

  // Fetch replies for each comment when it's needed
  useEffect(() => {
    const fetchReplies = async () => {
      
      const commentId = comment?.snippet?.topLevelComment?.id;
      if (!commentId) return;

      try {
        const API_KEY = import.meta.env.VITE_API_KEY;
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${commentId}&key=${API_KEY}`
        );
        setRepliesMap2(response.data.items?.map((reply) => {
          console.log("Reply:", reply.snippet.textDisplay);
          return reply.snippet.textDisplay;
        }) )|| [];
        // Store replies for this specific commentId
        setRepliesMap((prev) => ({
          ...prev,
          [commentId]: response.data.items || [],
        }));
          // Log the textDisplay of each reply
        } catch (error) {
        console.error("Error fetching replies:", error.message);
      }
    };

    if (comment?.snippet?.topLevelComment?.id) {
      fetchReplies();
    }
  }, [comment]);
   console.log("replies:",repliesMap2)
  const handleLike = async () => {
    const commentId = comment?.snippet?.topLevelComment?.id;

    if (!accessToken) {
      alert("Please log in to like the comment.");
      return;
    }

    try {
      // API call to like the comment
      const response = await axios.post(
        `https://www.googleapis.com/youtube/v3/comments/setRating`,
        {
          id: commentId,
          rating: "like",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      if (!liked) {
        setLikeCount(likeCount + 1);
        setLiked(true);
        if (disliked) {
          setDisliked(false);
        }
      }
    } catch (error) {
      if (error.response) {
        console.error('API Error:', error.response.data);
      } else if (error.request) {
        console.error('Network Error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const handleDislike = async () => {
    const commentId = comment?.snippet?.topLevelComment?.id;

    if (!accessToken) {
      alert("Please log in to dislike the comment.");
      return;
    }

    try {
      // API call to dislike the comment
      await axios.post(`https://www.googleapis.com/youtube/v3/comments/rate`, {
        commentId,
        accessToken,
      });

      if (!disliked) {
        setDisliked(true);
        if (liked) {
          setLikeCount(likeCount - 1);
          setLiked(false);
        }
      }
    } catch (error) {
      console.error("Error disliking the comment:", error.message);
    }
  };
  
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  // Function to handle posting a reply to a comment
  const handlePostReply = async (parentId) => {
    console.log("Parent ID:",parentId);
    console.log("chabei",accessToken)
    if (!replyText.trim()) {
      alert("Please enter a reply.");
      return;
    }

    try {
      
      const response = await axios.post(
        `https://www.googleapis.com/youtube/v3/comments?part=snippet`,
        {
          snippet: {
            parentId: parentId,
            textOriginal: replyText,
          },
        },
        {
        headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // After posting, clear the reply input field
      setReplyText("");

      // Add the new reply to the replies map (optimistic UI update)
      setRepliesMap((prev) => ({
        ...prev,
        [parentId]: [...(prev[parentId] || []), response.data.items[0]],
      }));
      console.log("Reply posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting reply:", error.response.data ||error.message);
    }
  };

  // Function to make mentions and time spans clickable
  const makeTextClickable = (text) => {
    const mentionRegex = /@([a-zA-Z0-9_]+)/g; // Match @username
    const timeSpanRegex = /\b(\d+ (hour|day|minute|second)s? ago)\b/g; // Match "X hours ago" or "X days ago"

    // Replace mentions with links to user profiles (you can modify the link if needed)
    text = text.replace(mentionRegex, (match, username) => {
      return `<a href="https://www.youtube.com/@${username}" target="_blank" class="text-blue-500">@${username}</a>`;
    });

    // Replace time spans with clickable text
    text = text.replace(timeSpanRegex, (match) => {
      return `<a href="#" class="text-blue-500">${match}</a>`;
    });

    return text;
  };
  
  const [showReply,setShowReply] = useState(false);

  const toggleReply = () =>{
    setShowReply(!showReply);
  }


  const handleEditComment = async (newCommentText) => {
    const commentId = comment?.snippet?.topLevelComment?.id;
  
    if (!accessToken) {
      alert("Please log in to edit the comment.");
      return;
    }
  
    if (!newCommentText.trim()) {
      alert("Please enter a valid comment text.");
      return;
    }
  
    try {
      // API call to update the comment text
      const response = await axios.put(
        `https://www.googleapis.com/youtube/v3/comments`,
        {
          id: commentId,  // ID of the comment to update
          snippet: {
            textOriginal: newCommentText,  // New comment text
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log("Comment updated successfully:", response.data);
      // Optimistic UI update
      setOriginalText(newCommentText);
      setIsEditing(false); // Update the UI with the new comment text
    } catch (error) {
      console.error("Error updating comment:", error.response?.data || error.message);
    }
  };


  const cancelEditing = () => {
    
    setEditedText(originalText);
    setIsEditing(false); // Reset text on cancel
  };


  const startEditing = () => {
    setOriginalText(comment?.snippet?.topLevelComment?.snippet?.textDisplay);  // Store the original comment
    setEditedText(originalText);  // Start editing with the original text
    setIsEditing(true);  // Enter edit mode
  };
  
  const handleDeleteComment = async (commentId) => {
  
    if (!accessToken) {
      alert("Please log in to delete the comment.");
      return;
    }
  
    try {
      // API call to delete the comment
      await axios.delete(
        `https://www.googleapis.com/youtube/v3/comments`,
        {
          params: {
            id: commentId,  // ID of the comment to delete
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log("Comment deleted successfully.");
      // Optimistic UI update: Remove the comment from the UI
      setRepliesMap((prev) => {
        const updatedReplies = { ...prev };
        delete updatedReplies[commentId];  // Remove the comment from the state
        return updatedReplies;
      });
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
    }
  };
  
 console.log(comment?.snippet.topLevelComment.snippet);
  return (
    <div className="flex flex-col lg:flex-row items-start mb-4 p-4 rounded-lg">
      {/* Profile Picture */}
      <div className="w-12 h-12 flex-shrink-0">
        <img
          src={commentSnippet?.authorProfileImageUrl}
          alt={commentSnippet?.authorDisplayName}
          className="w-10 h-10 rounded-full"
        />
      </div>

      {/* Comment Details */}
      <div className="flex-1 ml-2">
        <div className="flex gap-2">
          <h3 className="text-sm lg:text-sm font-semibold">
            {commentSnippet?.authorDisplayName}
          </h3>
          <p className="text-xs lg:text-xs">
            {commentSnippet?.publishedAt
              ? formatPublishTime(commentSnippet.publishedAt)
              : "now"}
          </p>
          
          {comment?.snippet?.topLevelComment?.snippet?.isHearted && (
            <div className="ml-4 flex items-center">
              <img
                src={channelData?.snippet?.thumbnails?.default?.url} // Replace with channel owner's profile image URL
                alt="Channel Owner"
                className="w-8 h-8 rounded-full border-2 border-red-500"
              />
              <span className="ml-2 text-xs lg:text-sm text-red-500 font-semibold flex items-center">
                <Icon name="favorite" fill={1} weight={700} grade={0} opticalSize={24} />
              </span>
            </div>
          )}
        </div>

        {/* Render sanitized and clickable comment text */}
        <p
          className="text-sm lg:text-sm mt-1"
          dangerouslySetInnerHTML={{
            __html: makeTextClickable(sanitizedText),
          }}
        ></p>

        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <Icon
              name="thumb_up"
              liked={liked}
              onClick={handleLike}
              fill={liked ? 1 : 0}
              weight={700}
              grade={0}
              opticalSize={40}
            />
            <span className="text-xs lg:text-xs">{formatViewCount(likeCount)}</span>
            <Icon
              name="thumb_down"
              liked={disliked}
              onClick={handleDislike}
              fill={disliked ? 1 : 0}
              weight={700}
              grade={0}
              opticalSize={48}
            />
             {loggedInUserChannelId === comment?.snippet.topLevelComment.snippet.authorDisplayName && (
    <div>
      <button className="text-blue-600 pr-2" onClick={() => handleEditComment("New text for the comment")}>
        Edit Comment
      </button>
      <button className="text-blue-600 pr-2"onClick={() =>handleDeleteComment(comment?.snippet?.topLevelComment?.id)}>
        Delete Comment
      </button>
    </div>
  )}
   
            <button
            className="mt-0 text-blue-600 pl-3"
            onClick={toggleReply}
          >
            {showReply
              ? "Cancel" 
              : `Reply `}
          </button>
          </div>
        </div>

       
       {/* Replies Section */}
   {repliesMap[comment?.snippet?.topLevelComment?.id]?.length > 0 && (
          <button
            className="pt-5 text-blue-600"
            onClick={toggleReplies}
          >
            {showReplies 
              ? "Hide Replies" 
              : `Show ${repliesMap[comment?.snippet?.topLevelComment?.id]?.length} Replies`}
          </button>
        )}
       
        {showReplies && (
          <div className="mt-4 ml-6">
            {repliesMap[comment?.snippet?.topLevelComment?.id]?.map((reply) => (
              console.log("Reply",reply),
              <div key={reply.id} className="flex mt-2 gap-2 mb-5">
                <img
                  src={reply.snippet.authorProfileImageUrl}
                  alt={reply.snippet.authorDisplayName}
                  className="w-12 h-12 rounded-full mr-2"
                />
                <div>
                <div className="flex relative gap-2 ">
                  <h5 className="text-sm font-semibold">
                    {reply.snippet.authorDisplayName}
                  </h5>
                  
                  
                  <div className="flex relative">
                   {loggedInUserChannelId === reply?.snippet?.authorDisplayName &&(
                    <button
                    className=""
                    onClick={handleToggleOptions}
                  >
                  <MoreOptionsIcon/>

                  </button>)}
                {showOptions && 
                loggedInUserChannelId === reply?.snippet?.authorDisplayName && (
  <div className="absolute left-5  mt-2 w-32 bg-white shadow-md rounded-lg p-2 z-50"  ref={menuRef}>
    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={startEditing}>
      Edit Comment
    </button>
    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"onClick={()=>handleDeleteComment(reply?.id)}>
      Delete Comment
    </button>
  </div>
)}
</div >
</div>
{isEditing && loggedInUserChannelId === reply?.snippet?.authorDisplayName ? (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            value={editedText}
            placeholder="Edit"
            onChange={(e) => setEditedText(e.target.value)}
          />
          <div className="mt-2">
            <button className="text-blue-600 mr-2" onClick={saveEditedComment}>
              Save
            </button>
            <button className="text-gray-600" onClick={cancelEditing}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
                  <p
                    className="text-base"
                    dangerouslySetInnerHTML={{
                      __html: makeTextClickable(DOMPurify.sanitize(reply.snippet.textDisplay)),
                    }}
                  ></p>
      )}


                  

                <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <Icon
              name="thumb_up"
              liked={liked}
              onClick={handleLike}
              fill={liked ? 1 : 0}
              weight={700}
              grade={0}
              opticalSize={48}
            />
            <span className="text-xs lg:text-sm">{formatViewCount(reply?.snippet?.likeCount)}</span>
            <Icon
              name="thumb_down"
              liked={disliked}
              onClick={handleDislike}
              fill={disliked ? 1 : 0}
              weight={700}
              grade={0}
              opticalSize={48}
            />
            
</div>
</div>
          </div>
          
        </div>
       
        
            ))}
          </div>
          
        )}
         
        {/* Reply Input */}
      
        {showReply && <div className="flex mt-4 gap-2 items-center">
        <img src={userInfo.youtube.channel.thumbnails.high} className="rounded-full h-[50px] w-[50px]"/>

          <textarea
            className="w-full p-4 border border-gray-500 rounded-lg bg-transparent "
            placeholder="Write a reply..."
            value={replyText}
             rows="1"
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            className="mt-2 px-7 py-3 bg-blue-500 text-white rounded-full"
            onClick={() => handlePostReply(comment?.snippet?.topLevelComment?.id)}
          >
            Reply
          </button>
        </div>}
    </div>
    </div>
  );
};

export default VideoComments;
