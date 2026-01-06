"use client";
import React, { useEffect, useState } from 'react';

const ScrollTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > 220); // aparece después de bajar un poco
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-5 right-4 z-[980] transition-all duration-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-3'}`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <button
        type="button"
        onClick={() => {
          // Disparar evento para cerrar todos los subgrupos
          window.dispatchEvent(new CustomEvent('closeAllGroups'));
          // Scroll al top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Regresar al inicio"
        className="group relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-[#c0392b] via-[#e74c3c] to-[#8e44ad] shadow-[0_8px_32px_-8px_rgba(231,76,60,0.7),0_0_0_1px_rgba(255,215,0,0.2)] hover:shadow-[0_16px_40px_-8px_rgba(231,76,60,0.9),0_0_0_2px_rgba(255,215,0,0.4),0_0_20px_rgba(142,68,173,0.3)] focus:outline-none focus-visible:ring-3 focus-visible:ring-[#f39c12]/60 active:scale-95 transition-all duration-300 hover:scale-105 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-[#f1c40f]/30 before:via-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-[#27ae60]/10 to-black/15" />
        <div className="absolute inset-0 rounded-full border border-[#f39c12]/30" />
        <div className="absolute inset-2 rounded-full border border-white/15" />
        <div className="relative flex items-center justify-center h-full w-full">
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            className="text-[#f8c471] drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-all group-hover:-translate-y-0.5 group-hover:text-[#fdeaa7] group-active:scale-90"
            stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_40%_30%,rgba(241,196,15,0.4),transparent_65%)]" />

          {/* Decoración de pétalos de cempasúchil */}
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#f39c12] opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-[#e67e22] opacity-50 group-hover:opacity-90 transition-opacity" />
          <div className="absolute top-0 -left-1 w-1 h-1 rounded-full bg-[#f1c40f] opacity-40 group-hover:opacity-80 transition-opacity" />
        </div>

        {/* Resplandor temático Día de Muertos */}
        <div className="pointer-events-none absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[conic-gradient(from_0deg,transparent,rgba(231,76,60,0.4),transparent,rgba(241,196,15,0.3),transparent,rgba(142,68,173,0.2),transparent)] animate-spin" style={{ animationDuration: '4s' }} />

        {/* Pulso sutil estilo mexicano */}
        <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 bg-[radial-gradient(circle,rgba(241,196,15,0.2),rgba(231,76,60,0.1),transparent)] animate-pulse" style={{ animationDuration: '2s' }} />
      </button>
    </div>
  );
};

export default ScrollTopButton;
