import { useEffect, useState, useRef } from 'react'
import supabase from '../../../../lib/supabase'
import { useClientRouter } from '../../../../lib/hooks'
import { Navigation } from '../../../../components/Navigation'
import Loader from '../../../../components/Loader/Loader'
import { Richtext, Comment } from '../../../../components/Fields'
import { Modal, Title } from '../../../../components/Modal'
import toast from 'react-hot-toast'
import { Instance } from '../../../../components/Sessions'

export default function Session() {
  const router = useClientRouter()
  const [session, setSession] = useState({
    loaded: false,
    isData: false,
    error: false,
    data: {},
  })
  const [instances, setInstances] = useState([])
  const [newReferenceModal, setNewReferenceModal] = useState(false)

  useEffect(() => {
    (async () => {
      const [instances, sessionDoc] = await Promise.all([
        await supabase.from('document_instances').select('*, document:document_id(name, id, type)').eq('session_id', router.query.session).order('created_at'),
        await supabase.from('sessions').select('*').eq('id', router.query.session).single()
      ])
      let orderedArray = []
      let remainingInstances = []
      let newOrder = []
      if (sessionDoc.data.order && instances.data) {
        remainingInstances = [...instances.data]
        console.log(remainingInstances)
        sessionDoc.data.order.forEach((order) => {
          remainingInstances.forEach((instance, index) => {
            if (order === instance.id) {
              console.log(instance)
              orderedArray.push(instance)
              remainingInstances.splice(index, 1)
            }
          })
        })
        // check for instances not in ordered array, and push to ordaredArray
        orderedArray.push(...remainingInstances)
        newOrder = orderedArray.map((el)=>el.id)
      }
      setSession({
        ...session,
        isData: true,
        loaded: true,
        data: sessionDoc.data,
      })
      setInstances(orderedArray)
      await supabase.from('sessions').update({order: newOrder}).eq('id', router.query.session)
      // TODO: add unordered instances to array, remove unfound instances, and update supabase (catches 'deleted' or unrecognized instances)
    })()
  }, [])

  async function addInstance(instance) {
    // push instance ID to session.data.order and then write to supabase
    let newOrder
    session.data.order ? newOrder = [...session.data.order] : newOrder = []
    newOrder.push(instance.id)
    let { data, error } = await supabase.from('sessions').update({ order: newOrder }).eq('id', router.query.session)
    // push instance to instances
    let newInstances = [...instances]
    newInstances.push(instance)
    setInstances(newInstances)

  }
  async function deleteInstance(instanceToBeDeleted) {
    // remove from array and patch to supabase
    // remove instance itself from supabase
    // remove from page array
    let newInstances = instances.filter(instance => instance.id !== instanceToBeDeleted.id)
    setInstances(newInstances)
    let newOrder = []
    if (session.data.order) {
      newOrder = session.data.order.filter(el => el !== instanceToBeDeleted.id)
    }
    await supabase.from('sessions').update({ order: newOrder }).eq('id', router.query.session)
    await supabase.from('document_instances').delete().eq('id', instanceToBeDeleted.id)
  }

  return (
    <div>
      {newReferenceModal && <Modal hide={setNewReferenceModal} ><AddReferenceModal addInstance={addInstance} /></Modal>}
      <Navigation title={session.loaded ? 'Session ' + session.data.number : <div>Session <Loader tiny /></div>} />
      {!session.loaded && <Loader centred />}
      {session.loaded &&
        <>
          <div className="w-full mx-auto">
            <Richtext
              id={session.data.id}
              title='Overview'
              content={session.data.overview?.content}
              from='sessions'
              columns={['overview', 'overview_plaintext']}
            />
          </div>
          <h2 className='font-handwriting text-2xl'>Timeline</h2>
          <div className='flex flex-col justify-center items-center w-full mx-auto bg-[#fbbe2426] p-4 rounded-3xl'>

            {instances.map(instance =>
              <Instance key={instance.id} instance={instance} deleteInstance={deleteInstance} />)
            }
            <button onClick={() => setNewReferenceModal(true)}><img className='w-8 h-8 mt-10' src='/icons/add-outline.svg'></img></button>
          </div>
        </>
      }
    </div>
  )
}

