import { useContext } from "react";
import Feed from "./feed";
import { TokenContext } from "../miscellaneous/tokenContext";

export default function SavedPosts(){
const { user } = useContext(TokenContext)
    return (
        <div className="flex flex-col items-center justify-center">
            <p className="text-3xl first-letter:uppercase font-semibold">{user}&apos;s Saved Posts</p>
            <Feed/>
        </div>
    )
}