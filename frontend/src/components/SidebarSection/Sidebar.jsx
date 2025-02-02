// Sidebar.jsx
import { useAppContext } from "../../useContextHook/useContextApi";
import { useTheme } from "../../useContextHook/useTheme";
import { categories1, categories2, categories3, menuItems } from "../../utilis/constant";
import MenuItem from "./MenuItem";
import { useNavigate } from "react-router-dom";
import {Home,Search,Notifications,AccountCircle,Settings,VideoLibrary,ChevronRight} from "@mui/icons-material"
const Sidebar = () => {
  const { mobileMenu, selectedCategory, setSelectedCategory } = useAppContext();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleCategoryClick = (id, name) => {
    setSelectedCategory(id);
    if (name === "Home") {
      navigate("/");
    }
  };

  return (
    <div
    className={`${
      mobileMenu ? "md:block" : "md:hidden"
    } md:block w-[280px] mt-2 absolute md:relative z-10 overflow-y-auto h-full py-4 ${
      isDarkMode ? "border-gray-700" : "border-gray-200"
    }`}
>
<div className="flex flex-col px-5 mb-20">
        {/* Mobile Collapse Sidebar - Just Icons */}
        <div className="md:hidden flex flex-col items-center">
          <div className="space-y-4">
            <button className="flex flex-col items-center">
              <Home className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <Search className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <Notifications className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <AccountCircle className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <Settings className="text-2xl" />
            </button>
            <button className="flex flex-col items-center">
              <VideoLibrary className="text-2xl" />
            </button>
          </div>
        </div>
        <div className="flex flex-col px-0 mb-20 text-black">
        {categories1.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedCategory}
            onClick={() => handleCategoryClick(item.id, item.name)}
          />
        ))}
        <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
        <div className="text-black font-bold flex items-center">
        <span>You</span><ChevronRight/>
        </div>
        {categories2.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedCategory}
            onClick={() => handleCategoryClick(item.id, item.name)}
          />
        ))}
         <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
        {categories3.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedCategory}
            onClick={() => handleCategoryClick(item.id, item.name)}
          />
        ))}
                 <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />

        {menuItems.map((item) => (
          <MenuItem key={item.name} item={item} isSelected={false} />
        ))}

        <hr
          className={`my-3 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
        <div className="flex items-center text-sm justify-center">Made By Abdul Wahab</div>
      </div>
    </div>
    </div>
    
  );
};

export default Sidebar;
