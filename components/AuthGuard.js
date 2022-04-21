import { useSession } from "../lib/authentication"
import Login from "./Login/Login"
import Loader from './Loader/Loader'

export function AuthCheck(props) {
    const session = useSession()
    return (
        <>
            {session ? session.loading ? <Loader/> : props.children : <Login />}
        </>
    )
}

export function AuthSwitch(props) {
    const session = useSession()
    return (
        <>
            {session ? session.loading ? '' : props?.authenticated ? props.authenticated : '' : props?.unauthenticated ? props.unauthenticated : ''}
        </>
    )
}