import React, { useEffect, useState, useRef } from "react"
import { createPortal } from 'react-dom'
import { useEnsureBrowserPaintsBeforeEffect } from '../../lib/hooks'

export function Modal(props) {
    const [isOpen, setIsOpen] = useState(false)

    const portal = useRef()
    const [mounted, setMounted] = useState(false)

    useEnsureBrowserPaintsBeforeEffect(() => {
        if (mounted) setIsOpen(true)
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
        <div className={`fixed inset-0 flex justify-center items-center`}>

            <div
                className={`fixed inset-0 transition-all duration-300 backdrop-blur-sm
            ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={hide}>
            </div>

            <div
                className={`relative bg-orange-300 bg-opacity-10 backdrop-blur-md p-6 rounded-xl shadow-lg transition-all
            ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                {React.Children.map(props.children, (child) =>
                    React.cloneElement(child, { hide })
                )}
            </div>

        </div>
        , portal.current) : null
}

