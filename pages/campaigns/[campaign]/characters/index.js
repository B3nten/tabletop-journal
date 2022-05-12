import { useState } from 'react'
import { AuthCheck, AuthSwitch } from '../../../../components/AuthGuard'
import { Navigation, AddButton } from '../../../../components/Navigation'
import { useDocumentList } from '../../../../lib/database'
import { Modal } from '../../../../components/Modal'
import { DocumentListPage, AddDocument } from '../../../../components/Document'
import { useClientRouter } from '../../../../lib/hooks'


export default function CharactersPage() {
	const router = useClientRouter()
	const documents = useDocumentList(router.query.campaign, 'character')
	const [newDocumentModalOpen, setNewDocumentModalOpen] = useState(false)

	return (
		<>
			<Navigation title='Characters'>
				<AuthSwitch>
					<AddButton onClick={() => setNewDocumentModalOpen(true)} />
				</AuthSwitch>
			</Navigation>
			<AuthCheck>
				<DocumentListPage documents={documents} />
			</AuthCheck>
			{newDocumentModalOpen && <Modal hide={setNewDocumentModalOpen}><AddDocument type='character' /></Modal>}
		</>
	)
}

