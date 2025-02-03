import { useState } from "react";
import { useTheme } from "../../useContextHook/useTheme";
import { useAppContext } from "../../useContextHook/useContextApi";
import Sidebar from "../../components/SidebarSection/Sidebar";
import VideoList from "../../components/VideoSection/Videolist";
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const Feed = () => {
  const { loading, videoData, selectedCategory, setSelectedCategory } = useAppContext();
  const { isDarkMode } = useTheme();
  
  // Categories to be displayed at the top of the feed
  const categories = ["All", "Trending", "Music", "Gaming", "Tech", "Lifestyle", "News", "Sports", "Comedy", 
    "Education", "Movies", "TV Shows", "Fashion", "Food", "Travel", "Health", "Fitness", "Art", 
    "Photography", "Science", "History", "DIY", "Animals", "Nature", "Politics", "Business",];
  
  const [scrollPos, setScrollPos] = useState(0);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="flex flex-col mb-8 animate-pulse gap-10">
      <div className="relative w-full h-60 bg-gray-300 rounded-md"></div>
      <div className="md:ml-4 md:w-2/3">
        <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded mb-2"></div>
        <div className="w-1/3 h-4 bg-gray-300 rounded mb-2"></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded mt-2"></div>
      </div>
    </div>
  );

  const handleCategoryClick = (category) => {
    // Update the category based on the selected button
    const categoryId = category === "All" ? "0" : category;
    console.log("Selected Category ID:", categoryId);
    setSelectedCategory(categoryId);
  };

  const handleScroll = (direction) => {
    const categoriesContainer = document.getElementById("categoriesContainer");
    const scrollAmount = direction === "forward" ? 200 : -200;
    const newScrollPos = scrollPos + scrollAmount;
    setScrollPos(newScrollPos);
    categoriesContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className={`flex flex-row h-screen overflow-hidden ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"}`}>
      
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="w-full grow overflow-y-auto hide-scrollbar">
        
        {/* Categories Section */}
        <div className="flex space-x-5 p-4 overflow-x-auto border-b border-gray-300">
          <button 
            onClick={() => handleScroll("backward")}
            className="text-xl p-2 rounded-full hover:bg-gray-200 transition-all">
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" /> 
          </button>
          <div id="categoriesContainer" className="flex space-x-5 overflow-x-auto hide-scrollbar flex-grow">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-1 rounded-lg ${selectedCategory === category ? "bg-black font-semibold text-white" : "bg-gray-200 text-black font-semibold"} flex-shrink-0`}
              >
                {category}
              </button>
            ))}
          </div>
          <button 
            onClick={() => handleScroll("forward")}
            className="text-xl p-2 rounded-full hover:bg-gray-200 transition-all">
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        {/* Video Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
          {/* Show skeleton loaders if data is still loading */}
          {loading
            ? [...Array(8)].map((_, index) => <SkeletonLoader key={index} />)  // Show 8 skeletons
            : videoData.length > 0 ? (
                videoData.map((item) => (
                  <React.Fragment key={item?.id}>
                    <VideoList video={item} />
                  </React.Fragment>
                ))
              ) : (
                <div className="col-span-full text-center text-lg text-gray-500">
                  No videos available in this category.
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
};

export default Feed;
