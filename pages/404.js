import {Navigation} from "../components/Navigation"

export default function notFound(){

    return (
        <div>
            <Navigation title='Page Not Found' />
            <img className='w-full' src='/404.png'/>
        </div>
    )
}