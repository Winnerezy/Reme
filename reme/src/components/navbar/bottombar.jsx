import Style from "../miscellaneous/styles.js";
import sideBar from "./sidebar.js"
import { Link } from "react-router-dom"

const handleClick = (bar, index) => {
    console.log(`Clicked at index ${index}:`, bar);
}

export default function BottomBar(){
    const { styles } = Style()
    const bars =  sideBar.map((bar, index) => {
        
        return(
        <div  key={index} onClick={() => handleClick(bar, index)}>
        <Link to={bar.link} className=" flex flex-col gap-y-2 items-center hover:bg-slate-200 w-24 p-2 rounded-md">
            <img src={bar.icon} alt={bar.label} className="w-6 h-6"/>
            <p className="text-xs font-semibold tracking-wide">{bar.label}</p>
        </Link>
        </div>

        ) 
    })
    return(
        <div className="sm:hidden w-full flex gap-x-1 items-center justify-center bg-slate-50" style={ styles }>
            {bars}
        </div>
    )
}