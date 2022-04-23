import { AuthCheck } from '../../../../components/AuthGuard'
import { Navigation } from '../../../../components/Navigation'
import { useDocument } from '../../../../lib/database'
import Loader from '../../../../components/Loader/Loader'
import { String, Richtext, Number, Select } from '../../../../components/Fields'
import { useState } from 'react'
import { Modal, Title } from '../../../../components/Modal'
import toast from 'react-hot-toast'
import { useClientRouter } from '../../../../lib/hooks'
import supabase from '../../../../lib/supabase'


export default function ItemPage() {
    const router = useClientRouter()
    const document = useDocument('items', 'item_id', router.query.item)
    const [deleteDocument, setDeleteDocument] = useState(false)

    return (
        <div>
            <Navigation title={document.loaded ? document.name : ' '} loggedOut='Item' />
            <AuthCheck>
                {deleteDocument && document.loaded && <Modal hide={() => setDeleteDocument(false)}><DeleteDocument document={document} /></Modal>}
                {!document.loaded && <Loader centred />}
                {document.loaded && !document.isData && <div>Document not found</div>}
                {document.loaded && document.isData &&
                    <div className="space-y-5">
                        <div className="grid sm:grid-cols-2">
                            <String
                                value={document.name}
                                title='Name'
                                placeholder='Spear'
                                from='items'
                                update='name'
                                eq={['item_id', document.item_id]}
                            />
                            <String
                                value={document.price}
                                title='Price'
                                placeholder='10 silver'
                                from='items'
                                update='price'
                                eq={['item_id', document.item_id]}
                            />
                            <String
                                value={document.weight}
                                title='Weight'
                                placeholder='5lbs'
                                from='items'
                                update='weight'
                                eq={['item_id', document.item_id]}
                            />
                            <Select
                                value={document.magical}
                                title='Magical?'
                                from='items'
                                update='magical'
                                options={[
                                    { option: 'magical', title: 'magical' },
                                    { option: 'non-magical', title: 'non-magical' },
                                ]}
                                eq={['item_id', document.item_id]}
                            />
                        </div>
                        <Richtext
                            title='Description'
                            content={document.description?.content || <p></p>}
                            from='items'
                            update={['description', 'description_text']}
                            eq={['item_id', document.item_id]} />
                        <button className='btn-underline mt-10' onClick={() => setDeleteDocument(true)}>Delete item</button>
                    </div>
                }
            </AuthCheck>
        </div>
    )
}

function DeleteDocument(props) {
    const router = useClientRouter()

    async function deleteDocument() {
        const { error } = await supabase.from('items').delete().eq('item_id', props.document.item_id)
        if (!error) {
            toast.success('Item Deleted')
            router.back()
        } else {
            toast.error(error.message)
        }
    }

    return (
        <div className='flex flex-col'>
            <Title title={`Delete ${props.document.name} ?`} />
            <p className='text-red-500 mb-5'>This action cannot be undone.</p>
            <button onClick={deleteDocument} className='btn-small'>Delete</button>
        </div>
    )
}