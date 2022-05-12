import { AuthCheck } from "../AuthGuard"
import { String, Richtext } from '../../components/Fields'
import Loader from "../Loader/Loader"

export default function DocumentPage({document}) {

    if(!document.loaded) return <Loader />
    if(document.loaded && !document.isData) return <div>Document not found.</div>
    
    return (
        <div>
            <AuthCheck>
                    <div className="space-y-5">
                            <String
                                value={document.name}
                                id={document.id}
                                title='Name'
                                placeholder='document name'
                                from='documents'
                                column='name'
                            />
                        <Richtext
                            id={document.id}
                            title='Description'
                            content={document.description?.content}
                            from='documents'
                            columns={['description', 'description_plaintext']}
                             />
                        
                    </div>
            </AuthCheck>
        </div>
    )
}