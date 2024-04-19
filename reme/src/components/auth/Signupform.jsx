import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import IsLoading from '../miscellaneous/loadingpage';

export default function SignUpForm(){
    const [emailValue, setEmailValue] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const emailRef = useRef()
    const navigate = useNavigate()
    
    const handleEmail = (event) =>{
        event.preventDefault()
        setEmailValue(emailRef.current.value)
    }

    const [passwordValue, setPasswordValue] = useState('')
    const passwordRef = useRef()
    
    const handlePassword = (event) =>{
        event.preventDefault()
        setPasswordValue(passwordRef.current.value)
    }

    const [firstNameValue, setFirstNameValue] = useState('');
    const [lastNameValue, setLastNameValue] = useState('');
    const [userName, setUserName] = useState('');
    const [bioValue, setBioValue] = useState('');
    const [age, setAge] = useState('');
    const firstNameRef = useRef()
    const userNameRef = useRef()
    const lastNameRef = useRef()
    const ageRef = useRef()
    const bioRef = useRef()

    const handleFirstName = (event) =>{
        event.preventDefault()
        setFirstNameValue(firstNameRef.current.value)
    }

    const handleLastName = (event) =>{
        event.preventDefault()
        setLastNameValue(lastNameRef.current.value)
    }

    const handleUserName = (event) =>{
        event.preventDefault()
        setUserName(userNameRef.current.value)
    }

    const handleBio = (event) =>{
        event.preventDefault()
        setBioValue(bioRef.current.value)
    }
    const handleAge = (event) =>{
        event.preventDefault()
        setAge(ageRef.current.value)
    }

    const handleSignUp = async() => {
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: firstNameValue,
                    lastName: lastNameValue,
                    age: age,
                    userName: userName,
                    email: emailValue,
                    password: passwordValue,
                    bio: bioValue
                })
            }

            try {
                const res = await fetch('http://localhost:5000/sign-up', options);
                if(res.ok){
                    setIsLoading(false)
                    navigate('/sign-in')
                }
                
                
            } catch (error) {
                console.error('Error', error)
            }

            if(isLoading){
                return(
                <IsLoading/>
                )
            }
 }
    return(
        <main className="flex items-center justify-center relative top-20 mr-4 ml-4">
        <form className='flex flex-col w-[1000px] flex-shrink md:h-[500px] h-[650px] border-2 shadow-lg rounded-md items-center jusitfy-start text-center gap-y-8 p-8 md:gap-y-16'>
        <h2 className='font-bold underline mt-8 text-3xl'>SIGN UP</h2>
        <section className='flex w-full sm:flex-row flex-col gap-y-8'>
        <div className='flex flex-row items-center justify-center gap-x-4 w-full px-4'>
        <label htmlFor="firstname" className="sm:w-20 text-sm font-medium">First Name:</label>
        <input type="text" name="firstname" className='w-24 flex-1 h-6 outline-none rounded-md border-gray-950 border-2' placeholder='  John' ref={firstNameRef} value={firstNameValue} onChange={handleFirstName}/>
        </div>
        <div className='flex flex-row items-center justify-center gap-x-2 w-full px-4'>
        <label htmlFor="lastname" className="w-20 flex flex-row text-sm font-medium">Last Name:</label>
        <input type="text" name="lastname" className='w-24 flex-1 h-6 outline-none rounded-md border-gray-950 border-2' placeholder='  Doe' ref={lastNameRef} value={lastNameValue} onChange={handleLastName}/>
        </div>
        <div className='flex flex-row items-center justify-start gap-x-2 w-1/2 px-4'>
        <label htmlFor="age" className="text-sm text-light font-medium">Age:</label>
        <input type="text" name="age" className='w-8 flex-grow h-6 outline-none rounded-md border-gray-950 border-2' placeholder='  16' ref={ageRef} value={age} onChange={handleAge}/>
        </div>
        </section>
        {/* Second Section */}
        <section className='flex w-full items-start justify-center md:flex-row flex-col gap-y-8'>
        <div className='flex flex-row items-center justify-start gap-x-2 md:w-1/2 px-4'>
        <label htmlFor="username" className="w-20 text-sm font-medium">Username:</label>
        <input type="text" name="username" className='w-24 flex-1 h-6 outline-none rounded-md border-gray-950 border-2' placeholder='  johnny' ref={userNameRef} value={userName} onChange={handleUserName}/>
        </div>
        <div className='flex flex-row items-center justify-center gap-x-2 w-full px-4'>
        <label htmlFor="bio" className="w-8 flex flex-row text-sm font-medium">Bio:</label>
        <input type="text" name="bio" className='w-24 flex-1 h-6 outline-none rounded-md border-gray-950 border-2' placeholder='  Hey I am Joh Doe' ref={bioRef} value={bioValue} onChange={handleBio}/>
        </div>
        <div className='flex flex-row items-center justify-start gap-x-2 w-1/2 px-4'>
        <label htmlFor="email" className="text-sm text-light font-medium">Email:</label>
        <input type="text" name="email" className='w-48 flex-grow h-6 outline-none rounded-md border-gray-950 border-2' placeholder='  johndoe@gmail.com' ref={emailRef} value={emailValue} onChange={handleEmail}/>
        </div>
        <div className='flex flex-row items-center justify-start gap-x-2 w-1/2 px-4'>
        <label htmlFor="password" className="text-sm text-light font-medium">Password:</label>
        <input type="text" name="password" className='w-24 flex-grow h-6 outline-none rounded-md border-gray-950 border-2' placeholder='  1234' ref={passwordRef} value={passwordValue} onChange={handlePassword}/>
        </div>
        </section>
        <button className='w-24 bg-slate-200 hover:bg-slate-100 h-10 font-medium rounded-md absolute bottom-16' onClick={()=>handleSignUp}>SIGN UP</button>
        <p className='absolute bottom-8'>Have an account ? <Link to={'/sign-in'} className='font-medium text-blue-200 hover:text-blue-100 hover:underline'>click here</Link></p>
        </form>
        </main>
    )
}