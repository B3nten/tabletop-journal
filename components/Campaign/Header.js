import { useClientRouter } from "../../lib/hooks"
import { useGameSessionList, useAllRecentDocuments } from "../../lib/database"
import Loader from "../Loader/Loader"
import Link from "next/link"
import { newGameSession } from "../../lib/database"

export default function Header() {
    const router = useClientRouter()
    const sessions = useGameSessionList(router.query.campaign)
    const recent = useAllRecentDocuments(router.query.campaign, 3)

    async function newSession() {
        const session = await newGameSession(router.query.campaign)
        router.push(router.asPath + '/sessions/' + session.id)
    }
    console.log(sessions.data)

    return (
        <div className='grid md:grid-cols-2 gap-6 mb-16'>
            <div className='border-drawn p-4 flex flex-col justify-center items-center'>
                {!sessions.loaded && <Loader />}
                {sessions.loaded &&
                    <>
                        <div className='font-handwriting'>Latest Session:</div>
                        <Link href={router.asPath + '/sessions/' + sessions.data.at(0).id}>
                            <a
                                className='font-fancy flex items-center mb-6 hover:scale-[1.02] transition-all'>
                                <span className="text-4xl">Session &nbsp;</span><span className="text-6xl">{sessions.data.length - 1}</span>
                                <img className='w-6 h-6 ml-6 opacity-70' src='/icons/right-arrow.svg'></img>
                            </a>
                        </Link>
                        <button onClick={newSession} className='btn-underline self-start'>New Session {'>'} </button>
                    </>
                }
            </div>
            <div className='border-drawn p-4 flex flex-col justify-center'>
                {!recent.loaded && <Loader />}
                {recent.loaded && recent.isData &&
                    <ul className=''>
                        <div className='font-handwriting text-center'>Latest Documents:</div>
                        {recent.data.map((recent) => <li key={recent.id}>
                            <Link href={router.asPath + '/' + recent.type + ((recent.type === 'lore' || recent.type === 'other') ? '/' : 's/') + recent.id}>
                                <a className="group font-handwriting text-2xl">
                                    {recent.name}
                                    <img className='w-3 h-3 inline-block opacity-80 ml-2 group-hover:translate-x-2 transition-all' src='/icons/right-arrow.svg'></img>
                                </a>
                            </Link>
                        </li>)}
                    </ul>
                }
            </div>
        </div>
    )
}