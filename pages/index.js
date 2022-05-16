import { Navigation } from '../components/Navigation'
import Link from 'next/link'
import { AuthSwitch } from '../components/AuthGuard'
import { useSession } from '../lib/authentication'

export default function Home() {
    const session = useSession()

    return (
        <>
            <header className='relative'>
                <img className='' src='/hero.png'></img>
                <div className='sm:absolute bottom-0 left-0 md:bottom-20 md:left-20 p-4 sm:-rotate-3'>
                    <div className='hidden sm:block absolute inset-0 bg-white wavy parchment'></div>
                    <h1 className='relative text-5xl sm:text-7xl md:text-8xl font-fancy'>Notescroll</h1>
                    <div className='relative md:text-xl font-handwriting mb-5'>The app for tabletop gamers.</div>
                </div>
            </header>

            <nav className='mt-6'>

                {!session && !session?.loaded && <Link href='/start'><a className='btn-underline'>Login | Register</a></Link>}
                {session && !session.loaded && <Link href='/start'><a className='btn-underline'>View Campaigns</a></Link>}
            </nav>

            <section className='mt-20 space-y-5'>
                <h2 className='text-4xl font-handwriting'>Welcome to Notescroll</h2>
                <p className='text-lg font-handwriting max-w-xl'>
                    Notescroll is a notetaking app for tabletop gamers to keep track of all the lore, characters, locations and more within a campaign. It{"'"}s designed to be simple and minimal so players can focus on their gameplay, while giving players campaign and session-specific features to enhance their experence.
                    <br /><br />
                    Notescroll is in early alpha. While the app is useable and (mostly) bug free, things will change a lot as new features are added and current features are improved.
                </p>
                <h2 className='text-4xl font-handwriting'>How to use</h2>
                <p className='text-lg font-handwriting max-w-xl'>
                    The first step is to <Link href='/start'><a className='underline underline-offset-2'>create an account.</a></Link>
                    <br /><br />
                    Next, create a campaign. This will be the container for all your notes, sessions etc.
                    <br /><br />
                    You can create different types of documents, such as <em>characters, locations, items, events, lore</em> and more. You can create documents from the categories page, or from inside of a session.
                    <br /><br />
                    Sessions are the main interface for notetaking in Notescroll. You can add existing documents to a session{"'"}s timeline (or create a new document), and record what happened. 
                </p>
            </section>
        </>
    )
}