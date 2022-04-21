import styles from './Parchment.module.css'
import { useRef, useEffect } from 'react'

export default function Parchment(props) {
    const container = useRef(null)
    const parchment = useRef(null)
    
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                parchment.current.style.height = (window.getComputedStyle(entry.target).height)
            }
        })
        resizeObserver.observe(container.current)
        return ()=> resizeObserver.disconnect()
    }, [])


    return (
        <div className='relative w-full'>
            <div className={styles.background}></div>
            <div ref={parchment} className={styles.parchment}></div>
            <div ref={container} className={styles.container}>
                {props.children}
            </div>
            <svg className='fixed'>
                <filter id="wavy2">
                    <feTurbulence x="0" y="0" baseFrequency="0.01" numOctaves="5" seed="1"></feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="20" />
                </filter>
            </svg>
        </div>
    )
}