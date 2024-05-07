import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TokenContext } from '../miscellaneous/tokenContext'
import Style from '../miscellaneous/styles'
import { ThemeContext } from '../miscellaneous/themecontext'
export default function HomePostCard({_id, title, photo, description, author, hearts}){
    const [heart, setHeart] = useState(hearts.length)
    const [click, setClick] = useState(false)
    const [click2, setClick2] = useState(false)
    const { user }  = useContext(TokenContext)
    const { hrStyles } = Style()
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

const handleSave = async() =>{
    const options = {
        method: 'POST',
        headers: {
             "Accept": "application/json",
             "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
            _id: _id
        })
    }
    await fetch('https://reme-server-2o9o.onrender.com/savepost', options);
}

const handleUnSave = async() =>{
    const options = {
        method: 'POST',
        headers: {
             "Accept": "application/json",
             "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
            _id: _id
        })
    }
    await fetch('https://reme-server-2o9o.onrender.com/unsavepost', options);
    setClick2(false)
}
    
    return(
        <main>
            <article className="relative w-80 h-96 rounded-md border-2 shadow-md flex flex-col items-center p-4" style={hrStyles}>
                
                <section className='flex items-center justify-center w-80 h-80 border-black relative -top-6'>
                <img src={photo.data} alt={title} className="w-60 h-60 object-contain" />
                </section>
                <section className='w-full flex flex-row items-center relative -top-10'>
                <section className='w-full flex flex-col items-start justify-center'>
                <div className='flex items-center justify-center'>
                {click ? <button className='w-12 h-12 bg-transparent' onClick={handleUnHeart}>
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" fill='red'><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>
                </button> : <button className='w-12 h-12 bg-transparent' onClick={handleHeart}>
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" fill='gray'><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                </button>}
                </div>
                
                <p>{heart} {heart === 1 ? "heart" : "hearts" }</p>
                </section>
                <div>
                {click2 ? 
                 <button onClick={() => handleUnSave(_id)}>
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="36" style={hrStyles} fill={theme ? 'black' : 'white'}><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/></svg>
                 </button>
                 :
                 <button onClick={() => handleSave(_id)}>
                 <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" style={hrStyles} fill={theme ? 'black' : 'white'}><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>
                 </button>
                }
               
                </div>
                </section>

                <div className='w-full flex flex-col relative -top-10'>
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