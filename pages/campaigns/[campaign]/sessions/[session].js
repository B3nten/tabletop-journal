import { useEffect, useState } from 'react'
import supabase from '../../../../lib/supabase'
import { useClientRouter } from '../../../../lib/hooks'
import { Navigation } from '../../../../components/Navigation'

export default function Session() {
  const router = useClientRouter()
  const [data, setData] = useState([])

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('document_instances')
        .select('*')
        .eq('session_id', router.query.session)
      setData(data)
    })()
  }, [])

  return (
    <div>
      <Navigation title='Session 1' />
      <div className='flex flex-col justify-center max-w-xl mx-auto space-y-8'>
        {data.map((instance) => (
          <Instance key={instance.instance_id} instance={instance} />
        ))}
        <button className='self-center'>
          <img className='w-12 h-12 opacity-80' src='/icons/add-outline.svg' />
        </button>
      </div>
    </div>
  )
}

function Instance({ instance }) {
  return (
    <div className='flex flex-col justify-center items-center space-y-1'>
      <img className='h-12 opacity-30' src='/vertical_line.svg' />
      <div className='w-full flex items-center'>
        <img className='block w-16 h-16 mr-auto pr-2' src='/icons/characters.svg'></img>
        <h2 className='text-3xl font-handwriting'>{instance.name}</h2>{' '}
        <div className='ml-auto pl-2 flex space-x-2'>
          <img className='w-6 h-6 opacity-80' src='/icons/right-arrow.svg' />
          <img className='w-6 h-6 opacity-80' src='/icons/gear.svg' />
        </div>
      </div>
      <textarea className='border-0 w-full bg-opacity-[.15] h-24' />
    </div>
  )
}
