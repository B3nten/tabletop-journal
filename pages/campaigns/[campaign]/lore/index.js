import { useState, useRef } from 'react'
import { AuthCheck } from '../../../../components/AuthGuard'
import { Navigation, AddButton } from '../../../../components/Navigation'
import supabase from '../../../../lib/supabase'
import Loader from '../../../../components/Loader/Loader'
import { useCampaignID, useDocumentList } from '../../../../lib/database'
import { Modal, Title } from '../../../../components/Modal'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useSession } from '../../../../lib/authentication'


export default function LoresPage() {
    const [newDocumentModalOpen, setNewDocumentModalOpen] = useState(false)

    return (
        <div>
            {newDocumentModalOpen && <Modal hide={setNewDocumentModalOpen}><CreateDocumentModal /></Modal>}
            <Navigation title='Lore'>
                <AddButton onClick={() => setNewDocumentModalOpen(true)} />
            </Navigation>
            <AuthCheck>
                <DocumentList />
            </AuthCheck>
        </div>
    )
}

function DocumentList() {
    const [newDocumentModalOpen, setNewDocumentModalOpen] = useState(false)
    const lore = useDocumentList('lore')

    return (<>

        {newDocumentModalOpen && <Modal hide={setNewDocumentModalOpen}><CreateDocumentModal /></Modal>}

        <div className=''>
            <div>
                <div className='mb-10'>
                    <h2 className='font-fancy text-6xl'>Lore</h2>
                </div>
                {lore.loaded ? lore.list.length > 0 ?
                    lore.list.map((doc) =>
                            <DocumentListItem
                                name={doc.title}
                                key={doc.lore_id}
                                id={doc.lore_id}>
                            </DocumentListItem>)
                    : <div className='font-handwriting opacity-80 pl-1'>no lore</div>
                    : <Loader />
                }
                {lore.loaded && <button onClick={() => setNewDocumentModalOpen(true)} className='btn-underline mt-10'>Add lore</button>}
            </div>
        </div>
    </>)
}

function DocumentListItem(props) {
    const router = useRouter()
    const campaign = useCampaignID()
    return (
        <div onClick={() => router.push(`/campaigns/${campaign}/lore/${props.id}`)} className='flex flex-col items-start mt-8 space-y-1 cursor-pointer hover:scale-[1.02] transition-all'>
            <div className='text-3xl font-handwriting'>{props.name}</div>
            <img className='w-full h-1 opacity-20' src='/bottom_line.svg' />
        </div>
    )
}

function CreateDocumentModal(props) {
    const name = useRef()
    const campaign_id = useCampaignID()
    const router = useRouter()
    const session = useSession()
    console.log(session)

    async function createDocument(e) {
        e.preventDefault()
        const parsedName = name.current.value === '' ? 'The Awakening' : name.current.value
        let { data, error } = await supabase
            .from('lore')
            .insert({ title: parsedName, campaign_id: campaign_id })
            .single()
        if (error) {
            toast.error(error.message)
        } else {
            props.hide()
            router.push(`/campaigns/${campaign_id}/lore/${data.lore_id}`)
        }
    }

    return (
        <div>
            <Title title='Add Lore'></Title>
            <div className="flex flex-col space-y-4">
                <div>
                    <lable htmlFor='name' className='font-handwriting text-lg'>Name: </lable>
                    <input name='name' placeholder='The Awakening' ref={name}></input>
                </div>
                <button className='btn-xs' onClick={createDocument}>Create Lore</button>
            </div>
        </div>
    )
}