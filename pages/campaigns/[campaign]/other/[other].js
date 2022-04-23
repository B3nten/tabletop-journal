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


export default function OtherPage() {
    const router = useClientRouter()
    const document = useDocument('other', 'other_id', router.query.other)
    const [deleteDocument, setDeleteDocument] = useState(false)

    return (
        <div>
            <Navigation title={document.loaded ? document.title : ' '} loggedOut='Other Notes' />
            <AuthCheck>
                {deleteDocument && document.loaded && <Modal hide={() => setDeleteDocument(false)}><DeleteDocument document={document} /></Modal>}
                {!document.loaded && <Loader centred />}
                {document.loaded && !document.isData && <div>Document not found</div>}
                {document.loaded && document.isData &&
                    <div className="space-y-5">
                        <String
                            value={document.title}
                            title='Title'
                            placeholder='Other'
                            from='other'
                            update='title'
                            eq={['other_id', document.other_id]}
                        />
                        <Richtext
                            title='Notes'
                            content={document.note?.content || <p></p>}
                            from='other'
                            update={['note', 'note_text']}
                            eq={['other_id', document.other_id]} />
                        <button className='btn-underline mt-10' onClick={() => setDeleteDocument(true)}>Delete Document</button>
                    </div>
                }
            </AuthCheck>
        </div>
    )
}

function DeleteDocument(props) {
    const router = useClientRouter()

    async function deleteDocument() {
        const { error } = await supabase.from('other').delete().eq('other_id', props.document.other_id)
        if (!error) {
            toast.success('Note Deleted')
            router.back()
        } else {
            toast.error(error.message)
        }
    }

    return (
        <div className='flex flex-col'>
            <Title title={`Delete ${props.document.title} ?`} />
            <p className='text-red-500 mb-5'>This action cannot be undone.</p>
            <button onClick={deleteDocument} className='btn-small'>Delete</button>
        </div>
    )
}