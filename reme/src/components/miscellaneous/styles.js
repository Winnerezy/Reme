import { useContext } from "react"
import { ThemeContext } from "./themecontext"
function Style(){
const { theme } = useContext(ThemeContext) // importing the theme context
const styles = { // general theme styles 
    backgroundColor: theme ? 'white' : 'black',
    color: theme ? 'black' : 'white',
    transition: 'ease-in-out',
    transitionDuration: '0.5s'
}

const buttonStyles = {
    backgroundColor: theme ? 'black' : 'white',
    transition: 'ease-in-out', 
    transitionDuration: '0.5s'

}

const hrStyles = {
    borderColor: theme ? 'black' : 'white',
    transition: 'ease-in-out',
    transitionDuration: '0.5s'
}

const textStyles = {
    color: theme ? 'white' : 'black',
    transition: 'ease-in-out',
    transitionDuration: '0.5s'
}

return {styles: styles, buttonStyles: buttonStyles, hrStyles: hrStyles, textStyles: textStyles}
}

export default Style