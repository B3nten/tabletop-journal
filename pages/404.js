import {Navigation} from "../components/Navigation"
import Link from "next/link"

export default function notFound(){

    return (
        <div>
            <Navigation title='404 Page Not Found' />
            <Link href='/'><button className='btn-underline'>return home</button></Link>
            <img alt="A dragon and archers fighting unseen foes." className='w-full' src='/404.png'/>
        </div>
    )
}