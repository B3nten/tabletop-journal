import Tiptap from '../../../../components/Tiptap'
import { useCharacter } from '../../../../lib/database'
import { useState } from 'react'
import supabase from '../../../../lib/supabase'
import { AuthCheck } from '../../../../components/AuthGuard'
import { Navigation } from '../../../../components/Navigation'

export default function CharacterPage() {

    const [saving, setSaving] = useState('')
    const character = useCharacter()

    async function updateCharacter() {
        setSaving('saving')
        const { data, error } = await supabase.from('characters').update({ name: 'Big Bron' }).eq('character_id', '77')
        if(error){
            setSaving('error')
        }else{
            setTimeout(() => setSaving('saved'), 1000)
        }
    }

    return (
        <div>
            <Navigation title={character?.name || 'Character'}/>
            <AuthCheck>
                <Tiptap content={character?.bio?.content || '<p></p>'} callback={updateCharacter} saving={saving} />
                <button className='btn-primary' onClick={updateCharacter}>Update Character</button>
            </AuthCheck>
        </div>
    )
}




