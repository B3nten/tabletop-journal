import { useEffect, useState, createContext, useContext } from "react"
import supabase from "./supabase"
import toast from "react-hot-toast"

const Context = createContext()

export function AuthContextProvider(props) {
    const [user, setUser] = useState({loading: true})
    const [session, setSession] = useState({loading: true})
    useEffect(() => {
        setUser(supabase.auth.user())
        setSession(supabase.auth.session())
        supabase.auth.onAuthStateChange(() => {
            setUser(supabase.auth.user())
            setSession(supabase.auth.session())
        })
    }, [])
    return <Context.Provider value={{user, session}}>{props.children}</Context.Provider>
}

export function useUser(){
    const context = useContext(Context)
    return context.user
}
export function useSession(){
    const context = useContext(Context)
    return context.session
}

export async function logOut(){
    await supabase.auth.signOut()
    toast.success('Logged out.')
}

