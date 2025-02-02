import { useState,useEffect,useRef} from 'react';
import { useAppContext } from '../../useContextHook/useContextApi';
import { useTheme } from '../../useContextHook/useTheme';
import Loader from '../../utilis/Loader';
import { CgClose } from "react-icons/cg";
import { SiYoutubestudio } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom';
import desktopLogo from "../../assets/yt_dekstop.png";
import { TbWorld } from "react-icons/tb";
import { FaKeyboard } from "react-icons/fa6";
import { IoIosSearch, IoMdMic, IoMdMicOff,IoIosAdd,IoIosLogOut, IoIosHelpCircle } from "react-icons/io";
import { IoLanguageOutline } from "react-icons/io5";
import { FaBell,FaGoogle } from "react-icons/fa";
import { RiAccountCircleLine } from "react-icons/ri";
import { FiMoon, FiSun } from "react-icons/fi";
import { MdSwitchAccount,MdOutlineManageAccounts,MdHelpCenter } from "react-icons/md";
import { LuCircleDollarSign,LuContact } from "react-icons/lu";
import mobileLogo from "../../assets/youtube_mobile.png";
import useSpeechRecognitions from '../../useContextHook/useSpeechRecoginition';
import { IoSettingsSharp } from "react-icons/io5";
import { Menu} from '@mui/icons-material'

