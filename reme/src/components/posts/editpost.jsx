
import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
export default function EditPosts(){
    const navigate = useNavigate()
    const { state } = useLocation() // getting the post data as props from the post card 
    const [title, setTitle] = useState(state.title)
    const [description, setDescription] = useState(state.description)
    const [photo, setPhoto] = useState()
    const titleRef = useRef()
    const descriptionRef = useRef()

    const handleTitle = () =>{
        setTitle(titleRef.current.value)
    }

    const handleDescription = () =>{
        setDescription(descriptionRef.current.value)
    }

    const handlePhoto= (e) =>{
        setPhoto(e.target.files[0])
    }

    const handlePost = async() =>{
        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('description', description)
            formData.append('photo', photo)
            const options = {
                method: 'PUT',
                headers: {
                'Accept': 'application/json',
                },
                credentials: 'include',
                body: formData
            }
            const res = await fetch(`https://reme-server-2o9o.onrender.com/editpost/${state._id}`, options)
            if(!res.ok){
                throw new Error('Error found')
            }
            const ans = await res.json()
            console.log(ans)
            navigate(`/profile/${state.author}`)
        } catch (error) {
            console.error('Error: ', error)
        }

        
    }

    return(
        <main className="mr-4 ml-4">
            <section className="lg:h-100 w-full h-100 shadow-md border rounded-md flex flex-col gap-y-8 items-center justify-center">
                <div className="flex gap-4 items-start justify-center">
                    <label htmlFor="title" className="font-semibold">Title</label>
                    <input type="text" name="title" ref={titleRef} value={title} placeholder="place your scene..." className="ml-11 border-2 w-60 sm:w-100 h-8 rounded-md outline-none" onChange={handleTitle}/>
                </div>
                <div className="flex gap-4 items-start justify-center">
                    <label htmlFor="description" className="font-semibold">Description</label>
                    <input type="text" name="description" ref={descriptionRef} value={description} placeholder="describe the event!" className="border-2 w-60 sm:w-100 h-8 rounded-md outline-none" onChange={handleDescription}/>
                </div>
                <input type="file" name="file" accept="image/**" onChange={handlePhoto}/>
                <button onClick={handlePost} className="bg-slate-200 w-24 p-2 rounded-md shadow-md hover:bg-slate-100">Edit</button>
            </section>
        </main>
    )
}