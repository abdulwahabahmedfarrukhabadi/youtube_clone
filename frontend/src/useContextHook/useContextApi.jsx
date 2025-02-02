/* eslint-disable react/prop-types */
import { useContext, createContext, useEffect, useState } from "react";
import { fetchApiFromYoutubeData } from "../utilis/fetchApi";

export const Context = createContext();

export const AppContext = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("0"); // Default to "0" (All categories)
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Category ID mapping for YouTube API
  const categoryIds = {
    "All": "0",                // All categories
    "Trending": "0",           // Trending
    "Music": "10",             // Music
    "Gaming": "17",            // Gaming
    "Tech": "28",              // Tech
    "Lifestyle": "24",         // Lifestyle
    "News": "25",              // News
    "Sports": "17",            // Sports
    "Comedy": "23",            // Comedy
    "Education": "27",         // Education
    "Movies": "1",             // Movies
    "TV Shows": "2",           // TV Shows
    "Fashion": "26",           // Fashion
    "Food": "28",              // Food
    "Travel": "19",            // Travel
    "Health": "26",            // Health
    "Fitness": "29",           // Fitness
    "Art": "15",               // Art
    "Photography": "27",      // Photography
    "Science": "28",          // Science
    "History": "21",           // History
    "DIY": "22",               // DIY
    "Animals": "23",           // Animals
    "Nature": "24",            // Nature
    "Politics": "25",          // Politics
    "Business": "26",          // Business
  };

  // Function to fetch YouTube data
  const fetchYoutubeData = async (params) => {
    setLoading(true);
    try {
      // Log the request parameters for debugging
      console.log("Request Params:", params);
      
      // Make the API request
      const res = await fetchApiFromYoutubeData('videos', params);
      
      // Check if the response is valid and contains items
      if (res && res.items) {
        setVideoData(res.items); // Set the video data if items exist
        console.log("Fetched Items:", res.items); // Log the fetched items for debugging
      } else {
        console.warn("No items found in response:", res); // Log if no items are found
        setVideoData([]); // Clear previous video data if no items are found
      }
    } catch (error) {
      console.error("Error in fetching Youtube Data:", error); // Log the error
      setVideoData([]); // Clear previous video data on error
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Fetch YouTube data whenever the selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      const categoryId = categoryIds[selectedCategory] || "0"; // Get the category ID from the map
      
      fetchYoutubeData({
        part: "snippet,contentDetails,statistics",
        regionCode: "IN",
        maxResults: 20,
        chart: "mostPopular",
        videoCategoryId: categoryId, // Use the mapped category ID
      });
    }
  }, [selectedCategory]); // Re-fetch whenever the selected category changes

  return (
    <Context.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        setMobileMenu,
        mobileMenu,
        videoData,
        loading,
        setLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => {
  return useContext(Context);
};