const Header = () => {
  
  const [searchQuery, setQuerySearch] = useState();
  const { loading, mobileMenu, setMobileMenu } = useAppContext();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { listening, stopListening, browserSupportsSpeechRecognition, startListening } = useSpeechRecognitions(setQuerySearch);
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false); 

  const buttonRef = useRef(null); // Ref to the button with the profile image
  const [dropdownWidth] = useState("w-350"); // State to hold the dynamic width of the dropdown
  const REACT_BASE_URL = import.meta.env.REACT_BASE_URL;
  useEffect(() => {
    // Set the dropdown width dynamically based on the profile button width
    if (buttonRef.current) {
      const buttonPosition = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
  
      if (buttonPosition.top + buttonPosition.height + 300 > windowHeight) {
        // If dropdown would overflow, show it above the button
        setDropdownPosition('bottom-auto top-full');
      } else {
        // Otherwise, position it below
        setDropdownPosition('top-full');
      }
    }
    }, [dropdownVisible]); // Recalculate when dropdown becomes visible
  
    const [dropdownPosition, setDropdownPosition] = useState('top-full');


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token")
    if(token){
      localStorage.setItem("authToken",token);
      fetchUserDetails(token);
      navigate("/");
    }

    const storedUserInfo = localStorage.getItem("user-info");
    if (storedUserInfo) {
      setUser(JSON.parse(storedUserInfo));
    }
  }, [navigate]);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(`${REACT_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log("user Data",userData)
        localStorage.setItem("user-info", JSON.stringify(userData));
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };



  const handleGoogleLogin = () => {
    // Redirect to Google OAuth consent screen (no popup, full page)
    window.open(`${REACT_BASE_URL}/auth/google`);
  };

  
  const handleSignOut = () => {
    // Clear user data from localStorage and reset state
    localStorage.removeItem("authToken")
    localStorage.removeItem('user-info');
    setUser(null);
    navigate('/');
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  const handleSearchQuery = () => {
    if (searchQuery?.length > 0) {
      navigate(`search/${searchQuery}`);
    }
  };

  const handleClearSearchQuery = () => {
    setQuerySearch("");
  };

  const mobileToggleMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  
  function toggleDropdown() {
    setDropdownVisible(!dropdownVisible);
}



  return (
    <div className={`sticky top-0 z-10 flex flex-row items-center justify-between h-14 shadow-lg px-4 md:px-5 ${isDarkMode ? "bg-gray-900" : "bg-white"} text-${isDarkMode ? "white" : "bg-gray-700"}`}>
      {loading && <Loader />}
      <div className='flex items-center space-x-10'>
      <div className="md:block"onClick={mobileToggleMenu}>
          {mobileMenu ? (
            <Menu className="text-lg" />
          ) : (
            <Menu className="text-lg" />
          )}
        </div>
        
        <Link to="/" className='flex items-center h-14'>
          <img
            src={desktopLogo}
            alt="youtube_desktop_logo"
            className={`hidden md:block h-full object-contain ${isDarkMode ? "invert" : ""}`}
          />
          <img
            src={mobileLogo}
            alt='youtube_mobile_logo'
            className={`md:hidden h-14 object-contain ${isDarkMode ? "invert" : ""}`}
          />
        </Link>
      </div>
      <div className='flex items-center group relative'>
        <div className={`flex h-9 md:ml-10 md:pl-5 border border-gray-300 rounded-l-3xl group-focus-within:border-blue-500 md:group-focus-within:ml-5 md:group-focus-within:pl-0`}>
          <div className='w-10 items-center justify-center hidden group-focus-within:md:flex'>
            <IoIosSearch className='text-xl' />
          </div>
          <input
            type="text"
            placeholder="Search"
            className={`pl-5 pr-5 text-sm bg-transparent outline-none md:pl-0 w-32 sm:w-44 md:w-64 lg:w-[500px] ${isDarkMode ? "text-white" : "text-black"}`}
            onChange={(e) => setQuerySearch(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleSearchQuery();
            }}
            value={searchQuery}
          />
          {searchQuery && (
            <button className='absolute right-32 top-1/2 transform -translate-y-1/2' onClick={handleClearSearchQuery}>
              <CgClose className='text-xl' />
            </button>
          )}
        </div>
        <button className={`flex items-center justify-center w-[40px] md:w-[60px] h-9 rounded-r-3xl border border-l-0 ${isDarkMode ? "border-gray-700" : "border-gray-300"} bg-[#f8f8f8]`} onClick={handleSearchQuery}>
          <IoIosSearch className='text-xl' />
        </button>

        <button className={`flex items-center justify-center  m-2 w-[50px] md:w-[40px] h-8 md:h-10 rounded-3xl border bg-[#f8f8f8] ${isDarkMode ? "border-gray-700" : "border-gray-300"} hover:bg-${isDarkMode ? "gray-700" : "gray-300"}`}
          onClick={() => {
            if (listening) {
              stopListening();
            } else {
              startListening();
            }
          }}>
          {listening ? <IoMdMicOff className="text-lg" /> : <IoMdMic className='text-lg' />}
        </button>
      </div>

      <div className='flex items-center space-x-2 md:space-x-4'>
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-full border ${
            isDarkMode
              ? "bg-[#202020] border-[#303030] text-white hover:bg-[#383838]"
              : "bg-white border-gray-300 text-black hover:bg-gray-100"
          } font-medium shadow-sm transition-all duration-200`}>
          <IoIosAdd className="text-lg" />
          <span>Create</span>
        </button>

        <button className={`hidden md:flex items-center justify-center h-8 w-8 rounded-full hover:bg-${isDarkMode ? "gray-700" : "gray-300"}`}>
          <FaBell className="text-lg" />
        </button>

        <div className='flex space-x-0 md:space-x-2'>
          {user ? (
            // If user is logged in, show profile
            <button className="flex items-center space-x-2 px-13 py-3 rounded-full" ref={buttonRef}>
              <img src={user.youtube.channel.thumbnails.high} alt="Profile" className="h-7 w-7 rounded-full" onClick={toggleDropdown}  />
              
              {dropdownVisible && (
              <div id="dropdown" className={`absolute ${dropdownPosition} right-0 mt-2 w-[350px] bg-white rounded-lg shadow-lg py-3 ${dropdownWidth} z-50 transition-all duration-300 ease-in-out max-h-[calc(100vh-80px)] overflow-y-auto`}
              >
                  <div className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <img
                  src={user.youtube.channel.thumbnails.high}
                  alt="Channel"
                  className="h-10 w-10 rounded-full"
                />
                <div>
                   <span className="text-base font-semibold">{user.youtube.channel.title}</span>
               <div>
               <span className="text-base font-semibold">{user.youtube.channel.customUrl}</span>

               </div>
                  <div className="text-xs text-gray-500">
                      
                    <Link to={`/channel/${user.youtube.channel.id}`} className="hover:underline">
                      View Your Channel
                    </Link>
                </div>
                </div>
                </div>
                </div>
                <hr className="border-t border-gray-300 my-2" />
                
                <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaGoogle className='text-lg'/>
                <span className='text-base font-medium'>Google Account</span>
                </button>
                
                <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <MdSwitchAccount className='text-lg'/>
                <span className='text-base font-medium'>Switch Account</span>
                </button>
                 
                <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <IoIosLogOut  className="text-lg"/>
                  <span className='text-base font-medium'>Sign Out</span>
                  </button>
                  <hr className="border-t border-gray-300 my-2" />
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SiYoutubestudio  className="text-lg"/>
                  <span className='text-base font-medium'>Youtube Studio</span>
                  </button>

                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LuCircleDollarSign  className="text-lg"/>
                  <span className='text-base font-medium'>Purchase & Memberships</span>
                  </button>
                  <hr className="border-t border-gray-300 my-2" />
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <MdOutlineManageAccounts  className="text-lg"/>
                  <span className='text-base font-medium'>Your Data in YouTube</span>
                  </button>

                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiMoon  className="text-lg"/>
                  <span className='text-base font-medium'>Appearance:Device Theme</span>
                  </button>

                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <IoLanguageOutline  className="text-lg"/>
                  <span className='text-base font-medium'>Language:British English</span>
                  </button>

                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LuContact  className="text-lg"/>
                  <span className='text-base font-medium'>Restricted Mode:Off</span>
                  </button>

                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <TbWorld  className="text-lg"/>
                  <span className='text-base font-medium'>Location:Pakistan</span>
                  </button>

                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaKeyboard  className="text-lg"/>
                  <span className='text-base font-medium'>Keyboard Shortcuts</span>
                  </button>
                  
                  <hr className="border-t border-gray-300 my-2" />
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <IoSettingsSharp  className="text-lg"/>
                  <span className='text-base font-medium'>Settings</span>
                  </button>
                  <hr className="border-t border-gray-300 my-2" />
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <IoIosHelpCircle  className="text-lg"/>
                  <span className='text-base font-medium'>Help</span>
                  </button>

                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <MdHelpCenter   className="text-lg"/>
                  <span className='text-base font-medium'>Send Feedback</span>
                  </button>
                  


              </div> 
              )}
            </button>
          ) : (
            // If user is not logged in, show "Sign in" button
            <button
              onClick={handleGoogleLogin}
              className={`hidden md:flex items-center px-4 py-2 space-x-2 rounded-full border ${
                isDarkMode
                  ? "border-gray-600 text-white bg-transparent hover:bg-gray-700"
                  : "border-gray-300 text-gray-800 bg-white hover:bg-gray-100"
              } text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${isDarkMode ? "gray-600" : "blue-500"}`}>
              <RiAccountCircleLine className="text-lg" />
              <span>Sign in</span>
            </button>
          )}

          <button className={`hidden md:flex items-center justify-center h-10 w-10 rounded-full hover:bg-${isDarkMode ? "gray-700" : "gray-300"}`} onClick={toggleTheme}>
            {isDarkMode ? (
              <FiSun className="text-xl text-yellow-300" />
            ) : (
              <FiMoon className="text-xl text-gray-800" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
