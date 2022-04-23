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


export default function DreamPage() {
    const router = useClientRouter()
    const document = useDocument('dreams', 'dream_id', router.query.dream)
    const [deleteDocument, setDeleteDocument] = useState(false)

    return (
        <div>
            <Navigation title={document.loaded ? document.title : ' '} loggedOut='Dream' />
            <AuthCheck>
                {deleteDocument && document.loaded && <Modal hide={() => setDeleteDocument(false)}><DeleteDocument document={document} /></Modal>}
                {!document.loaded && <Loader centred />}
                {document.loaded && !document.isData && <div>Document not found</div>}
                {document.loaded && document.isData &&
                    <div className="space-y-5">
                        <String
                            value={document.title}
                            title='Title'
                            placeholder='dream'
                            from='dreams'
                            update='title'
                            eq={['dream_id', document.dream_id]}
                        />
                        <Richtext
                            title='Description'
                            content={document.content?.content || <p></p>}
                            from='dreams'
                            update={['content', 'content_text']}
                            eq={['dream_id', document.dream_id]} />
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
        const { error } = await supabase.from('dreams').delete().eq('dream_id', props.document.dream_id)
        if (!error) {
            toast.success('Dream Deleted')
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