import styles from './Loader.module.css'

export default function Loader(props) {
    if (props.centred) return <div className='fixed inset-0 flex justify-center items-center pointer-events-none'>
        <div className={styles.ripple}><div></div><div></div></div>
    </div>
    else return <div className={styles.ripple}><div></div><div></div></div>

}