import { useClientRouter } from '../../lib/hooks'
import Link from 'next/link'
import Loader from '../../components/Loader/Loader'
import DocumentList from './DocumentList'

export default function DocumentListPage(props) {
	const recent = props.documents?.data?.slice(0, 3)

	if (!props.documents.loaded) return <Loader centred />
	return (
		<div className='space-y-10'>
			<div className='grid md:grid-cols-2 gap-10'>
				<div>
					<h2 className='text-4xl font-fancy mb-10'>Recent Documents</h2>
					<div className='space-y-4'>
						<DocumentList documents={recent}></DocumentList>
					</div>
				</div>
				<div>
					<h2 className='text-4xl font-fancy mb-10'>Pinned Documents</h2>
					<div className='text-sm italic'>no pinned documents</div>
				</div>
			</div>
			<div className='w-full'>
				<img className='h-1 w-full' src='/bottom_line.svg'></img>
			</div>
			<div>
				<h2 className='text-4xl font-fancy mb-10'>All Documents</h2>
				<div className="grid grid-cols-2 gap-4">
					<DocumentList documents={props.documents.data}></DocumentList>
				</div>
			</div>
		</div>
	)
}

