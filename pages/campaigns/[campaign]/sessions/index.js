import { AuthCheck } from '../../../../components/AuthGuard'
import Loader from '../../../../components/Loader/Loader'
import { useClientRouter } from '../../../../lib/hooks'
import { useSessionList } from '../../../../lib/database'


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
    const sessions = useSessionList(router.query.campaign)

    return (<>
        <div className=''>
            <div>
                <div className='mb-10'>
                    <h2 className='font-fancy text-6xl'>Sessions</h2>
                </div>
                {sessions.loaded ? sessions.data?.length > 0 ?
                    sessions.data.map((d) =>
                        <DocumentListItem
                            key={d.session_id}
                            id={d.session_id}
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
        <div onClick={() => router.push(`/campaigns/${router.query.campaign}/sessions/${props.id}`)} className='flex flex-col items-start mt-8 space-y-1 cursor-pointer hover:scale-[1.02] transition-all'>
            <div className='text-3xl font-handwriting'>{props.id}</div>
            <img className='w-full h-1 opacity-20' src='/bottom_line.svg' alt='' />
        </div>
    )
}

