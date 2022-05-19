import { useSession } from '../../lib/authentication'
import { useClientRouter } from '../../lib/hooks'
import styles from './toolbar.module.css'
import Link from 'next/link'
import { useCampaign } from '../../lib/database'

export default function Toolbar() {
  const session = useSession()
  const router = useClientRouter()

  // !session.loading prevents hydration errors, could also check if mounted
  if (session && !session.loading && router.query?.campaign ) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.toolbar}>
        <Link href={`/campaigns/${router.query.campaign}/sessions`}>
            <button className={styles.button}>
              <img src='/icons/sessions.svg' title='Sessions' />
            </button>
          </Link>
          <Link href={`/campaigns/${router.query.campaign}/characters`}>
            <button className={styles.button}>
              <img src='/icons/characters.svg' title='Characters' />
            </button>
          </Link>
          <Link href={`/campaigns/${router.query.campaign}/locations`}>
            <button className={styles.button}>
              <img src='/icons/locations.svg' title='Locations' />
            </button>
          </Link>
          <Link href={`/campaigns/${router.query.campaign}/items`}>
            <button className={styles.button}>
              <img src='/icons/items.svg' title='Items' />
            </button>
          </Link>
          <Link href={`/campaigns/${router.query.campaign}/lore`}>
            <button className={styles.button}>
              <img src='/icons/lore.svg' title='Lore' />
            </button>
          </Link>
          <Link href={`/campaigns/${router.query.campaign}/dreams`}>
            <button className={styles.button}>
              <img src='/icons/dreams.svg' title='Dreams' />
            </button>
          </Link>
          <Link href={`/campaigns/${router.query.campaign}/events`}>
            <button className={styles.button}>
              <img src='/icons/events.svg' title='Events' />
            </button>
          </Link>
          <Link href={`/campaigns/${router.query.campaign}/other`}>
            <button className={styles.button}>
              <img src='/icons/other-notes.svg' title='Other Notes' />
            </button>
          </Link>
        </div>
      </div>
    )
  } else return null
}
