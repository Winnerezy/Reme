import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
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

useEffect(()=>{
    async function topBar(){
            try {
                const options = {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                }
                const res = await fetch(`http://localhost:5000/profile/${user}`, options);
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
        }
    topBar()
}, [user])
    const logout = async() =>{
        try {
            await fetch('http://localhost:5000/logout', 
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
        <img src="/public/logout.svg" className="w-4"/>
        </button>
        </section>
        </section>
        

        <hr className='border-b-1 w-full my-4' style={hrStyles}/>
        </div>

    )
}