function AddReferenceModal(props) {

  const [state, setState] = useState('initial')
  const [documents, setDocuments] = useState([])

  const router = useClientRouter()
  const newDocumentName = useRef('')
  const newDocumentType = useRef('')

  async function createReference(documentID, documentName, documentType) {
    // need session and document ID to create reference
    let { data, error } = await supabase
      .from('document_instances')
      .insert({ session_id: router.query.session, document_id: documentID })
      .single()
    if (error) {
      toast.error(error.message)
    }
    else {
      const instance = { ...data, document: { name: documentName, type: documentType, id: documentID } }
      await props.addInstance(instance)
      props.hide()
      toast.success('Document Created')
    }
  }

  async function createDocument(e) {
    e.preventDefault()
    const parsedName = newDocumentName.current.value === '' ? 'name' : newDocumentName.current.value
    let { data, error } = await supabase
      .from('documents')
      .insert({ name: parsedName, campaign_id: router.query.campaign, type: newDocumentType.current.value })
      .single()
    if (error) {
      toast.error(error.message)
    } else {
      await createReference(data.id, data.name, data.type)
    }
  }

  async function getListOfDocuments(type) {
    const { data, error } = await supabase.from('documents').select('id, name, type').eq('type', type)
    setDocuments(data)
    setState('docList')
    console.log(data)
  }

  if (state === 'initial') {
    return (
      <div className='grid grid-cols-2 place-content-center gap-4'>
        <button onClick={() => setState('newDoc')} className='hover:bg-amber-300 hover:bg-opacity-20 rounded-3xl transition-all p-1 md:p-4'>
          <img className='w-full h-16' src='/icons/add-outline.svg'></img>
          <div className='font-handwriting'>New Document</div>
        </button>
        <button onClick={() => setState('categories')} className='hover:bg-amber-300 hover:bg-opacity-20 rounded-3xl transition-all p-1 md:p-4'>
          <img className='w-full h-16' src='/icons/other-notes.svg'></img>
          <div className='font-handwriting'>Add Document</div>
        </button>
      </div>
    )
  }
  if (state === 'newDoc') {
    return (
      <>
        <button className='font-handwriting mb-1' onClick={() => setState('initial')}>{'< back'}</button>
        <Title title='New Document' />
        <div className="flex flex-col space-y-2">
          <div className='space-y-2'>
            <label htmlFor='name' className='font-handwriting text-lg'>Name: </label>
            <input name='name' placeholder='name' ref={newDocumentName}></input>
            <select ref={newDocumentType} className='block w-full border-none text-lg font-handwriting bg-[rgb(251_190_36)] bg-opacity-[.15] rounded-2xl pt-1'>
              <option value='character'>Character</option>
              <option value='location'>Location</option>
              <option value='item'>Item</option>
              <option value='lore'>Lore</option>
              <option value='dream'>Dream</option>
              <option value='event'>Event</option>
              <option value='other'>Other Note</option>
            </select>
          </div>
          <button onClick={createDocument} className='btn-xs'>Create Document</button>
        </div>
      </>
    )
  }
  if (state === 'categories') {
    return (
      <>
        <button className='font-handwriting mb-1' onClick={() => setState('initial')}>{'< back'}</button>
        <Title title='Add Document' />
        <div className='grid grid-cols-3 gap-6'>
          <button
            onClick={() => getListOfDocuments('character')}>
            <img src='/icons/characters.svg' className='w-9 h-9'></img>
          </button>
          <button
            onClick={() => getListOfDocuments('location')}>
            <img src='/icons/locations.svg' className='w-9 h-9'></img>
          </button>
          <button
            onClick={() => getListOfDocuments('item')}>
            <img src='/icons/items.svg' className='w-9 h-9'></img>
          </button>
          <button
            onClick={() => getListOfDocuments('lore')}>
            <img src='/icons/lore.svg' className='w-9 h-9'></img>
          </button>
          <button
            onClick={() => getListOfDocuments('dream')}>
            <img src='/icons/dreams.svg' className='w-9 h-9'></img>
          </button>
          <button
            onClick={() => getListOfDocuments('event')}>
            <img src='/icons/events.svg' className='w-9 h-9'></img>
          </button>
          <button
            onClick={() => getListOfDocuments('other')}>
            <img src='/icons/other-notes.svg' className='w-9 h-9'></img>
          </button>
        </div>
      </>
    )
  }

  if (state === 'docList') {
    return (
      <>
        <button className='font-handwriting mb-1' onClick={() => setState('categories')}>{'< back'}</button>
        <Title title='Add Document' />
        <div className=' flex flex-col font-handwriting text-xl max-h-[150px] overflow-y-scroll p-2'>
          {documents.map((doc) => <button onClick={() => createReference(doc.id, doc.name, doc.type)} className='p-1 group relative' key={doc.id}>
            {doc.name}
            <div className='absolute inset-x-0 h-[1px] scale-x-0 group-hover:scale-x-100 transition-all origin-left'>
              <img className='w-full h-[2px]' src='/bottom_line.svg'></img>
            </div>
          </button>)}
          {documents.length < 1 && <div>No documents found.</div>}
        </div>

      </>
    )
  }
}

