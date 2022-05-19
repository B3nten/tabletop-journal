import { Document } from '../../../../components/Document'
import { useClientRouter } from '../../../../lib/hooks'
import { useDocument } from '../../../../lib/database'
import { Navigation } from '../../../../components/Navigation'
import { useState } from 'react'
import { Modal, Title } from '../../../../components/Modal'
import { AuthCheck } from '../../../../components/AuthGuard'
import supabase from '../../../../lib/supabase'
import toast from 'react-hot-toast'
import { SessionReferences } from '../../../../components/Document'

export default function EventDocument() {
    const router = useClientRouter()
    const document = useDocument(router.query.event)
    const [deleteDocument, setDeleteDocument] = useState()

    return (
        <>
            <Navigation title={document.name || ''} />
            <AuthCheck>
                <Document document={document} />
                {document.loaded && <SessionReferences document={document}/>}
                {document.loaded && document.isData && <button className='btn-underline mt-10' onClick={() => setDeleteDocument(true)}>Delete Document</button>}
                {deleteDocument && document.loaded && <Modal hide={() => setDeleteDocument(false)}><DeleteDocument document={document} /></Modal>}
            </AuthCheck>
        </>
    )
}

function DeleteDocument(props) {
    const router = useClientRouter()
    async function deleteDocument() {
        const { error } = await supabase.from('documents').delete().eq('id', props.document.id)
        if (!error) {
            toast.success('Document Deleted')
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