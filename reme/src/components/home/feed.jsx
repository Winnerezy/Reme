import { useEffect, useState } from "react"
import HomePostCard from "../posts/homepostcard"
import IsLoading from "../miscellaneous/loadingpage"

export default function Feed(){
const [posts, setPosts] = useState([])
const [isLoading, setIsLoading] = useState(true)


    useEffect(()=>{
        async function FetchFeed(){
            try {
                const options = {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            const res = await fetch('http://localhost:5000/feed', options)
            if(!res.ok){
                throw new Error('error found')
            }
            const ans = await res.json()
            setPosts(ans)
            } catch (error) {
                console.error('Error: ', error)
            } finally {
                setIsLoading(false)
            }

        }
        FetchFeed()
    }, [])

    if(isLoading){
        return <IsLoading/>
    }
    return(
        <main>
            <section className="grid grid-col-1 gap-y-8">
                {posts.length > 0 ? posts.map((post, index) => (<HomePostCard key={index} {...post}/>)) : <div>No Posts</div>}
            </section>
        </main>
    )
}