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
import { Metatags } from '../../../../components/Metatags'


export default function LocationPage() {
    const router = useClientRouter()
    const document = useDocument('locations', 'location_id', router.query.location)
    const [deleteDocument, setDeleteDocument] = useState(false)
    console.log(document)

    return (
        <div>
            <Metatags title={document.name || 'Locations'}/>
            <Navigation title={document.loaded ? document.name : ' '} loggedOut='Location' />
            <AuthCheck>
                {deleteDocument && document.loaded && <Modal hide={() => setDeleteDocument(false)}><DeleteDocument document={document} /></Modal>}
                {!document.loaded && <Loader centred />}
                {document.loaded && !document.isData && <div>Document not found</div>}
                {document.loaded && document.isData &&
                    <div className="space-y-5">
                        <div className="grid md:grid-cols-2">
                            <String
                                value={document.name}
                                title='Name'
                                placeholder='Cintra'
                                from='locations'
                                update='name'
                                eq={['location_id', document.location_id]}
                            />
                            <String
                                value={document.dimension}
                                title='Dimension'
                                placeholder='The Abyss'
                                from='locations'
                                update='dimension'
                                eq={['location_id', document.location_id]}
                            />
                            <String
                                value={document.world}
                                title='World'
                                placeholder='Eberron'
                                from='locations'
                                update='world'
                                eq={['location_id', document.location_id]}
                            />
                            <String
                                value={document.continent}
                                title='Continent'
                                placeholder="Tal'Dori"
                                from='locations'
                                update='continent'
                                eq={['location_id', document.location_id]}
                            />
                        </div>
                        <Richtext
                            title='Description'
                            content={document.description?.content || <p></p>}
                            from='locations'
                            update={['description', 'description_text']}
                            eq={['location_id', document.location_id]} />
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
        const { error } = await supabase.from('locations').delete().eq('location_id', props.document.location_id)
        if (!error) {
            toast.success('Location Deleted')
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