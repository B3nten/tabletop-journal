import { useState } from 'react'
import { AuthCheck, AuthSwitch } from '../../../../components/AuthGuard'
import { Navigation, AddButton } from '../../../../components/Navigation'
import { useDocumentList } from '../../../../lib/database'
import { Modal } from '../../../../components/Modal'
import { DocumentListPage, AddDocument } from '../../../../components/Document'
import { useClientRouter } from '../../../../lib/hooks'

export default function OtherPage() {
    const router = useClientRouter()
    const documents = useDocumentList(router.query.campaign, 'other')
    const [newDocumentModalOpen, setNewDocumentModalOpen] = useState(false)

    return (
        <>
            <Navigation title='Other Notes'>
                <AuthSwitch>
                    <AddButton onClick={() => setNewDocumentModalOpen(true)} />
                </AuthSwitch>
            </Navigation>
            <AuthCheck>
                <DocumentListPage documents={documents} />
            </AuthCheck>
            {newDocumentModalOpen && <Modal hide={setNewDocumentModalOpen}><AddDocument type='other' /></Modal>}
        </>
    )
}