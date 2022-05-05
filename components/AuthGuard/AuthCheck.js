import { useSession } from "../../lib/authentication"
import Login from "../Login/Login"
import { useMounted } from "../../lib/hooks"

export function AuthCheck(props) {
    const session = useSession()
    const mounted = useMounted

    if(session && session.loading){
        return null
    }else if (session){
        return <>{props.children}</>
    }else{
        return <Login/>
    }
}
