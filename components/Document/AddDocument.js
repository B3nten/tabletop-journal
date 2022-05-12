import { useRef } from "react"
import { useClientRouter } from "../../lib/hooks"
import { Title } from "../Modal"
import supabase from "../../lib/supabase"
import toast from "react-hot-toast"
//props: takes document type(str)

export default function AddDocument(props) {
	const name = useRef()
	const router = useClientRouter()
	const page = router.pathname.substring(router.pathname.lastIndexOf('/') + 1)

	async function createDocument(e) {
		e.preventDefault()
		const parsedName = name.current.value === '' ? 'name' : name.current.value
		let { data, error } = await supabase
			.from('documents')
			.insert({ name: parsedName, campaign_id: router.query.campaign, type: props.type })
			.single()
		if (error) {
			toast.error(error.message)
		} else {
			props.hide()
			router.push(`/campaigns/${router.query.campaign}/${page}/${data.id}`)
			toast.success('Document Created')
		}
	}

	return (
		<div>
			<Title title={`Add ${props.type}`}></Title>
			<div className="flex flex-col space-y-4">
				<div>
					<label htmlFor='name' className='font-handwriting text-lg'>Name: </label>
					<input name='name' placeholder='name' ref={name}></input>
				</div>
				<button className='btn-xs' onClick={createDocument}>Create {props.type}</button>
			</div>
		</div>
	)
}