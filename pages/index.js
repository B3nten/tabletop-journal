import { useUser, logOut } from '../lib/authentication'
import { AuthCheck } from '../components/AuthGuard'
import Link from 'next/link'
import {Navigation} from '../components/Navigation'


export default function Home() {
  const user = useUser()
  return (
    <>
      <Navigation title='NotescroLL' backButtonHidden/>
      <AuthCheck>
        <div className="flex flex-col items-center space-y-16">
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-fancy text-center'>Hello {user?.user_metadata?.user_name || 'user!'}</h1>
          <div className="flex flex-col space-y-4">
            <Link href={'/campaigns'}>
              <button className='btn-primary'>View Campaigns</button>
            </Link>
            <button className='btn-primary opacity-50 cursor-default hover:drop-shadow-none'>User Profile</button>
            <button className='btn-primary mb-10' onClick={logOut}>Log Out</button>
          </div>
        </div>
      </AuthCheck>
    </>
  )
}
