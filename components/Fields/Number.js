import { useState, useEffect, useCallback } from "react"
import debounce from "lodash.debounce"
import supabase from "../../lib/supabase"

export default function String(props) {

    const [input, setInput] = useState(props.value)
    const [saving, setSaving] = useState('')

    useEffect(() => setInput(props.value), [props.value])

    function handleInput(el) {
        setInput(el.target.value)
        setSaving('saving')
        callback(el)
    }

    const callback = useCallback(debounce((el) => {
        if (el.target.value === '') {
            updateField(null)
        } else {
            updateField(el.target.value)
        }
    }, 1000), [])

    async function updateField(value) {
        setSaving('saving')
        const { error } = await supabase.from(props.from).update({ [props.update]: value }).eq(props.eq[0], props.eq[1])
        if (error) {
            setSaving('error')
            console.log(error)
        } else {
            setSaving('saved')
            setInput(value)
        }
    }

    return (<>

        <div className='font-handwriting'>
            <div className='text-2xl pl-2 mb-1'>{props.title}</div>
            <input
                name='name'
                type='number'
                className='border-none text-4xl bg-[rgb(251_190_36)] bg-opacity-[.15] w-24'
                placeholder={props.placeholder}
                value={input}
                onChange={(el) => handleInput(el)}
            />
                        <div className="translate-x-2">
                {saving === '' && <div className='text-sm text-blue-500 font-handwriting opacity-0'>loading</div>}
                {saving === 'saving' && <div className='text-sm text-blue-500 font-handwriting animate-pulse'>saving...</div>}
                {saving === 'saved' && <div className='text-sm text-green-500 font-handwriting'>saved</div>}
                {saving === 'error' && <div className='text-sm text-red-500 font-handwriting'>error: not saved</div>}
            </div>
        </div>

    </>)
}