import { useContext } from "react"
import { TokenContext } from "../miscellaneous/tokenContext"
import { useNavigate } from "react-router-dom"

export default function LoggedInToggle(){
const { user } = useContext(TokenContext)
const navigate = useNavigate()
const handleProfile = () =>{
    navigate(`/profile/${user}`);
}
return(
<div>
(<img src="src/assets/photo_2023-06-21_21-00-28.jpg" className="w-8 rounded-full shadow-sm" onClick={handleProfile}/>
</div>
)
}