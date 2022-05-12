import Link from "next/link"
import { logOut, useSession } from "../../lib/authentication"
import { AuthSwitch } from '../AuthGuard'
import { useClientRouter } from "../../lib/hooks"

export default function Navigation(props) {
    const session = useSession()
    const router = useClientRouter()

    function back(){
        const index = router.asPath.lastIndexOf('/')
        const newURL = router.asPath.substring(0, index)
        newURL === '' ? router.push('/') : router.push(newURL)
    }

    return (
        <>
            <nav className='relative px-1 py-1 flex justify-between'>
                <button onClick={() => back()} className={`flex items-center text-xl md:text-2xl xl:text-3xl font-handwriting ${props.backButtonHidden && 'opacity-0'}`}>
                    &#60; Back
                </button>
                <div className='flex space-x-2 md:space-x-6'>
                    {props.children}
                    <button><img className='w-6 h-6 xl:w-7 xl:h-7 opacity-30 pointer-events-none' src='/search.svg' alt='' /></button>
                    <Link href='/'>
                        <button><img className='w-6 h-6 xl:w-7 xl:h-7' src='/home.svg' alt='' /></button>
                    </Link>
                    <AuthSwitch>
                        <button onClick={() => logOut()}><img className='w-6 h-6 xl:w-7 xl:h-7' src='/logout.svg' alt='' /></button>
                    </AuthSwitch>
                </div>
            </nav>
            <div className='relative inset-0 flex font-fancy text-center text-4xl sm:text-5xl md:text-6xl pointer-events-none mt-6 mb-20'>
                <div className='flex items-center justify-center w-full'>
                    {(session || !props.loggedOut) && props.title ? props.title : ''}
                    {!session && props.loggedOut ? props.loggedOut : ''}
                </div>
            </div>
        </>

    )

}
