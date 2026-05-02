import { useEffect, useRef } from "react";

interface HamburgerDrawerProps {
    isOpen: boolean,
    onClose: () => void;
}

const HamburgerDrawer = ({ isOpen, onClose }: HamburgerDrawerProps) => {
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        if (isOpen) document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen, onClose])


    const modules = [
        { icon: '📚', label: 'Course Builder', active: true },
        { icon: '🎯', label: 'Assessments' },
        { icon: '📊', label: 'Analytics' },
        { icon: '⚙️', label: 'Settings' },
    ]

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/20 z-20" onClick={onClose} />
            )}

            <div
                ref={drawerRef}
                className={`fixed top-0 h-full w-64 bg-white shadow-xl z-30 transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">Modules</span>
                        <button
                            onClick={onClose}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <nav className="p-2">
                    {modules.map(m => (
                        <button
                            key={m.label}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left
                    ${m.active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                            <span>{m.icon}</span>
                            <span>{m.label}</span>
                            {m.active && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </>
    )
}

export default HamburgerDrawer;