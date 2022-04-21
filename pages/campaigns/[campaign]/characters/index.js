import { useState, useRef } from 'react'
import { AuthCheck } from '../../../../components/AuthGuard'
import { Navigation, AddButton } from '../../../../components/Navigation'
import supabase from '../../../../lib/supabase'
import Loader from '../../../../components/Loader/Loader'
import { useCampaignID, useCharacterList } from '../../../../lib/database'
import { Modal, Title } from '../../../../components/Modal'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
import Link from 'next/link'

export default function CharactersPage() {
    const [newCharacterModalOpen, setNewCharacterModalOpen] = useState(false)
    const campaign = useCampaignID()
    return (
        <div>
            {newCharacterModalOpen && <Modal hide={setNewCharacterModalOpen}><CreateCharacterModal /></Modal>}
            <Navigation title='Characters'>
                <AddButton onClick={() => setNewCharacterModalOpen(true)} />
            </Navigation>
            <AuthCheck>
                <CharacterList type='Player' />
                <Link href={`/campaigns/${campaign}/characters/75`}><button>75</button></Link>
            </AuthCheck>
        </div>
    )
}

function CharacterList(props) {
    const [newCharacterModalOpen, setNewCharacterModalOpen] = useState(false)

    const characterList = useCharacterList()

    return (<>
        {newCharacterModalOpen && <Modal hide={setNewCharacterModalOpen}><CreateCharacterModal /></Modal>}
        <div className='grid lg:grid-cols-2 gap-16'>
            <div>
                <div className='mb-10'>
                    <h2 className='font-fancy text-6xl'>Party</h2>
                </div>
                {/* <img className='w-full h-1 opacity-20' src='/bottom_line.svg' /> */}

                {characterList === null ? <Loader /> : characterList.error ? <div>No characters found.</div> : characterList.map((ch) =>
                    <CharacterListItem name={ch.name} level={ch.level} race={ch.race} class={ch.class} key={ch.character_id}></CharacterListItem>)
                }
                <button onClick={() => setNewCharacterModalOpen(true)} className='btn-underline mt-10'>Add player</button>
            </div>
        </div>
    </>)
}

function CharacterListItem(props) {
    return (
        <div className='flex flex-col items-start mt-8 space-y-1 cursor-pointer hover:scale-105 hover:translate-x-[5%] transition-all'>
            <div className='text-3xl font-handwriting'>{props.name}</div>
            {props.level || props.race || props.class ?
                <div className='flex space-x-1 text-lg'>
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
            <img className='w-full h-1 opacity-20' src='/bottom_line.svg' />
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
                    <lable for='name' className='font-handwriting text-lg'>Name: </lable>
                    <input name='name' placeholder='Harry Otter' ref={name}></input>
                </div>
                <div>
                    <lable for='type' className='font-handwriting text-lg'>Type: </lable>
                    <select name='type' placeholder='Harry Otter' ref={type} className="bg-transparent font-handwriting">
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