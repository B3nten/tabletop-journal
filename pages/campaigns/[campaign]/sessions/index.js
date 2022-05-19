import { AuthCheck } from '../../../../components/AuthGuard'
import Loader from '../../../../components/Loader/Loader'
import { useClientRouter } from '../../../../lib/hooks'
import { useGameSessionList } from '../../../../lib/database'
import Navigation from '../../../../components/Navigation/Navigation'


export default function SessionsPage() {
    return (
        <div>
            <AuthCheck>
                <DocumentList />
            </AuthCheck>
        </div>
    )
}

function DocumentList() {
    const router = useClientRouter()
    const sessions = useGameSessionList(router.query.campaign)

    return (<>
        <Navigation title='Sessions'/>
        <div className=''>
            <div>
                {sessions.loaded ? sessions.data?.length > 0 ?
                    sessions.data.map((session) =>
                        <DocumentListItem
                            key={session.id}
                            session={session}
                        >
                        </DocumentListItem>)
                    : <div className='font-handwriting opacity-80 pl-1'>no items</div>
                    : <Loader />
                }
            </div>
        </div>
    </>)
}

function DocumentListItem(props) {
    const router = useClientRouter()
    return (
        <div onClick={() => router.push(`/campaigns/${router.query.campaign}/sessions/${props.session.id}`)} className='flex flex-col items-start mt-8 space-y-1 cursor-pointer hover:scale-[1.02] transition-all'>
            <div className='text-3xl font-handwriting'>Session {props.session.number}</div>
            <img className='w-full h-1 opacity-20' src='/bottom_line.svg' alt='' />
        </div>
    )
}

