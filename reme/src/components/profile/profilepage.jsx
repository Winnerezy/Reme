import { useCallback, useContext, useEffect, useState } from "react"
import {  useParams, useNavigate, Link } from "react-router-dom"
import { TokenContext } from "../miscellaneous/tokenContext";
import IsLoading from "../miscellaneous/loadingpage";
import Feed from "./feed";
import { ThemeContext } from "../miscellaneous/themecontext";
import Style from "../miscellaneous/styles";
export default function Profile(){
    const { buttonStyles, textStyles } = Style()
    const { theme } = useContext(ThemeContext)
    const { userName } = useParams();
    const [userData, setUserData] = useState({});
    const [follow, setFollow] = useState(false) //intial follow state is false by default
    const navigate = useNavigate()
    const { user } = useContext(TokenContext);
    const [isLoading, setIsLoading] = useState(true);
    const [followerCount, setFollowerCount] = useState(0)
    useEffect(()=>{
        async function fetchUser(){
            try {
                const options = {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
                const res = await fetch(`http://localhost:5000/profile/${userName}`, options);
                if(!res.ok){
                    throw new Error('Connot fetch user data');
                    
            }
                const {firstName, lastName, followers, following, profilePicture, bio} = await res.json()
                
                setUserData({firstName: firstName, lastName: lastName, followers: followers, following: following, profilePicture: profilePicture, bio: bio})
                if(followers.includes(user)){
                    setFollow(true)
                }
                setFollowerCount(followers.length)
            } catch (error) {
                console.error('Error is', error);
            } finally {
                setIsLoading(false)
            }

            
        }
        fetchUser()
    },[userName, user])

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
            setFollow(true)
            const { followers } = await res.json()
            setFollowerCount(followers.length)
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
            const { followers } = await res.json() //getting the followers array of the user
            setFollow(false)
            setFollowerCount(followers.length)
        } catch (error) {
            console.error('Error is', error);
        }

    }, [userName])

    if(isLoading){
        return <IsLoading/>
    }
    


    return(
        <main className="relative">
            <section className="flex justify-between">
            </section>
           
            <div className="sm:flex gap-x-4 mt-4 items-center ml-4">
                <div className="flex gap-y-4 sm:items-center sm:justify-center flex-col sm:flex-row sm:gap-x-4 ml-4">
                <section className="flex gap-x-4">
                <img src={userData.profilePicture ? userData.profilePicture.data : "/public/avatar.png"} className="md:w-24 sm:h-24 w-16 h-16 rounded-full"/>
                <section className="flex flex-col gap-y-2 justify-center items-start">
                <h4 className=" tracking-wide sm:text-2xl text-md text-center font-semibold ">{userData.firstName} {userData.lastName}</h4>
                <p className="sm:text-base text-xs font-light hover:text-gray-400">@{userName}</p>
                </section>
                </section>
                <div>
                    {userName === user ? 
                    (<button className="p-2 w-24 h-8 rounded-md text-sm shadow-sm font-medium" onClick={()=> navigate(`/${user}/edit`)} style={buttonStyles}><span style={textStyles}>Edit Profile</span></button>) 
                    :
                    (
                        <div>
                            {follow ? 
                            <button className="p-2 w-18 h-8 rounded-md text-sm font-semibold shadow-sm" onClick={handleRemoveFriend} style={buttonStyles}><span style={textStyles}>Unfollow</span></button>
                        :
                            <button className="p-2 w-18 h-8 rounded-md text-sm font-semibold shadow-sm" onClick={handleAddFriend} style={buttonStyles}><span style={textStyles}>Follow</span></button>}
                        </div>
                    )
                    }
                </div>
                

                
                <section className="flex gap-x-4">

                <span className="font-semibold text-xl"><Link to={`/profile/${userName}/followers`} state= {{...userData}}>{followerCount}</Link> Followers</span>
                <span className="font-semibold text-xl">{userData.following.length} Following</span>
                </section>
               
                </div>

                
            </div>
            <p className="ml-8 mt-4 font-normal tracking-wide max-w-80 max-h-4 ">{userData.bio}</p>
            <Feed/>
        </main>
        
    )
}