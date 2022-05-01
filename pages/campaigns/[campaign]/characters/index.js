import { useState, useRef } from 'react'
import { AuthCheck } from '../../../../components/AuthGuard'
import { Navigation, AddButton } from '../../../../components/Navigation'
import supabase from '../../../../lib/supabase'
import Loader from '../../../../components/Loader/Loader'
import { useCampaignID, useCharacterList } from '../../../../lib/database'
import { Modal, Title } from '../../../../components/Modal'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { Metatags } from '../../../../components/Metatags'

export default function CharactersPage() {
    const [newCharacterModalOpen, setNewCharacterModalOpen] = useState(false)
    return (
        <div>
            <Metatags title='Characters' />
            {newCharacterModalOpen && <Modal hide={setNewCharacterModalOpen}><CreateCharacterModal/></Modal>}
            <Navigation title='Characters'>
                <AddButton onClick={() => setNewCharacterModalOpen(true)} />
            </Navigation>
            <AuthCheck>
                <CharacterList type='Player' />
            </AuthCheck>
        </div>
    )
}

function CharacterList(props) {
    const [newCharacterModalOpen, setNewCharacterModalOpen] = useState(false)
    const characters = useCharacterList()

    return (<>
        {newCharacterModalOpen && <Modal hide={setNewCharacterModalOpen}><CreateCharacterModal /></Modal>}
        <div className='grid lg:grid-cols-2 gap-16'>
            <div>
                <div className='mb-10'>
                    <h2 className='font-fancy text-6xl'>Party</h2>
                </div>
                {characters.loaded ? characters.list.length > 0 ?
                    characters.list.filter(ch => ch.type === 'Player')
                        .map((ch) =>
                            <CharacterListItem
                                name={ch.name}
                                level={ch.level}
                                race={ch.race}
                                class={ch.class}
                                key={ch.character_id}
                                id={ch.character_id}>
                            </CharacterListItem>)
                    : <div className='font-handwriting opacity-80 pl-1'>no characters</div>
                    : <Loader />
                }
                {characters.loaded && <button onClick={() =>setNewCharacterModalOpen(true)} className='btn-underline mt-10'>Add Character</button>}
            </div>
            <div>
                <div className='mb-10'>
                    <h2 className='font-fancy text-6xl'>NPCs</h2>
                </div>
                {characters.loaded ? characters.list.length > 0 ?
                    characters.list.filter(ch => ch.type === "Friendly NPC" || ch.type === "Enemy NPC")
                        .map((ch) =>
                            <CharacterListItem
                                name={ch.name}
                                level={ch.level}
                                race={ch.race}
                                class={ch.class}
                                key={ch.character_id}
                                id={ch.character_id}>
                            </CharacterListItem>)
                    : <div className='font-handwriting opacity-80 pl-1'>no characters</div>
                    : <Loader />
                }
            </div>
        </div>
    </>)
}

function CharacterListItem(props) {
    const router = useRouter()
    const campaign = useCampaignID()
    return (
        <div onClick={() => router.push(`/campaigns/${campaign}/characters/${props.id}`)} className='flex flex-col items-start mt-8 space-y-1 cursor-pointer hover:scale-105 hover:translate-x-[5%] transition-all'>
            <div className='text-3xl font-handwriting'>{props.name}</div>
            {props.level || props.race || props.class ?
                <div className='flex space-x-1 text-lg font-handwriting'>
                    <div>
                        {props.level && 'Level '}
                        {props.level}
                    </div>
                    <div>
                        {props.race}
                    </div>
                    <div>
                        {props.class}
                    </div>
                </div> : null}
            <img alt='' className='w-full h-1 opacity-20' src='/bottom_line.svg' />
        </div>
    )
}

function CreateCharacterModal(props) {

    const name = useRef()
    const type = useRef()
    const campaign_id = useCampaignID()
    const router = useRouter()

    async function createCharacter(e) {
        e.preventDefault()
        const parsedName = name.current.value === '' ? 'Harry Otter' : name.current.value
        let { data, error } = await supabase
            .from('characters')
            .insert({ name: parsedName, type: type.current.value, campaign_id: campaign_id })
            .single()
        if (error) {
            toast.error(error.message)
        } else {
            props.hide()
            router.push(`/campaigns/${campaign_id}/characters/${data.character_id}`)
        }
    }

    return (
        <div>
            <Title title='Add Character'></Title>
            <div className="flex flex-col space-y-4">
                <div>
                    <lable htmlFor='name' className='font-handwriting text-lg'>Name: </lable>
                    <input name='name' placeholder='Harry Otter' ref={name}></input>
                </div>
                <div>
                    <lable htmlFor='type' className='font-handwriting text-lg'>Type: </lable>
                    <select name='type' selected={props.selection} placeholder='Harry Otter' ref={type} className="bg-transparent font-handwriting">
                        <option value='Player'>Player</option>
                        <option value='Friendly NPC'>Friendly NPC</option>
                        <option value='Enemy NPC'>Enemy NPC</option>
                    </select>
                </div>
                <button className='btn-xs' onClick={createCharacter}>Create Character</button>
            </div>
        </div>
    )
}