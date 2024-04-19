import sideBar from "./sidebar.js"
import { Link } from "react-router-dom"
export default function LeftBar(){

    const bars =  sideBar.map((bar, index) => {

        
        return(
        <Link to={bar.link} key={index} className="hidden ml-4 mt-8 sm:flex gap-2 items-center hover:bg-slate-200 w-fit p-2 rounded-md">
            {<img src={bar.icon} alt={bar.label} className="w-6 h-6"/>}
            <p className="text-sm font-semibold tracking-wide">{bar.label}</p>
        </Link>
        ) 
    })
    return(
        <div className="w-48 h-full grid grid-cols-1 gap-y-16 items-center justify-center ">
            {bars}
        </div>
    )
}