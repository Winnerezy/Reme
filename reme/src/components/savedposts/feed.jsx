import { useEffect, useState } from "react"
import SavedPostCard from "./savedpostcard"
import IsLoading from "../miscellaneous/loadingpage"
import Style from "../miscellaneous/styles"
export default function Feed(){
const [posts, setPosts] = useState([])
const [isLoading, setIsLoading] = useState(true)
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
            const res = await fetch(`http://localhost:5000/savedposts`, options)
            if(!res.ok){
                throw new Error('error found')
            }
            const ans = await res.json()
            setPosts(ans.data)
            } catch (error) {
                console.error('Error: ', error)
            } finally {
                setIsLoading(false)
            }

        }
        FetchFeed()
    }, [])


    console.log(posts)
    if(isLoading){
        return <IsLoading/>
    }
    return(
        <main className="flex flex-col items-center justify-center px-4 w-full">
            <hr className='border-b-1 w-full mt-8' style={hrStyles}/>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-60 gap-y-8 mt-8 items-center justify-evenly">
                {posts.length > 0 ? posts.map((post, index) => (<SavedPostCard key={index} {...post.saved}/>)) : <div>No Posts</div>}
            </section>
        </main>
    )
}