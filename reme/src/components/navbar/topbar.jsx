import { useNavigate } from 'react-router-dom'
import { useCallback, useContext, useEffect, useState } from 'react';
import { TokenContext } from '../miscellaneous/tokenContext';
import IsLoading from '../miscellaneous/loadingpage';
import { ThemeContext } from '../miscellaneous/themecontext';
import Style from '../miscellaneous/styles';
export default function TopBar(){
const navigate = useNavigate()
const { user, setUser } = useContext(TokenContext)
const [isLoading, setIsLoading] = useState(true);
const [userData, setUserData] = useState({profilePicture: {data: ''}});
const { hrStyles } = Style()
const { theme, setTheme } = useContext(ThemeContext)
const handleProfile = () =>{
    navigate(`/profile/${user}`);
}

const FetchUserData = useCallback(async()=>{ //cache the user data if the same user remains logged in
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            }
            const res = await fetch(`https://reme-server-2o9o.onrender.com/profile/${user}`, options);
            if(!res.ok){
            throw new Error('Connot fetch user data');
        }
            const data = await res.json()
            setUserData(data)
        } catch (error) {
            console.error('Error is ', error)
        } finally {
            setIsLoading(false)
        }
    }, [user])

useEffect(()=>{
    FetchUserData()
}, [FetchUserData]);

const logout = async() =>{
    try {
        await fetch('https://reme-server-2o9o.onrender.com/logout', 
        {method: 'POST', credentials: 'include'})
        localStorage.clear()
        setUser('')
        navigate('/sign-up') 
    } catch (error) {
        console.error('Error: ', error)
    } finally {
        setIsLoading(false)
    }

    if(isLoading){
        return(
        <IsLoading/>
        )
    }
    
}

    return(
        <div className='flex flex-col mr-4 ml-4 mt-4'>
        <section className='flex items-center justify-between'>
        <h2 className="font-bold italic tracking-widest text-2xl">Reme</h2>
        <section className='flex gap-3 items-center justify-center'>
        <button className='drop-shadow-md' onClick={()=> setTheme(prev => !prev)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={theme ? 'black' : 'white'} style={hrStyles}><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/></svg>
        </button>
        <div>
        <img src={userData.profilePicture ? userData.profilePicture.data : "/public/avatar.png"} className="w-8 h-8 rounded-full shadow-sm" onClick={handleProfile}/>
    
        </div>
        <button className="flex items-center justify-center w-max p-2 h-6 text-xs hover:drop-shadow-lg" onClick={logout}>
        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill={theme ? 'black' : 'white'} style={hrStyles}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
        </button>
        </section>
        </section>
        

        <hr className='border-b-1 w-full my-4' style={hrStyles}/>
        </div>

    )
}