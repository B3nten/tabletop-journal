import { useClientRouter } from "../../lib/hooks"
import { Comment } from "../Fields"
import { Modal, Title } from '../../components/Modal'
import { useState } from "react"
import { useDocument } from '../../lib/database'
import { Document } from "../Document"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export default function Instance({ instance, deleteInstance }) {

  const router = useClientRouter()
  const [documentModal, setDocumentModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  let imgSrc = ''
  let url = ''

  switch (instance.document.type) {
    case 'character':
      imgSrc = '/icons/characters.svg'
      url = 'characters'
      break
    case 'item':
      imgSrc = '/icons/items.svg'
      url = 'items'
      break
    case 'lore':
      imgSrc = '/icons/lore.svg'
      url = 'lore'
      break
    case 'event':
      imgSrc = '/icons/events.svg'
      url = 'events'
      break
    case 'location':
      imgSrc = '/icons/locations.svg'
      url = 'locations'
      break
    case 'dream':
      imgSrc = '/icons/dreams.svg'
      url = 'dreams'
      break
    case 'other':
      imgSrc = '/icons/other-notes.svg'
      url = 'other'
      break
  }

  function goToDocument() {
    router.push(`/campaigns/${router.query.campaign}/${url}/${instance.document.id}`)
  }


  return (
    <>
      {documentModal && <Modal hide={setDocumentModal}><DocumentModal documentID={instance.document.id} goToDocument={goToDocument} /></Modal>}
      {deleteModal && <Modal hide={setDeleteModal}>
        <Title title='Delete from Session?'></Title>
        <div className="flex flex-col items-center w-full">
          <p className='font-handwriting max-w-[40ch] text-center'>
            Are you sure you want to delete this document instance from the session timeline?
          </p>
          <button onClick={() => { deleteInstance(instance); setDeleteModal(false) }} className='btn-xs mt-4'>Yes, delete</button>
        </div>
      </Modal>}
      <div className='flex flex-col justify-center items-center w-full space-y-1'>
        <img className='h-12 opacity-30' src='/vertical_line.svg' />
        <img className='block w-16 h-16' src={imgSrc}></img>
        <div className='flex items-center'>
          <h2 className='text-3xl font-handwriting'>{instance.document.name}</h2>{' '}
          <div className='ml-auto pl-2 flex space-x-2'>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <img className='w-6 h-6 opacity-80' src='/icons/gear.svg' />
              </DropdownMenu.Trigger>
              <DropdownMenu.DropdownMenuContent
                sideOffset={10} className='bg-[#fce5bb] p-2 space-y-1 font-handwriting shadow-lg rounded-xl'>
                <DropdownMenu.DropdownMenuItem>
                  <button className='' onClick={() => setDocumentModal(true)}>Preview Document</button>
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem>
                  <button onClick={() => setDeleteModal(true)}>Delete Timeline Instance</button>
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.Separator className='w-full'>
                  <img className='h-1 w-full opacity-70 noise' src='/bottom_line.svg'></img>
                </DropdownMenu.Separator>
                <DropdownMenu.Group>
                  <DropdownMenu.DropdownMenuItem disabled className='opacity-30'>
                    Move Up
                  </DropdownMenu.DropdownMenuItem>
                  <DropdownMenu.DropdownMenuItem disabled className='opacity-30'>
                    Move down
                  </DropdownMenu.DropdownMenuItem>
                </DropdownMenu.Group>

              </DropdownMenu.DropdownMenuContent>
            </DropdownMenu.Root>
          </div>
        </div>
        <div className="w-full">
          <Comment
            id={instance.id}
            title=''
            content={instance.comment?.content}
            from='document_instances'
            columns={['comment', 'comment_plaintext']}
          />
        </div>
      </div>
    </>
  )
}

function DocumentModal({ documentID, goToDocument }) {

  const document = useDocument(documentID)

  return (
    <div className='w-full max-w-2xl'>
      <Document document={document} />
      {document.loaded && <button className='btn-underline' onClick={goToDocument}>Goto Document</button>}
    </div>
  )
}