import Navigation from "../../../components/Navigation/Navigation"
import { AuthCheck } from "../../../components/AuthGuard"
import { useClientRouter } from "../../../lib/hooks"
import { useCampaign } from "../../../lib/database"
import Loader from "../../../components/Loader/Loader"
import { Metatags } from "../../../components/Metatags"

export default function Campaign() {
    const campaign = useCampaign()

    return (<>
        <Metatags title={campaign.name || 'Campaign'}/>
        <Navigation title={campaign?.name ?? ''} />
        {!campaign.loaded && <Loader centred />}
        {campaign.loaded && campaign.isData &&
            <AuthCheck>
                <div>
                    <div className="opacity-30">
                        <OptionsListItem name='Sessions' />
                    </div>
                    <OptionsListItem name='Characters' link='characters' />

                    <OptionsListItem name='Lore' link='lore' />
                    <OptionsListItem name='Locations' link='locations' />
                    <OptionsListItem name='Items' link='items'/>
                    <OptionsListItem name='Dreams' link='dreams' />
                    <OptionsListItem name='Other Notes' link='other' />

                    <OptionsListItem name='Campaign Settings' campaign={campaign?.campaign_id} link='settings' />
                </div>
            </AuthCheck>}
    </>)
}

function OptionsListItem(props) {
    const router = useClientRouter()
    return (
        <button onClick={() => router.push(`/campaigns/${router.query.campaign}/${props.link}`)} className='flex flex-col items-start mt-8 space-y-1 hover:scale-[1.04] hover:translate-x-2 transition-all'>
            <div className='text-3xl font-handwriting'>{props.name}</div>
            <img className='w-full h-1 opacity-20' src='/bottom_line.svg' alt=''/>
        </button>
    )
}





