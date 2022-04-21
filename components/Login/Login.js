import { useUser, useSession } from '../../lib/authentication'
import { useState, useRef, useEffect } from 'react'
import supabase from '../../lib/supabase'
import styles from './Login.module.css'
import toast from 'react-hot-toast'

export default function Login() {
    const user = useUser()
    const session = useSession()
    const [action, setAction] = useState('signin')

    return (
        <div className='w-full h-full flex flex-col justify-center items-center mt-10 lg:mt-0'>

            {action === 'signin' ? <SignInForm /> : <SignUpForm />}

            <div className='flex justify-between space-x-24 lg:space-x-40 mt-10 font-fancy text-lg'>
                <button
                    onClick={() => setAction(action === 'signin' ? 'register' : 'signin')}
                    className='btn-underline'>
                    {action === 'signin' ? 'Register' : 'Sign In'}
                </button>
                <button
                    onClick={() => alert('sucks to suck LOL')}
                    className='btn-underline'>
                    forgot password
                </button>
            </div>
        </div>
    )
}

function SignInForm() {
    const email = useRef(null)
    const password = useRef(null)

    async function logIn(e) {
        e.preventDefault()
        try {
            const { error } = await supabase.auth.signIn({
                email: email.current.value,
                password: password.current.value,
            })
            if (error) throw error
            toast.success('Logged in.')
        } catch (error) {
            toast.error(error.error_description || error.message || 'Login failed.')
        }
    }
    return (
        <>
            <h2 className='text-3xl font-fancy mb-10'>Sign into existing account</h2>
            <form className='flex flex-col items-center justify-start space-y-10'>
                <input ref={email} name='email' placeholder='email' className='md:w-72'></input>
                <input ref={password} name='password' type='password' placeholder='password' className='md:w-72'></input>
                <button className='btn-primary' onClick={logIn}>Log In</button>
            </form>
        </>
    )
}

function SignUpForm() {
    const name = useRef(null)
    const email = useRef(null)
    const password = useRef(null)

    async function signUp(e) {
        e.preventDefault()
        if (name.current.value === '') {
            toast.error('Please provide a username.')
        } else {
            try {
                const { error } = await supabase.auth.signUp(
                    {
                        email: email.current.value,
                        password: password.current.value,
                    },
                    {
                        data: {
                            user_name: name.current.value,
                        }
                    })
                if (error) throw error
                toast.success('Account created.')
            } catch (error) {
                toast.error(error.error_description || error.message || 'Registration failed.')
                console.log(error)
            }
        }
    }
    return (
        <>
            <h2 className='text-3xl font-fancy mb-10'>Create an account</h2>
            <form className='flex flex-col items-center justify-start space-y-10'>
                <input ref={name} name='name' placeholder='name' className='md:w-72'></input>
                <input ref={email} name='email' placeholder='email' className='md:w-72'></input>
                <input ref={password} name='password' type='password' placeholder='password' className='md:w-72'></input>
                <button className='btn-primary' onClick={signUp}>Register</button>
            </form>
        </>
    )
}
