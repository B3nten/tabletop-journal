import { useState, useRef } from 'react'
import { AuthCheck } from '../../../../components/AuthGuard'
import { Navigation, AddButton } from '../../../../components/Navigation'
import supabase from '../../../../lib/supabase'
import Loader from '../../../../components/Loader/Loader'
import { useCampaignID, useDocumentList } from '../../../../lib/database'
import { Modal, Title } from '../../../../components/Modal'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'


export default function DreamsPage() {
    const [newDocumentModalOpen, setNewDocumentModalOpen] = useState(false)

    return (
        <div>
            {newDocumentModalOpen && <Modal hide={setNewDocumentModalOpen}><CreateDocumentModal /></Modal>}
            <Navigation title='Dreams'>
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
    const doc = useDocumentList('dreams')

    return (<>

        {newDocumentModalOpen && <Modal hide={setNewDocumentModalOpen}><CreateDocumentModal /></Modal>}

        <div className=''>
            <div>
                <div className='mb-10'>
                    <h2 className='font-fancy text-6xl'>Dreams</h2>
                </div>
                {doc.loaded ? doc.list.length > 0 ?
                    doc.list.map((d) =>
                            <DocumentListItem
                                name={d.title}
                                key={d.dream_id}
                                id={d.dream_id}>
                            </DocumentListItem>)
                    : <div className='font-handwriting opacity-80 pl-1'>no dreams</div>
                    : <Loader />
                }
                {doc.loaded && <button onClick={() => setNewDocumentModalOpen(true)} className='btn-underline mt-10'>Add Dream</button>}
            </div>
        </div>
    </>)
}

function DocumentListItem(props) {
    const router = useRouter()
    const campaign = useCampaignID()
    return (
        <div onClick={() => router.push(`/campaigns/${campaign}/dreams/${props.id}`)} className='flex flex-col items-start mt-8 space-y-1 cursor-pointer hover:scale-[1.02] transition-all'>
            <div className='text-3xl font-handwriting'>{props.name}</div>
            <img className='w-full h-1 opacity-20' src='/bottom_line.svg' />
        </div>
    )
}

function CreateDocumentModal(props) {
    const name = useRef()
    const campaign_id = useCampaignID()
    const router = useRouter()

    async function createDocument(e) {
        e.preventDefault()
        const parsedName = name.current.value === '' ? 'Dream' : name.current.value
        let { data, error } = await supabase
            .from('dreams')
            .insert({ title: parsedName, campaign_id: campaign_id })
            .single()
        if (error) {
            toast.error(error.message)
        } else {
            props.hide()
            router.push(`/campaigns/${campaign_id}/dreams/${data.dream_id}`)
        }
    }

    return (
        <div>
            <Title title='Add Dream'></Title>
            <div className="flex flex-col space-y-4">
                <div>
                    <lable htmlFor='name' className='font-handwriting text-lg'>Name: </lable>
                    <input name='name' placeholder='Dream' ref={name}></input>
                </div>
                <button className='btn-xs' onClick={createDocument}>Create Document</button>
            </div>
        </div>
    )
}