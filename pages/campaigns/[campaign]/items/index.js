import { useState, useRef } from 'react'
import { AuthCheck } from '../../../../components/AuthGuard'
import { Navigation, AddButton } from '../../../../components/Navigation'
import supabase from '../../../../lib/supabase'
import Loader from '../../../../components/Loader/Loader'
import { useCampaignID, useDocumentList } from '../../../../lib/database'
import { Modal, Title } from '../../../../components/Modal'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'


export default function ItemsPage() {
    const [newDocumentModalOpen, setNewDocumentModalOpen] = useState(false)

    return (
        <div>
            {newDocumentModalOpen && <Modal hide={setNewDocumentModalOpen}><CreateDocumentModal /></Modal>}
            <Navigation title='Items'>
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
    const doc = useDocumentList('items')

    return (<>

        {newDocumentModalOpen && <Modal hide={setNewDocumentModalOpen}><CreateDocumentModal /></Modal>}

        <div className=''>
            <div>
                <div className='mb-10'>
                    <h2 className='font-fancy text-6xl'>Items</h2>
                </div>
                {doc.loaded ? doc.list.length > 0 ?
                    doc.list.map((d) =>
                            <DocumentListItem
                                name={d.name}
                                key={d.item_id}
                                id={d.item_id}
                                price={d.price}
                                weight={d.weight}
                                magical={d.magical}
                                >
                            </DocumentListItem>)
                    : <div className='font-handwriting opacity-80 pl-1'>no documents</div>
                    : <Loader />
                }
                {doc.loaded && <button onClick={() => setNewDocumentModalOpen(true)} className='btn-underline mt-10'>Add item</button>}
            </div>
        </div>
    </>)
}

function DocumentListItem(props) {
    const router = useRouter()
    const campaign = useCampaignID()
    return (
        <div onClick={() => router.push(`/campaigns/${campaign}/items/${props.id}`)} className='flex flex-col items-start mt-8 space-y-1 cursor-pointer hover:scale-[1.02] transition-all'>
            <div className='text-3xl font-handwriting'>{props.name}</div>
            {props.price || props.weight || props.magical ?
                        <div className='flex space-x-1 text-lg font-handwriting'>
                            <div>
                                {props.price && props.price + ', '}
                            </div>
                            <div>
                                {props.weight && props.weight + ', '}
                            </div>
                            <div>
                                {props.magical}
                            </div>
                        </div> : null}
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
        const parsedName = name.current.value === '' ? 'Item' : name.current.value
        let { data, error } = await supabase
            .from('items')
            .insert({ name: parsedName, campaign_id: campaign_id })
            .single()
        if (error) {
            toast.error(error.message)
        } else {
            props.hide()
            router.push(`/campaigns/${campaign_id}/items/${data.item_id}`)
        }
    }

    return (
        <div>
            <Title title='Add Item'></Title>
            <div className="flex flex-col space-y-4">
                <div>
                    <lable htmlFor='name' className='font-handwriting text-lg'>Name: </lable>
                    <input name='name' placeholder='item' ref={name}></input>
                </div>
                <button className='btn-xs' onClick={createDocument}>Create Item</button>
            </div>
        </div>
    )
}