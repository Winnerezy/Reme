import { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TokenContext } from '../miscellaneous/tokenContext'
import { ThemeContext } from '../miscellaneous/themecontext'
export default function ProfilePostCard({_id, title, photo, author, description, hearts}){
    const [heart, setHeart] = useState(hearts.length)
    const { user } = useContext(TokenContext)
    const { userName } = useParams()
    const [click, setClick] = useState(false)
    const { theme } = useContext(ThemeContext)
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

    return(
        <main>
            <article className="relative w-80 max-h-96 sm:w-80 sm:max-h-100 rounded-md border-2 shadow-md flex flex-col items-center gap-y-2 p-4 transition-colors duration-500 hover:scale-105" style={{borderColor: theme ? 'black' : 'white'}}>
                <section className='relative flex flex-col-reverse items-center justify-between border-1 w-60 h-60 border-black'>
                <img src={photo.data} alt={title} className="max-w-60 max-h-60 sm:max-w-60 sm:max-h-60 absolute top-2" />
                </section>
                
                <section className='w-full flex flex-col items-start justify-center'>
                {user !== userName &&
                <div>
                {click ? <button className='w-12 h-12 bg-transparent' onClick={handleUnHeart}><img src="/public/heart.svg" className='w-8 h-8 fill-current text-black' /></button> : <button className='w-12 h-12 bg-transparent' onClick={handleHeart}><img src="/public/heart.svg" className='w-8 h-8 fill-current text-black' /></button>}
                </div>
                }
                <p>{heart} {heart === 1 ? "heart" : "hearts" }</p>
                </section>
                
                <div className='w-full flex flex-col'>
                <section className='flex gap-x-4 items-center justify-start text-sm relative'>
                <p className="font-medium">{title}</p>
                {user === userName && <Link to={`/editpost/${_id}`} state={{_id, title, photo, author, description, hearts}}><img src="/public/edit.svg" alt="edit" className='w-4 h-4 absolute right-2'/></Link>}
                </section>
                <p className='font-light tracking-wide max-w-60 max-h-24 overflow-y-hidden line-clamp-1'>{description}</p>
                </div>
            </article>
        </main>
    )
}