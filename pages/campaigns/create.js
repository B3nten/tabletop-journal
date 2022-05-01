import Navigation from "../../components/Navigation/Navigation"
import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import supabase from '../../lib/supabase'
import { useClientRouter } from '../../lib/hooks'
import { Metatags } from "../../components/Metatags"

export default function CreateCampaign() {
    const [name, updateName] = useState('')
    const [description, updateDescription] = useState('')
    const [isValid, setIsValid] = useState(false)
    const router = useClientRouter()

    function checkForm() {
        if (name != '') {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }
    useEffect(() => {
        checkForm()
    }, [name, description])

    async function addCampaign(e) {
        e.preventDefault()
        if (isValid) {
            let { error } = await supabase.from('campaigns').insert({ name: name, description: description }).single()
            error ?? console.log(error)
            error ? toast.error('Could not add campaign.') : toast.success('Campaign added') && router.replace('/campaigns')
        } else {
            toast.error('Please provide a valid name and description.')
        }
    }

    return (
        <>
            <Metatags title='Create Campaign'/>
            <Navigation title='New Campaign' link='/campaigns' />
            <form className='flex flex-col items-center space-y-10'>
                <input name='name' placeholder='Campaign Name' className='w-full max-w-md' value={name} onChange={(el) => updateName(el.target.value)} />
                <textarea name='description' placeholder='a brief description' className='w-full max-w-md' value={description} onChange={(el) => updateDescription(el.target.value)} />
                <button className={`btn-primary ${isValid ? 'opacity-100' : 'opacity-30 pointer-events-none'}`} onClick={addCampaign}>Create</button>
            </form>
        </>
    )
}