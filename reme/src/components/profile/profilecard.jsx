import { useLocation } from 'react-router-dom'
import { useCallback, useContext, useState } from 'react'
import{ Link } from 'react-router-dom'
import { TokenContext } from '../miscellaneous/tokenContext'
export default function ProfileCard(){
    const userNames  = useLocation().state.followers
    userNames.map((userName)=> userName)
    const profilePicture = null
    const [follow, setFollow] = useState(false) //intial follow state is false by default
    const { user } = useContext(TokenContext)
    const handleAddFriend = useCallback(async() =>{
        try {
            const options = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({})
            }
            const res = await fetch(`http://localhost:5000/${userName}/follow`, options);
            if(!res.ok){
               throw new Error('Error found')
            }
            setFollow(true);
        } catch (error) {
            console.error('Error is', error)
        }

    }, [userName])

    const handleRemoveFriend = useCallback( async() =>{
        try {
            const options = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({})
            }
            const res = await fetch(`http://localhost:5000/${userName}/unfollow`, options);
            if(!res.ok){
               throw new Error('Error found')
            }
            setFollow(false)
        } catch (error) {
            console.error('Error is', error)
        }

    }, [userName])
    return(
        <article className="flex items-center justify-start gap-x-4 border-black border rounded-md w-60 h-14 sm:w-100 p-x-2 relative">
            <section className="flex">
                <img src={profilePicture ? profilePicture.data : 'public/avatar.png'} alt={userName} className="w-12 h-12 rounded-full ml-4" />
            </section>
            <Link to={`/profile/${userName}`} className="flex">
                <p className="text-sm hover:text-gray-400">{userName}</p>
            </Link>
            <div>
                    {userName === user ? 
                    (<div></div>) 
                    :
                    (
                        <div className=' absolute right-4'>
                            {follow ? 
                            <button className="w-14 h-7 text-[10px] bg-slate-200 hover:bg-slate-100 rounded-md text-center relative -top-3 p-2" onClick={handleRemoveFriend}>UnFollow</button>
                        :
                            <button className="w-14 h-7 text-[10px] bg-slate-200 hover:bg-slate-100 rounded-md text-center relative -top-3 p-2" onClick={handleAddFriend}>Follow</button>}
                        </div>
                    )
                    }
                </div>
        </article>
    )
}