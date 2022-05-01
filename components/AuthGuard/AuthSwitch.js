import { useSession } from "../../lib/authentication"

export function AuthSwitch(props) {
    const session = useSession()
    return (
        <>
            {session ? session.loading ? '' : props?.authenticated ? props.authenticated : '' : props?.unauthenticated ? props.unauthenticated : ''}
        </>
    )
}