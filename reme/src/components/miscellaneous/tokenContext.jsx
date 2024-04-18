import { createContext, useState } from "react";

export const TokenContext = createContext()

export const TokenProvider = ({ children }) =>{
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(localStorage.getItem('userName'));
     return(
        <TokenContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </TokenContext.Provider>
     )
}