import { useClientRouter } from '../../lib/hooks'
import Link from 'next/link'

//takes props.documents as an array of documents

export default function DocumentList(props) {
	const router = useClientRouter()
	const page = router.pathname.substring(router.pathname.lastIndexOf('/') + 1)
	if (props.documents.length === 0) return <div className='text-sm italic'>no documents found</div>
	return (
		<>
			{props.documents.map((doc) => (
				<div className='' key={doc.id}>
					<Link href={`/campaigns/${router.query.campaign}/${page}/${doc.id}`}>
						<a className='block text-2xl font-handwriting leading-none transition-all space-y-1'>
							<div className='relative inline-block group'>{doc.name}
								<div className='absolute inset-x-0 h-[1px] scale-x-0 group-hover:scale-x-100 transition-all origin-left'>
									<img className='w-full h-[2px]' src='/bottom_line.svg'></img>
								</div>
							</div>
							<div className='flex items-center space-x-4 '>
								<div className='text-sm leading-none'>{doc.type}</div>
								<div className='flex items-center space-x-2 hidden'>
									<img src='/icons/pin.svg' className='w-5 h-5 scale-0 group-hover:scale-100 transition-all'></img>
									<img src='/icons/gear.svg' className='w-4 h-4 opacity-70 scale-0 group-hover:scale-100 transition-all'></img>
								</div>
							</div>
						</a>
					</Link>
				</div>
			))}
		</>
	)
}