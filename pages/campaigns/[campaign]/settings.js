import { Navigation } from "../../../components/Navigation"
import { useRouterQuery } from "../../../lib/hooks"
import { useState, useEffect } from "react"
import {useRouter} from 'next/router'
import {Modal} from '../../../components/Modal/Modal'
import supabase from "../../../lib/supabase"
import toast from "react-hot-toast"

export default function CampaignSettigns() {
    const [campaign, setCampaign] = useState()

    const query = useRouterQuery(getCampaignData)
    async function getCampaignData() {
        let { data: data, error } = await supabase.from('campaigns').select('*').eq('campaign_id', query.campaign)
        error ? toast.error('Could not retrieve campaigns. Please refresh.') : setCampaign(data[0])
    }

    return (<>
        <Navigation title='Campaign Settings' />
        <div className='flex flex-col items-center mt-20'>
            <DeleteCampaign campaign={campaign} />
        </div>
        
    </>)
}

function DeleteCampaign(props) {

    const [input, setInput] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [pressed, setPressed] = useState(false)
    const router = useRouter()

    console.log(props)

    async function deleteCampaign(e) {
        e.preventDefault()
        if (isValid === true) {
            try {
                await supabase.from('campaigns').delete().eq('campaign_id', props.campaign?.campaign_id)
                toast.success('Campaign Deleted')
                router.replace('/campaigns')
            } catch (error) {
                toast.success(error.message)
            }
        }
    }

    function updateForm(e) {
        setInput(e.target.value)
    }

    useEffect(() => {
        if (input == props.campaign?.name) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [input])

    return (
        <div className='flex flex-col items-start '>
            <button className='btn-underline' onClick={() => setPressed(true)}>delete campaign</button>
            {pressed && <>
                <Modal hide={() => setPressed(false)}>
                    <div className='flex flex-col items-center justify-center p-4 space-y-2'>
                        <div className='text-xl text-center'>Confirm Deletion of Campaign</div>
                        <p className='text-center text-red-500'>This will permanently delete the Campaign and all of its data.</p>
                        <label className='text-sm'>type<span className="italic">{" " + props.campaign?.name + " "}</span>to confirm</label>
                        <input name='name' placeholder='name of campaign' className='w-full max-w-xs' value={input} onChange={(el) => updateForm(el)} />
                        <button className={`btn-primary !text-base !border-4 !font-sans ${isValid ? 'opacity-100 pointer-events-auto' : 'opacity-30 pointer-events-none'}`}
                            onClick={(e) => deleteCampaign(e)}>
                            I understand, delete
                        </button>
                    </div>
                </Modal>
            </>}
        </div>
    )
}
