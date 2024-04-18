import BottomBar from "./components/navbar/bottombar"
import LeftBar from "./components/navbar/leftbar"
import TopBar from "./components/navbar/topbar"
import { Outlet } from 'react-router-dom'
import Style from './components/miscellaneous/styles.js'
export default function App(){
  const { styles } = Style()
  return(

    <main className="relative flex justify-between flex-col h-screen" style={styles} >
      <section className="flex flex-col h-full">
      <TopBar/>
      <div className="flex overflow-y-auto flex-1">
      <div className="absolute left-0">
      <LeftBar/>
      </div>
      <div className="sm:ml-48 flex-grow">
      <Outlet/>
      <footer className="mt-24"></footer>
      </div>
      </div>
      </section>
      <section className="fixed bottom-0 w-full bg-white">
      <BottomBar/>
      </section>
    </main>
  )
}
