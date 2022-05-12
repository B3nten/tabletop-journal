import { useSession } from "../../lib/authentication"

export function AuthSwitch(props) {
    const session = useSession()
    if (session && !session.loading) return <>{props.children}</>
    else return null
}