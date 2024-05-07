import { useEffect, useRef, useState } from "react";
import ProfileCard from "./profilecard";

export default function SearchPage(){
    const [searchValue, setSearchValue] = useState('')
    const [userSearch, setUserSearch] = useState([])
    const searchRef = useRef()
    if(searchRef.current){
        searchRef.current.focus()
    }else {
        console.log("Search not focused")
    }
    const handleSearch = () =>{
        setSearchValue(searchRef.current.value)
    }

    useEffect(()=> {
        const FectchUser = async() =>{
            try {
                if(searchValue === ''){
                    return;
                }
                const res = await fetch(`https://reme-server-2o9o.onrender.com/users/${searchValue}`);
                if(!res.ok){
                    throw new Error('Error found')
                }
                const ans = await res.json();
                setUserSearch(ans)
        
            } catch (error) {
                console.error('Error:', error)
            } 
            
        }
        FectchUser()
    }, [searchValue])

    return (
        <main className="flex flex-col gap-y-8">
        <header className="flex items-center justify-center gap-x-4">
        <input type="text" className="w-80 sm:w-100 h-8 rounded-md outline-none shadow-lg border-black border text-black" placeholder="  search here..." ref={searchRef} value={searchValue} onChange={handleSearch}/>
       
        </header>
        <section className="flex flex-col gap-y-8 items-center justify-center">
            {userSearch.map((user, index) => <ProfileCard key={index} {...user}/> )}
        </section>
        </main>
    )
}