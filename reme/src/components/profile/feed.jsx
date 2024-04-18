import { useEffect, useState } from "react"
import ProfilePostCard from "../posts/profilepostcard"
import IsLoading from "../miscellaneous/loadingpage"
import { useParams } from 'react-router-dom'
import Style from "../miscellaneous/styles"
export default function Feed(){
const [posts, setPosts] = useState([])
const [isLoading, setIsLoading] = useState(true)
const { userName } = useParams()

const { hrStyles } = Style()
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
            const res = await fetch(`http://localhost:5000/${userName}/posts`, options)
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
            <hr className='border-b-1w-full mt-8' style={hrStyles}/>
            <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 mt-8 items-center justify-center">
                {posts.length > 0 ? posts.map((post, index) => (<ProfilePostCard key={index} {...post}/>)) : <div>No Posts</div>}
            </section>
        </main>
    )
}