import { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TokenContext } from '../miscellaneous/tokenContext'
import { ThemeContext } from '../miscellaneous/themecontext'
import Style from '../miscellaneous/styles'
export default function ProfilePostCard({_id, title, photo, author, description, hearts}){
    const [heart, setHeart] = useState(hearts.length)
    const { user } = useContext(TokenContext)
    const { userName } = useParams()
    const [click, setClick] = useState(false)
    const { theme } = useContext(ThemeContext)
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
        const res = await fetch(`https://reme-server-2o9o.onrender.com/heart/${_id}`, options)
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
    const res = await fetch(`https://reme-server-2o9o.onrender.com/unheart/${_id}`, options)
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
                <div className='flex items-center justify-center'>
                {click ? <button className='w-12 h-12 bg-transparent' onClick={handleUnHeart}>
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" fill='red'><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>
                </button> : <button className='w-12 h-12 bg-transparent' onClick={handleHeart}>
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" fill='gray'><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                </button>}
                </div>
                }
                <p>{heart} {heart === 1 ? "heart" : "hearts" }</p>
                </section>
                
                <div className='w-full flex flex-col'>
                <section className='flex gap-x-4 items-center justify-start text-sm relative'>
                <p className="font-medium">{title}</p>
                {user === userName && <Link to={`/editpost/${_id}`} state={{_id, title, photo, author, description, hearts}}>
                <svg xmlns="http://www.w3.org/2000/svg"
                height="24" viewBox="0 -960 960 960" width="24" fill={theme ? 'black' : 'white'} style={hrStyles}>
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                </svg>
                </Link>}
                </section>
                <p className='font-light tracking-wide max-w-60 max-h-24 overflow-y-hidden line-clamp-1'>{description}</p>
                </div>
            </article>
        </main>
    )
}