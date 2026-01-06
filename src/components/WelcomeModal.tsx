"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const startButtonRef = useRef<HTMLButtonElement>(null);
    const [isClient, setIsClient] = useState(false);

    // Handler functions - simplified
    const closeModal = () => {
        onClose();
    };

    // Ensure component is mounted on client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Focus management
    useEffect(() => {
        if (isOpen && isClient && startButtonRef.current) {
            const timer = setTimeout(() => {
                startButtonRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isClient]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                event.preventDefault();
                closeModal();
            }
        };

        if (isOpen && isClient) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose, isClient]);

    if (!isClient || !isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm overlay-animate-in"
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-md mx-auto modal-animate-in"
                role="dialog"
                aria-modal="true"
                aria-labelledby="welcome-title"
            >
                <div className="relative bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
                    {/* Header without close button */}
                    <div className="text-center p-6 pb-4">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-900">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                        </div>
                        <h2 id="welcome-title" className="text-xl font-semibold text-neutral-100 font-[var(--font-display)]">
                            ¡Nos da Gusto tenerte aquí!
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                        <div className="space-y-4">
                            {/* Welcome message */}
                            <div className="text-center space-y-3">
                                <p className="text-neutral-200 leading-relaxed text-[15px]">
                                    Hola, Bienvenido a <span className="font-semibold text-[#d4af37]">Magnolias</span>, este es tu menú digital para ordenarle al mesero tus bebidas y alimentos.
                                </p>
                            </div>

                            {/* Decorative divider */}
                            <div className="flex items-center gap-3 py-2">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>

                            {/* Action button */}
                            <div className="text-center pt-2">
                                <button
                                    ref={startButtonRef}
                                    onClick={closeModal}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8941f] hover:from-[#e6c547] hover:to-[#d4af37] text-neutral-900 font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:ring-offset-2 focus:ring-offset-neutral-900"
                                    type="button"
                                >
                                    <span>Comenzar</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#d4af37]/10 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-petroleo/20 to-transparent rounded-full blur-xl"></div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default WelcomeModal;