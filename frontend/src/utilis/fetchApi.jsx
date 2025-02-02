import axios from "axios";
const BASE_URL="https://www.googleapis.com/youtube/v3";
const API_KEY = import.meta.env.VITE_API_KEY;
console.log("API",API_KEY);

export const fetchApiFromYoutubeData= async(endpoints,params={})=>{
    try {
        const response = await axios.get(`${BASE_URL}/${endpoints}`,{
            params:{
                ...params,
                key:API_KEY,
            }
        })
        
        if (response.data && response.data.items) {
            return response.data; // Entire response, including `items`
          }
          
    } catch (error) {
        console.error("Error in fetching Youtube Data",error)
    }
}