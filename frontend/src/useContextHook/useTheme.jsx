import { useContext,createContext,useState } from "react";

const ThemeContext = createContext();
export const useTheme = () =>useContext(ThemeContext)

export const ThemeProvider= ({children}) =>{
       const [isDarkMode,setisDarkMode] = useState();
       const toggleTheme = () =>{
        setisDarkMode(prevMode=>!prevMode);
       }
       return(
        <ThemeContext.Provider
        value={{toggleTheme,isDarkMode}}
        >
        {children}
        </ThemeContext.Provider>
       )

}