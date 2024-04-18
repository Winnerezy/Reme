import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import IsLoading from "../miscellaneous/loadingpage"
export default function EditProfile(){
    const navigate = useNavigate()
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const bioRef = useRef(null)
    const [userData, setUserData] = useState({firstName: '', lastName: '', bio: ''});
    const { userName } = useParams()
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

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
                const data = await res.json()
                setUserData(data)
            } catch (error) {
                console.error('Error is', error);
            } finally {
                setLoading(false)
            }

            
        }
        fetchUser()
    },[userName])

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [bio, setBio] = useState('')

    useEffect(()=>{
        setFirstName(userData.firstName)
        setLastName(userData.lastName)
        setBio(userData.bio)
    }, [userData])
    async function saveEdit(){
            try {
                const formData= new FormData()
                formData.append('firstName', firstName)
                formData.append('lastName', lastName)
                formData.append('bio', bio)
                formData.append('profilePicture', profile)
                const options = {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: formData,
                    credentials: 'include',
                }
                const res = await fetch(`http://localhost:5000/${userName}/edit`, options)
                if(!res.ok) throw new Error ('Error found')
            
                navigate(`/profile/${userName}`)    //navigate back to profile when saved
            } catch (error) {
                console.error(error)
            }

    }

    const handleFirstName = () =>{
        setFirstName(firstNameRef.current.value)
    }

    const handleLastName = () =>{
        setLastName(lastNameRef.current.value)
    }

    const handleBio = () =>{
        setBio(bioRef.current.value)
    }

    const handlePicture = (e) =>{
        setProfile(e.target.files[0])
        
    }


    if (loading) {
        return <IsLoading/>
    }
    return(
        <main className="flex items-center justify-center mt-24" style={{ display : open ? 'flex' : 'none' }}>
            <div className="w-100 h-100 border bg-slate-200 rounded-md shadow-md flex flex-col gap-y-8 mr-8 ml-8 items-center justify-center">
            <section>
                <label htmlFor="firstname">First Name: </label>
                <input type="text" className="outline-none rounded-md"  ref={firstNameRef} value={firstName} onChange={handleFirstName}/>
            </section>

            <section>
                <label htmlFor="lastname">Last Name: </label>
                <input type="text" className="outline-none rounded-md" ref={lastNameRef} value={lastName} onChange={handleLastName}/>
            </section>

            <section className="flex gap-x-4">
            <p>Bio: </p>
            <input ref={bioRef} onChange={handleBio} value={bio} className="w-60 h-12 outline-none rounded-sm"/>
            </section>

            <input type="file" accept="image/**" onChange={handlePicture} name="profilePicture" aria-label="Profile Picture" className="w-max bg-white rounded-md"/>
        
        <button className="rounded-md bg-white w-24 p-2 h-8 text-sm shadow-sm hover:bg-slate-200" onClick={saveEdit}>Save</button>
        </div>
       
        </main>

    )
}