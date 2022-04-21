import Navigation from "../../../components/Navigation/Navigation"
import { AuthCheck } from "../../../components/AuthGuard"
import { useRouter } from 'next/router'
import { useCampaign } from "../../../lib/database"

export default function Campaign() {
    const campaign = useCampaign()

    return (<>
        <Navigation title={campaign?.name ?? ''} />
        <AuthCheck>
            {campaign?.name ?
                <div>
                    <div className="opacity-30">
                        <OptionsListItem name='Sessions' />
                    </div>
                    <OptionsListItem name='Characters' campaign={campaign?.campaign_id} link='characters' />
                    <div className="opacity-30">
                        <OptionsListItem name='Events' />
                        <OptionsListItem name='Locations' />
                        <OptionsListItem name='Items' />
                        <OptionsListItem name='Dreams' />
                        <OptionsListItem name='Other Notes' />
                    </div>
                    <OptionsListItem name='Campaign Settings' campaign={campaign?.campaign_id} link='settings' />
                </div>
                : null}
        </AuthCheck>
    </>)
}

function OptionsListItem(props) {
    const router = useRouter()
    return (
        <button onClick={() => router.push(`/campaigns/${props.campaign}/${props.link}`)} className='flex flex-col items-start mt-8 space-y-1 hover:scale-[1.04] hover:translate-x-2 transition-all'>
            <div className='text-3xl font-handwriting'>{props.name}</div>
            <img className='w-full h-1 opacity-20' src='/bottom_line.svg' />
        </button>
    )
}





