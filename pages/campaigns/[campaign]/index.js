import Navigation from "../../../components/Navigation/Navigation"
import { AuthCheck } from "../../../components/AuthGuard"
import { useClientRouter } from "../../../lib/hooks"
import { newGameSession, useAllRecentDocuments, useCampaign, useGameSessionList } from "../../../lib/database"
import Loader from "../../../components/Loader/Loader"
import { Metatags } from "../../../components/Metatags"
import Link from "next/link"
import { Header } from "../../../components/Campaign"

export default function Campaign() {

    const campaign = useCampaign()
    const router = useClientRouter()

    return (<>
        <Metatags title={campaign.name || 'Campaign'} />
        <Navigation title={campaign.name ?? ''} />
        <AuthCheck>
            <Header />
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:gap-x-32 gap-y-10 place-content-center'>
                <MenuItem img='/icons/characters.svg' title='Characters' url='/characters'/>
                <MenuItem img='/icons/locations.svg' title='Locations' url='/locations'/>
                <MenuItem img='/icons/items.svg' title='Items' url='/items'/>
                <MenuItem img='/icons/lore.svg' title='Lore' url='/lore'/>
                <MenuItem img='/icons/dreams.svg' title='Dreams' url='/dreams'/>
                <MenuItem img='/icons/events.svg' title='Events' url='/events'/>
                <MenuItem img='/icons/other-notes.svg' title='Other Notes' url='/other'/>
                <MenuItem img='/icons/sessions.svg' title='Sessions' url='/sessions'/>
                <MenuItem img='/icons/gear.svg' title='Settings' url='/settings'/>
            </div>
        </AuthCheck>
    </>)
}

function MenuItem(props) {
    const router = useClientRouter()
    return (
        <Link href={`/campaigns/${router.query.campaign}${props.url}`}>
            <a className='flex flex-col items-center justify-center hover:bg-amber-300 hover:bg-opacity-20 transition-all duration-300 rounded-3xl'>
                <img className='w-1/2 h-1/2' src={props.img}></img>
                <div className='text-2xl font-handwriting text-center'>{props.title}</div>
            </a>
        </Link>

    )
}


