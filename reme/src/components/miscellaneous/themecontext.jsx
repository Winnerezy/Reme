import { createContext, useState } from "react";
export const ThemeContext = createContext()
export const ThemeProvider = ({children}) =>{ //passing the children prop as a parameter 
    const [theme, setTheme] = useState(true);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}
