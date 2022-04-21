import Link from "next/link"
import { logOut } from "../../lib/authentication"
import { AuthSwitch } from '../AuthGuard'
import router from 'next/router'

export default function Navigation(props) {

    return (
        <>
            <nav className='relative px-1 py-1 flex justify-between'>
                {/* <Link href={props.link || '/'}>
                    <button className={`flex items-center text-xl md:text-2xl xl:text-3xl font-handwriting ${props.backButtonHidden && 'opacity-0'}`}>
                        &#60; Back
                    </button>
                </Link> */}
                <button onClick={()=>router.back()} className={`flex items-center text-xl md:text-2xl xl:text-3xl font-handwriting ${props.backButtonHidden && 'opacity-0'}`}>
                    &#60; Back
                </button>
                <div className='flex space-x-6'>
                    {props.children}
                    <Link href='/'>
                        <button><img className='w-6 h-6 xl:w-7 xl:h-7' src='/search.svg' /></button>
                    </Link>
                    <Link href='/'>
                        <button><img className='w-6 h-6 xl:w-7 xl:h-7' src='/home.svg' /></button>
                    </Link>
                    <AuthSwitch authenticated={<button onClick={() => logOut()}><img className='w-6 h-6 xl:w-7 xl:h-7' src='/logout.svg' /></button>} />
                </div>
            </nav>
            <div className='relative inset-0 flex font-fancy text-4xl sm:text-5xl md:text-6xl pointer-events-none mt-6 mb-20'>
                <div className='flex items-center justify-center w-full'>
                    {props.title ? props.title : ''}
                </div>
            </div>
        </>

    )

}
