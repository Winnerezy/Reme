import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TokenContext } from '../miscellaneous/tokenContext'
import Style from '../miscellaneous/styles'
export default function HomePostCard({_id, title, photo, description, author, hearts}){
    const [heart, setHeart] = useState(hearts.length)
    const [click, setClick] = useState(false)
    const { user }  = useContext(TokenContext)
    const { hrStyles } = Style()
    useEffect(() =>{ 
        if(hearts.includes(user)){ //if user already liked post click state sets to true
            setClick(true)
        }
    }, [user, hearts])
    
    const handleHeart = useCallback(async() =>{
        const options = {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include'
        }
        const res = await fetch(`http://localhost:5000/heart/${_id}`, options)
        const {hearts} = await res.json()
        setHeart(hearts.length)
        setClick(true)
    }, [_id])

 const handleUnHeart = useCallback(async() =>{
    const options = {
        method: 'PUT',
        headers: {
             "Accept": "application/json",
             "Content-Type": "application/json"
        },
        credentials: 'include'
    }
    const res = await fetch(`http://localhost:5000/unheart/${_id}`, options)
    const { hearts } = await res.json()
    setHeart(hearts.length)
    setClick(false)
}, [_id])


const handleSave = async(photo, title, description, author, hearts) =>{
    const options = {
        method: 'POST',
        headers: {
             "Accept": "application/json",
             "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
            author: author,
            title: title,
            photo: photo,
            description: description,
            hearts: hearts
        })
    }
    const res = await fetch('http://localhost:5000/savepost', options);
    const ans = await res.json()
    console.log(ans)
}
    
    return(
        <main>
            <article className="relative w-80 max-h-96 sm:w-98 sm:max-h-100 rounded-md border-2 shadow-md flex flex-col items-center p-4" style={hrStyles}>
                
                <section className='flex items-center justify-center w-80 h-80 border-black'>
                <img src={photo.data} alt={title} className="w-60 h-60 sm:w-80 sm:h-80 object-contain" />
                </section>
                <section className='w-full flex flex-row items-center relative'>
                <section className='w-full flex flex-col items-start justify-center'>
                <div className='flex items-center justify-center'>
                {click ? <button className='w-12 h-12 bg-transparent' onClick={handleUnHeart}><img src="/public/heart.svg" className='w-8 h-8 fill-current text-black' /></button> : <button className='w-12 h-12 bg-transparent' onClick={handleHeart}><img src="/public/heart.svg" className='w-8 h-8 fill-current text-black' /></button>}
                </div>
                
                <p>{heart} {heart === 1 ? "heart" : "hearts" }</p>
                </section>
                <div>
                <button onClick={() => handleSave(photo, title, description, author, hearts)}><img src="/public/bookmark.svg" className='w-8 h-8 absolute right-2'/></button>
                </div>
                </section>

                <div className='w-full flex flex-col'>
                <section className='flex gap-x-4 items-center justify-start text-sm'>
                <Link to={`/profile/${author}`} className=' hover:text-gray-900'>@{author}</Link>
                <p className="font-medium">{title}</p>
                </section>
                <p className='font-light tracking-wide text-[10px] sm:text-sm'>{description}</p>
                </div>



            </article>
        </main>
    )
}