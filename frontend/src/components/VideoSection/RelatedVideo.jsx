/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from "react"
import { useAppContext } from "../../useContextHook/useContextApi";
import { fetchApiFromYoutubeData } from "../../utilis/fetchApi";
import { useTheme } from "../../useContextHook/useTheme";
import { Link } from "react-router-dom";
import { formatViewCount,formatDuration,formatPublishTime } from "../../utilis/helper";
const RelatedVideos = ({categoryId}) => {
  const [relatedVideos,setRelatedVideos] = useState();
  const {isDarkMode} = useTheme();
  const {setLoading,} = useAppContext();

  const fetchRelatedVideos = async () => {
    setLoading(true)
     try {
       const data = await fetchApiFromYoutubeData("videos",{
        part:"snippet,contentDetails,statistics",
        regionCode:"PK",
        chart:"mostPopular",
        videoCategoryId:categoryId,
        maxResults:100
       })
       setRelatedVideos(data?.items)
       console.log(data)
     } catch (error) {
      console.error("Error in fetching Related Videos",error)
     }finally{
      setLoading(false)
     }
  }

useEffect(()=>{
   fetchRelatedVideos()
},[categoryId])

  return (
    <div>
      {relatedVideos?.map((video)=>(
          // eslint-disable-next-line react/jsx-key
          <Link to={`/video/${video.snippet.categoryId}/${video.id}`}>
          <div className = "flex flex-col xl:flex-row mb-8">
            <div className="relative h-[200px] lg:h-[140px] w-[400px] min-w-[230px] lg:w-60 md:rounded-xl overflow-hidden">
              <img
              src={video?.snippet?.thumbnails?.medium?.url}
              alt={video.snippet.title}
              className="w-full h-full object-cover rounded-md mb-2"
              />
              <span className="absolute bottom-4 right-0 bg-gray-800 text-white text-xs p-1 m-1 rounded">
                {formatDuration(video?.contentDetails?.duration)}
                </span>
              </div>
             
    
              <div className={`flex flex-col ml-0 md:ml-4 md:mt-0 overflow-hidden`}>
                <h3 className="text-md font-semibold">{video?.snippet?.title}</h3>
                <div className={`text-base ${isDarkMode ? "text-gray-400":"text-gray-600"}`}>
                 {video?.snippet?.channelTitle}
                </div>
                <div className={`text-sm ${isDarkMode ? "text-gray-400":"text-gray-600"}`}>
                  {formatViewCount(video?.statistics?.viewCount)} views .{formatPublishTime(video?.snippet?.publishedAt)}
    
                </div>
              </div>
              </div>
              </Link>
      ))}
     
    </div>
  )
}

export default RelatedVideos
