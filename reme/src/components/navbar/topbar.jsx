import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import { TokenContext } from '../miscellaneous/tokenContext';
import IsLoading from '../miscellaneous/loadingpage';
import { ThemeContext } from '../miscellaneous/themecontext';
import Style from '../miscellaneous/styles';
export default function TopBar(){
const navigate = useNavigate()
const { user } = useContext(TokenContext)
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
   

    console.log(theme)

    return(
        <div className='flex flex-col mr-4 ml-4 mt-4'>
        <section className='flex items-center justify-between'>
        <h2 className="font-bold italic tracking-widest text-2xl">Reme</h2>
        <section className='flex gap-3 items-center justify-center'>
        <button className='w-8 h-8 rounded-full bg-slate-200 shadow-md' onClick={()=> setTheme(prev => !prev)}></button>
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