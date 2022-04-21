import Tiptap from '../../../../components/Tiptap'
import { useCharacter } from '../../../../lib/database'
import { useState } from 'react'

export default function CharacterPage() {
    const [saving, setSaving] = useState(false)

    const character = useCharacter()

    function save(e){
        setSaving(true)
        console.log(e)
        setTimeout(()=>setSaving(false), 1000)
    }

    return (
        <div>
            <Tiptap content={character?.bio.content} callback={(e)=>save(e)} saving={saving} />
        </div>
    )
}