import { useCallback, useContext, useState } from 'react'
import{ Link } from 'react-router-dom'
import { TokenContext } from '../miscellaneous/tokenContext'
import Style from '../miscellaneous/styles'
export default function ProfileCard({profilePicture, userName}){
    const { hrStyles, buttonStyles, textStyles } = Style()
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
        <article className="flex items-center justify-start gap-x-4 border rounded-md w-60 h-14 sm:w-100 p-x-2 relative" style={ hrStyles }>
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
                            <button className="w-14 h-7 text-[10px] bg-slate-200 hover:bg-slate-100 rounded-md text-center relative -top-3 p-2" onClick={handleRemoveFriend} style={buttonStyles}><span style={textStyles}>Unfollow</span></button>
                        :
                            <button className="w-14 h-7 text-[10px] bg-slate-200 hover:bg-slate-100 rounded-md text-center relative -top-3 p-2" onClick={handleAddFriend} style={buttonStyles}><span style={textStyles}>Follow</span></button>}
                        </div>
                    )
                    }
                </div>
        </article>
    )
}