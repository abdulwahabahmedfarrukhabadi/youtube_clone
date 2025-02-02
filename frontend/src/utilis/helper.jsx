import {formatDistanceToNow} from "date-fns";
export const formatViewCount = (count) =>{
    if(count >= 1000000){
        return (count/ 1000000).toFixed(1) + "M";
    }else if(count >= 1000){
        return (count/1000).toFixed(1) + "K";
    }else{
        return count?.toString();
    }
};

export const formatPublishTime = (publishTime) => {
    return formatDistanceToNow(new Date(publishTime),{addSuffix:true});
};

// Convert duration from ISO 8601 format (e.g., PT4M30S) to HH:MM:SS format
export const formatDuration = (duration) => {
  if (!duration || typeof duration !== "string") {
    return "00:00"; // Default to 00:00 if invalid
  }

  // Check if duration is in ISO 8601 format (e.g., "PT4M30S")
  if (duration.startsWith("PT")) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!match) {
      return "00:00"; // Fallback if format doesn't match
    }

    // Parse hours, minutes, and seconds (default to 0 if undefined)
    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    // Format as HH:MM:SS or MM:SS
    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v)) // Add leading zero if needed
      .filter((v, i) => v !== "00" || i > 0) // Remove leading "00" if hours are missing
      .join(":");
  } else {
    // Assume plain numeric format (e.g., "243" seconds)
    const totalSeconds = parseInt(duration, 10);

    if (isNaN(totalSeconds)) {
      return "00:00"; // Fallback for invalid numeric input
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format as HH:MM:SS or MM:SS
    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v)) // Add leading zero if needed
      .filter((v, i) => v !== "00" || i > 0) // Remove leading "00" if hours are missing
      .join(":");
  }
};

// Format the view count
export const formatDuration2 = (duration) => {
  if (!duration) return 0;

  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const match = duration.match(regex);

  if (!match) return 0;

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  // Return total seconds
  return hours * 3600 + minutes * 60 + seconds;
};
