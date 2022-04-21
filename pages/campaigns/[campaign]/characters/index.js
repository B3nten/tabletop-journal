import { useState } from 'react'
import { AuthCheck } from '../../../../components/AuthGuard'
import { Navigation, AddButton } from '../../../../components/Navigation'

import { useRouterQuery } from '../../../../lib/hooks'
import toast from 'react-hot-toast'
import supabase from '../../../../lib/supabase'
import Loader from '../../../../components/Loader/Loader'
import { useCharacterList } from '../../../../lib/database'

export default function CharactersPage() {

    return (
        <div>
            <Navigation title='Characters'>
                <AddButton />
            </Navigation>
            <AuthCheck>
                <CharacterList type='Player' />
            </AuthCheck>
        </div>
    )
}

function CharacterList() {

    const characterList = useCharacterList()

    return (<>
        <div className='grid lg:grid-cols-2 gap-16'>
            <div>
                <div className='mb-10'>
                    <h2 className='font-fancy text-6xl'>Party</h2>
                </div>
                <img className='w-full h-1 opacity-20' src='/bottom_line.svg' />

                {characterList === null ? <Loader /> : characterList.error? <div>No characters found.</div> : characterList.map((ch) =>
                    <CharacterListItem name={ch.name} level={ch.level} race={ch.race} class={ch.class} key={ch.character_id}></CharacterListItem>)
                }
                <button className='btn-underline mt-10'>Add player</button>
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