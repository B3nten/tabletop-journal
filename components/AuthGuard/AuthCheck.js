import { useSession } from "../../lib/authentication"
import Login from "../Login/Login"
import Loader from '../Loader/Loader'

export function AuthCheck(props) {
    const session = useSession()

    if(session && session.loading){
        return <Loader />
    }else if (session){
        return <>{props.children}</>
    }else{
        return <Login/>
    }
}
