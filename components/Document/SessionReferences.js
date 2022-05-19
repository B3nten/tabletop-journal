import { useClientRouter } from "../../lib/hooks"
import { useDocumentList } from "../../lib/database"
import { useState, useEffect } from "react"
import supabase from "../../lib/supabase"
import Loader from "../Loader/Loader"

export default function SessionReferences({ document }) {
    const router = useClientRouter()
    const [documents, updateDocuments] = useState({
        loaded: false,
        isData: false,
        error: false,
    })

    useEffect(() => {
        async function getDocuments() {
            let { data, error } = await supabase
                .from('document_instances')
                .select('*, session:session_id(number, id)')
                .in('document_id', [document.id])
            if (error) {
                updateDocuments({ ...documents, loaded: true, error: error })
            } else if (data[0] === (undefined || [] || {})) {
                updateDocuments({ ...documents, loaded: true })
            } else {
                updateDocuments({ ...documents, data: [...data], loaded: true, isData: true })
            }
        }
        getDocuments()
    }, [document])

    function goToSession(id){
        router.push(`/campaigns/${router.query.campaign}/sessions/${id}`)
    }

    console.log(documents)
    if (documents.loaded && documents.data.length > 0) {
        return (
            <>
                <h2 className='font-fancy text-4xl my-5'>Appears in: </h2>
                <ul>
                    {documents.loaded && documents.data.map((reference) =>
                        <li key={reference.id} className='font-fancy text-2xl'>
                            <div className="flex items-center">
                                <div>Session {reference.session.number}</div>
                                <button onClick={()=>goToSession(reference.session.id)}><img className='ml-3 w-4 h-4' src='/icons/right-arrow.svg'></img></button>
                            </div>
                            <div className='font-handwriting text-base'>{reference.comment_plaintext}</div>
                        </li>)
                    }
                </ul>
            </>
        )
    } else return null
}