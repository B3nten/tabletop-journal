import Link from "next/dist/client/link"
import Loader from '../../components/Loader/Loader'
import Navigation from '../../components/Navigation/Navigation'
import { AuthCheck } from "../../components/AuthGuard"
import { useCampaignList } from "../../lib/database"



export default function Campaigns() {
    const campaigns = useCampaignList()
    
    return (<>
            <Navigation title='Campaigns' />
            <AuthCheck>
                {!campaigns.loaded && <Loader centred />}
                {campaigns.loaded && 
                <div className='flex flex-col items-center space-y-16'>
                    <CampaignList campaigns={campaigns.list} />
                    <Link href='/campaigns/create'>
                        <button className='btn-underline hover:scale-105'>Create Campaign</button>
                    </Link>
                </div>}
            </AuthCheck>
        </>)
}

function CampaignList(props) {
    return (
        <div className='flex flex-col items-center space-y-8'>
            {props.campaigns?.length === 0 ? 'No campaigns yet.'
                : props.campaigns?.map(campaign =>
                    <CampaignItem key={campaign.id} campaign_id={campaign.campaign_id} name={campaign.name} />)
            }
        </div>
    )
}

function CampaignItem(props) {
    return (
        <Link href={`/campaigns/${props.campaign_id}`}>
            <button className='btn-primary'>{props.name}</button>
        </Link>
    )
}

