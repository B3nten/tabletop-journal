import { useEffect, useState, useRef } from "react"
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'
import { useEnsureBrowserPaintsBeforeEffect } from '../../lib/hooks'

export function Modal(props) {
    const [isOpen, setIsOpen] = useState(false)
    const container = useRef(null)
    const parchment = useRef(null)

    const portal = useRef()
    const [mounted, setMounted] = useState(false)

    useEnsureBrowserPaintsBeforeEffect(() => {
        if (mounted) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    parchment?.current?.style.height = (window.getComputedStyle(entry.target).height)
                }
            })
            setIsOpen(true)
            resizeObserver.observe(container.current)
            return () => {
                resizeObserver.disconnect()
            }
        }
    }, [mounted])

    useEffect(() => {
        portal.current = document.querySelector('#modal')
        setMounted(true)
}, [])

    function hide() {
        setIsOpen(false)
        setTimeout(() => props.hide(), 300)
    }
    return mounted ? createPortal(
        <div className={`fixed inset-0 flex justify-center items-center transition-all duration-300 backdrop-blur-sm bg-gray/30 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className='fixed inset-0' onClick={hide}></div>
            {/* <div>{props.children}</div> */}
            <div className='relative'>
                <div ref={parchment} className={styles.parchment}></div>
                <div ref={container} className={styles.container}>
                    {props.children}
                </div>
            </div>
        </div>
        , portal.current) : null
}
