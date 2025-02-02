/* eslint-disable react/prop-types */
import {useTheme} from '../../useContextHook/useTheme';
import { Link } from 'react-router-dom';
const MenuItem = ({item,isSelected,onClick}) => {
  
  const {isDarkMode} = useTheme();
  return (
    <Link to={item.link}>
    <div onClick={item.type === "category"? onClick : undefined}
    className ={`px-4 py-3 flex items-center space-x-3  rounded-md cursor-pointer${isDarkMode ? "text-gray-300 hover:bg-gray-700":"hover:bg-gray-100 text-gray-500"} ${isSelected ? (isDarkMode ?"bg-gray-700":"bg-gray-100"):""}`}>
      
      <span className={`text-lg ${isDarkMode ? "text-gray-300":"text-black"}`}>
        {item.icon}
        </span>

        <span className={`font-medium font-base ${isDarkMode ? "text-gray-300":"text-black"}`}>
        {item.name}
        </span>
        
    </div>
    </Link>
  )
}

export default MenuItem
