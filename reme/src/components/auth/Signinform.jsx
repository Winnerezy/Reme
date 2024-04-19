import { createContext, useRef, useState } from 'react'
import {Link, Outlet, useNavigate} from 'react-router-dom'
export const UserContext = createContext()
export default function SignInForm(){
    const navigate = useNavigate()
    const [nameValue, setNameValue] = useState('')
    const nameRef = useRef()
    
    const handleName = (event) =>{
        event.preventDefault()
        setNameValue(nameRef.current.value)
    }

    const [passwordValue, setPasswordValue] = useState('')
    const passwordRef = useRef()
    
    const handlePassword = (event) =>{
        event.preventDefault()
        setPasswordValue(passwordRef.current.value)
    }

    const handleSignIn = async() => {

            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    userName: nameValue,
                    password: passwordValue
                })
            }

            try {
                const res = await fetch('http://localhost:5000/sign-in', options);
                if(!res.ok){
                    throw new Error('Error found')
                }
                    navigate('/home')
                
            } catch (error) {
                console.error('Error:', error)
            }
            
    }

    return(
        <main className='flex items-center justify-center relative top-20'>
        <form className='bg-none w-max sm:w-100 h-98 backdrop-blur-sm border-2 shadow-lg rounded-xl flex flex-col items-center jusitfy-center text-center gap-y-12 mr-4 ml-4'>
        <h2 className='mt-24 font-bold tracking-wider underline'>Sign In</h2>

        <section className='flex flex-col gap-y-16 items-center justify-center mr-4 ml-4'>
        <section className='flex gap-x-4'>
        <label htmlFor="email" className='mr-4' >Username:</label>
        <input type="email" name='email' className='shadow-lg h-6 w-60 outline-none'  ref={nameRef} value={nameValue} onChange={handleName}/>
        </section>
        <section className='flex gap-x-4'>
        <label htmlFor="password" >Password:</label>
        <input type="password" name='password' className='shadow-lg h-6 w-60 outline-none' ref={passwordRef} value={passwordValue} onChange={handlePassword}/>
        </section>
        <button type='button' className='bg-slate-200 w-24 h-10 p-2 text-center rounded-xl transition-colors duration-200 ease-in-out shadow-sm font-semibold hover:bg-slate-100 hover:scale-105' onClick={handleSignIn}>Log In</button>
        </section>
        <p>Don&apos;t have an account ? <Link to='/sign-up' className='text-blue-200 transition-colors duration-50 ease-in-out hover:text-blue-300 hover:underline'>Click here</Link></p>
        <Outlet/>
        </form>
        </main>
       
    )
}