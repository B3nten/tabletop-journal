import { AuthCheck } from '../../../../components/AuthGuard'
import { Navigation } from '../../../../components/Navigation'
import { useCharacter } from '../../../../lib/database'
import Loader from '../../../../components/Loader/Loader'
import { String, Richtext, Number, Select } from '../../../../components/Fields'
import { useState } from 'react'
import { Modal, Title } from '../../../../components/Modal'
import toast from 'react-hot-toast'
import { useClientRouter } from '../../../../lib/hooks'
import supabase from '../../../../lib/supabase'
import { Metatags } from '../../../../components/Metatags'


export default function CharacterPage() {
    const character = useCharacter()
    const [deleteCharacter, setDeleteCharacter] = useState(false)

    return (
        <div>
            <Metatags title={character.name || 'Character'} />
            <Navigation title={character.loaded ? character.name : ' '} loggedOut='Character' />
            <AuthCheck>
                {deleteCharacter && character.loaded && <Modal hide={() => setDeleteCharacter(false)}><DeleteCharacter character={character} /></Modal>}
                {!character.loaded && <Loader centred />}
                {character.loaded && !character.isData && <div>Character not found</div>}
                {character.loaded && character.isData &&
                    <div className="space-y-10">
                        <div className="grid md:grid-cols-2">
                            <String
                                value={character.name}
                                title='Name'
                                placeholder='Dairy Potter'
                                from='characters'
                                update='name'
                                eq={['character_id', character.character_id]}
                            />
                            <div className='flex flex-col sm:flex-row space-x-4'>
                                <Select
                                    value={character.type}
                                    title='Type'
                                    from='characters'
                                    update='type'
                                    options={[
                                        { option: 'Player', title: 'Player' },
                                        { option: 'Friendly NPC', title: 'Friendly NPC' },
                                        { option: 'Enemy NPC', title: 'Enemy NPC' },
                                    ]}
                                    eq={['character_id', character.character_id]}
                                />
                                <Number
                                    value={character.level}
                                    title='Level'
                                    placeholder='1'
                                    from='characters'
                                    update='level'
                                    eq={['character_id', character.character_id]}
                                />
                            </div>
                            <String
                                value={character.race}
                                title='Race'
                                placeholder='Goblin'
                                from='characters'
                                update='race'
                                eq={['character_id', character.character_id]}
                            />
                            <String
                                value={character.class}
                                title='Class'
                                placeholder='Wizard'
                                from='characters'
                                update='class'
                                eq={['character_id', character.character_id]}
                            />
                        </div>
                        <Richtext
                            title='Biography'
                            content={character.bio?.content || <p></p>}
                            from='characters'
                            update={['bio', 'bio_text']}
                            eq={['character_id', character.character_id]} />
                        <button className='btn-underline mt-10' onClick={() => setDeleteCharacter(true)}>Delete Character</button>
                    </div>
                }
            </AuthCheck>
        </div>
    )
}

function DeleteCharacter(props) {
    const router = useClientRouter()

    async function deleteCharacter() {
        console.log(props.character.character_id)
        const { error } = await supabase.from('characters').delete().eq('character_id', props.character.character_id)
        if(!error){
            toast.success('Character Deleted')
            router.back()
        }else{
            toast.error(error.message)
        }
    }

    return (
        <div className='flex flex-col'>
            <Title title={`Delete ${props.character.name} ?`} />
            <p className='text-red-500 mb-5'>This action cannot be undone.</p>
            <button onClick={deleteCharacter} className='btn-small'>Delete</button>
        </div>
    )
}


