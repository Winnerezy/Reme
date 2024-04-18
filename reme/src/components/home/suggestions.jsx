export default function Suggestion(props){

    return(
        <main>
            <div className="w-36 h-36 sm:w-60 sm:h-60 bg-blue-200 rounded-md relative shadow-lg">
                <img src="src/assets/photo_2023-06-21_21-00-28.jpg" className=" w-16 sm:w-24 rounded-md absolute top-4 left-4" />
                <p className="absolute bottom-12 left-4 font-semibold">{props.title}</p>
            </div>
        </main>
    )
}