import { useRef, useState, useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { TokenContext } from "../miscellaneous/tokenContext";
import { ThemeContext } from '../miscellaneous/themecontext';
import { io } from "socket.io-client"
export default function Message() {
    const [message, setMessage] = useState("")
    const messageRef = useRef()
    const [chats, setChats] = useState([])
    const { user } = useContext(TokenContext)
    const { userName } = useParams()
    //const [disabled, setDisabled] = useState(true)
    const [socket, setSocket] = useState(null)
    const [online, setOnline] = useState(false)
    const { theme } = useContext(ThemeContext)
    useEffect(()=> {
      const socket = io("http://localhost:5000", 
        {
          query: {
            user: user
          }
        }
      )
      setSocket(socket)

      return ()=> console.log("Closed") && socket && socket.close() 
    }, [user])

    useEffect(()=> {
      socket?.on("connection", (socket)=> {
      console.log("user connected", socket.id)
      })
    }, [socket])

    const handleMessage = () =>{
        setMessage(messageRef.current.value)
    }

    useEffect(()=> {
      socket?.on("private message", (msg)=> {
        console.log(msg)
        // if(!chats.includes(msg)) {
        setChats(prevChat => {
          const newChats = [...prevChat, msg]
          return newChats
        })
        // }
        console.log(chats)
        
      })

      return ()=> {
        socket?.off("private message")
      }
    }, [socket, chats])

    useEffect(()=> {
      socket?.on("status", (status)=> {
        setOnline(status)
      })
    })

    const senderMessage = {
      sender: user,
      receiver: userName,
      message: message
    }

    const handleSend = () => {
      socket?.emit("private message", senderMessage)
        setMessage("")
    }


  return (
    <div className="flex flex-col gap-y-8 items-center justify-center w-full relative">
    <h2 className={`text-2xl font-semibold tracking-wide absolute top-0 left-4 ${online ? "text-black" : "text-red-500"}`}>{`${ userName } is ${online ? "Online" : "Offline"}`}</h2>
    <section className="flex flex-col h-[65vh] gap-y-8 items-center justify-center">
    <ul className='w-[100vw] sm:w-[80vw] mt-8 flex flex-col h-100 overflow-y-auto overflow-x-hidden p-4 gap-y-2'>
    {chats.filter(chat => chat.message).map((chat, index) => (
    <li className={`text-md font-bold h-max ${chat.sender ? "self-start" : "self-end"} shadow-md  border-2 border-black bg-gray-900 text-white rounded-md px-2 sm:max-w-60 max-w-36 flex flex-col m-0`} key={index}>
    <p className='text-start'>{ chat.message }</p> 
    <p className={`text-[10px] font-light ${chat.sender ? "text-start" : "text-end"}`}>{ chat.time }</p>
    </li>))}
    </ul>
    </section>
    <div className='flex flex-row items-center justify-center gap-x-8 flex-1 mt-16 px-4'>
    <input type="text" ref={messageRef} value={message} className="w-[50vw] flex-1 min-h-8 border-black border-2 outline-none rounded-md" onChange={handleMessage} onKeyPress={handleMessage}/>
    <button onClick={handleSend} className={`${theme ? "bg-black text-white" : "bg-white text-black"} duration-500 lg:w-24 w-16 h-8 transition-all sm:text-[18px] text-xs font-semi-bold text-center rounded-md hover:bg-gray-800`}>Send</button>
    </div>
    </div>
  )
}
