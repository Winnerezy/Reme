import { createContext, useContext, useEffect, useState } from "react"
import Cookies from 'js-cookie'
import IsLoading from "../miscellaneous/loadingpage"
import Feed from "./feed";
import { TokenContext } from "../miscellaneous/tokenContext";
export const SearchContext = createContext()
import { useNavigate } from 'react-router-dom'
export default function HomePage(){
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(true)
    const { setUser } = useContext(TokenContext)
    const navigate = useNavigate()


    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/sign-up');
        } else {
            localStorage.setItem('token', token);
            setLoggedIn(true);
        }
    }, [navigate]);


    const FetchHome = () => { useEffect( ()=> {
        async function home (){
            try {
                const options = {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                }
                const res = await fetch('http://localhost:5000/home', options)
                if(!res.ok){
                    throw new Error('error found')
                }
                const { userName } = await res.json()
                setLoggedIn(true)
                if(userName){
                    localStorage.setItem('userName', userName)
                    setUser(localStorage.getItem('userName'))
                }
            } catch (error) {
                console.error('Error is ', error);
            } finally {
                setLoading(false)
            }
       
        }
        home()
        return ()=>{
            console.log('Clean up successful')
        }
    }, [])
    }

if(loggedIn){
    FetchHome()
}

    if(loading){
        return <IsLoading/>
    }

    return(
        <main className="flex flex-col items-center justify-center relative mt-4 gap-y-16">
            <header className="flex flex-row sm:flex-col absolute right-2 gap-y-4 sm:gap-y-0 ">
            </header>
            <Feed/>
        </main>

    )
}