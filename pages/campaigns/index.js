import Link from 'next/dist/client/link'
import Loader from '../../components/Loader/Loader'
import Navigation from '../../components/Navigation/Navigation'
import { AuthCheck } from '../../components/AuthGuard'
import { useAllDocuments, useCampaignList } from '../../lib/database'
import { Metatags } from '../../components/Metatags'

export default function Campaigns() {
  const campaigns = useCampaignList()

  return (
    <>
      <Metatags title='Campaigns' />
      <Navigation title='Campaigns' />
      <AuthCheck>
        {!campaigns.loaded && <Loader centred />}
        {campaigns.loaded && (
          <div className='flex flex-col items-start space-y-16'>
            <CampaignList campaigns={campaigns.list} />
            <Link href='/campaigns/create'>
              <button className='btn-underline hover:scale-105'>
                Create Campaign
              </button>
            </Link>
          </div>
        )}
      </AuthCheck>
    </>
  )
}

function CampaignList(props) {
  return (
    <div className='flex flex-col space-y-8'>
      {props.campaigns?.length === 0
        ? 'No campaigns yet.'
        : props.campaigns?.map((campaign) => (
          <CampaignItem
            key={campaign.campaign_id}
            campaign_id={campaign.campaign_id}
            name={campaign.name}
          />
        ))}
    </div>
  )
}

function CampaignItem(props) {
  
  const documents = useAllDocuments(props.campaign_id, 'id')

  return (
    <Link href={`/campaigns/${props.campaign_id}`}>
      <div className='flex flex-col items-start mt-8 space-y-1 cursor-pointer hover:scale-[1.02] transition-all'>
        <div className='text-3xl font-handwriting'>{props.name}</div>
        {!documents.loaded && <div className='font-handwriting'>documents: <Loader tiny/></div>}
        {documents.loaded && 
        <div className='font-handwriting'>documents: {documents.data.length}</div>
        }
        <img className='w-full h-1 opacity-20' src='/bottom_line.svg' alt='' />
      </div>
    </Link>
  )
}
