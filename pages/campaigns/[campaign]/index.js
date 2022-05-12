import Navigation from "../../../components/Navigation/Navigation"
import { AuthCheck } from "../../../components/AuthGuard"
import { useClientRouter } from "../../../lib/hooks"
import { useCampaign } from "../../../lib/database"
import Loader from "../../../components/Loader/Loader"
import { Metatags } from "../../../components/Metatags"
import Link from "next/link"

export default function Campaign() {
    const campaign = useCampaign()

    return (<>
        <Metatags title={campaign.name || 'Campaign'} />
        <Navigation title={campaign?.name ?? ''} />
        {!campaign.loaded && <Loader centred />}
        {campaign.loaded && campaign.isData &&
            <AuthCheck>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:gap-x-32 gap-y-10 place-content-center'>
                    <Link href={`/campaigns/${campaign.campaign_id}/characters`}>
                        <a className='flex flex-col items-center justify-center hover:bg-amber-300 hover:bg-opacity-10 transition-all rounded-3xl'>
                            <img className='w-1/2 h-1/2' src='/icons/characters.svg'></img>
                            <div className='text-2xl font-handwriting text-center'>Characters</div>
                        </a>
                    </Link>
                    <Link href={`/campaigns/${campaign.campaign_id}/locations`}>
                        <a className='flex flex-col items-center justify-center hover:bg-amber-300 hover:bg-opacity-10 transition-all rounded-3xl'>
                            <img className='w-1/2 h-1/2' src='/icons/locations.svg'></img>
                            <div className='text-2xl font-handwriting text-center'>Locations</div>
                        </a>
                    </Link>
                    <Link href={`/campaigns/${campaign.campaign_id}/items`}>
                        <a className='flex flex-col items-center justify-center hover:bg-amber-300 hover:bg-opacity-10 transition-all rounded-3xl'>
                            <img className='w-1/2 h-1/2' src='/icons/items.svg'></img>
                            <div className='text-2xl font-handwriting text-center'>Items</div>
                        </a>
                    </Link>
                    <Link href={`/campaigns/${campaign.campaign_id}/lore`}>
                        <a className='flex flex-col items-center justify-center hover:bg-amber-300 hover:bg-opacity-10 transition-all rounded-3xl'>
                            <img className='w-1/2 h-1/2' src='/icons/lore.svg'></img>
                            <div className='text-2xl font-handwriting text-center'>Lore</div>
                        </a>
                    </Link>
                    <Link href={`/campaigns/${campaign.campaign_id}/dreams`}>
                        <a className='flex flex-col items-center justify-center hover:bg-amber-300 hover:bg-opacity-10 transition-all rounded-3xl'>
                            <img className='w-1/2 h-1/2' src='/icons/dreams.svg'></img>
                            <div className='text-2xl font-handwriting text-center'>Dreams</div>
                        </a>
                    </Link>
                    <Link href={`/campaigns/${campaign.campaign_id}/other`}>
                        <a className='flex flex-col items-center justify-center hover:bg-amber-300 hover:bg-opacity-10 transition-all rounded-3xl'>
                            <img className='w-1/2 h-1/2' src='/icons/other-notes.svg'></img>
                            <div className='text-2xl font-handwriting text-center'>Other Notes</div>
                        </a>
                    </Link>

                </div>                   
                <div>
                    <OptionsListItem name='Campaign Settings' campaign={campaign?.campaign_id} link='settings' />
                </div>
            </AuthCheck>}
    </>)
}

function OptionsListItem(props) {
    const router = useClientRouter()
    return (
        <button onClick={() => router.push(`/campaigns/${router.query.campaign}/${props.link}`)} className='flex flex-col items-start mt-8 hover:scale-[1.04] hover:translate-x-2 transition-all'>
            <div className='text-xl font-handwriting'>{props.name}</div>
            <img className='w-full h-1 opacity-20' src='/bottom_line.svg' alt='' />
        </button>
    )
}





