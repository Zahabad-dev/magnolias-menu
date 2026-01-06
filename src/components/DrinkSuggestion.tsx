"use client";
import React, { useState } from 'react';
import { useSelection } from '@/context/SelectionContext';
import { MenuItem } from '@/data/menu';

interface DrinkSuggestionProps {
  onClose: () => void;
  onNavigate: (slug: string) => void;
  enableAcompanante?: boolean;
  remainingAcompanantes?: number;
  totalPaqueteQty?: number;
  showBeverageSection?: boolean;
  dessertMode?: boolean;
  dessertRemaining?: number;
  dessertTotal?: number;
  generalDishSuggestion?: boolean;
  dishName?: string;
  currentSlug?: string;
}

const DRINK_OPTIONS: Array<{ label: string; slug: string; desc: string; emoji?: string }> = [
  { label: 'Bebidas Calientes', slug: 'cafe', desc: 'Cafés & tés' },
  { label: 'Bebidas Refrescantes', slug: 'bebidas-refrescantes', desc: 'Limonadas, jugos y más' },
  { label: 'Mixología', slug: 'mixologia', desc: 'Cocteles & creaciones' },
  { label: 'Vinos y Licores', slug: 'vinos-licores', desc: 'Selección especial' }
];

const ACOMPANANTES: Array<{ id: string; nombre: string; descripcion: string }> = [
  { id: 'acompanante-fruta', nombre: 'Fruta', descripcion: 'Porción fresca' },
  { id: 'acompanante-jugo-naranja', nombre: 'Jugo de Naranja', descripcion: 'Natural' },
  { id: 'acompanante-limonada', nombre: 'Limonada', descripcion: 'Refrescante' }
];

import { useEffect, useRef } from 'react';
const DrinkSuggestion: React.FC<DrinkSuggestionProps> = ({ onClose, onNavigate, enableAcompanante, remainingAcompanantes = 0, totalPaqueteQty = 0, showBeverageSection, dessertMode = false, dessertRemaining = 0, dessertTotal = 0, generalDishSuggestion = false, dishName, currentSlug }) => {
  const { add, items } = useSelection();
  const [lastPicked, setLastPicked] = useState<string | null>(null);

  // Calcular progreso acompañantes (suma de qty de acompañantes)
  const acompananteQty = items.filter(i => i.id.startsWith('acompanante-')).reduce((s, r) => s + r.qty, 0);
  const completedAcompanantes = Math.min(acompananteQty, totalPaqueteQty);
  const progress = totalPaqueteQty > 0 ? completedAcompanantes / totalPaqueteQty : 0;

  const selectAcompanante = (id: string) => {
    setLastPicked(id);
    const found = ACOMPANANTES.find(a => a.id === id);
    if (found) {
      const item: MenuItem = { id: found.id, nombre: found.nombre, descripcion: found.descripcion, precio: 0 };
      add(item, 'paquetes');
    }
  };

  // En lugar de cerrar automáticamente, al completar acompañantes desplazamos y enfocamos el botón "Listo"
  const prevRemainingRef = useRef(remainingAcompanantes);
  const footerRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [completedFlash, setCompletedFlash] = useState(false);
  useEffect(() => {
    if (enableAcompanante && currentSlug === 'paquetes' && prevRemainingRef.current > 0 && remainingAcompanantes === 0) {
      if (footerRef.current) {
        footerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setCompletedFlash(true);
        // Leyenda más duradera (4.5s)
        setTimeout(() => setCompletedFlash(false), 4500);
        setTimeout(() => footerRef.current?.focus({ preventScroll: true }), 550);
      }
    }
    prevRemainingRef.current = remainingAcompanantes;
  }, [remainingAcompanantes, enableAcompanante, currentSlug]);

  // Ahora permitimos cerrar siempre para interacción más orgánica
  const canClose = true;
  const closingRef = useRef(false);

  // Scroll helper para llevar al usuario nuevamente al carrusel (o al top)
  const scrollToCarousel = () => {
    try {
      const root = document.querySelector('[data-carousel-root]') as HTMLElement | null;
      if (root) {
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {/* noop */ }
  };

  const handleClose = () => {
    if (closingRef.current) return; // evita dobles
    closingRef.current = true;
    onClose();
    // Pequeño delay para permitir estado / desmontaje antes del scroll
    setTimeout(scrollToCarousel, 30);
  };

  const handleNavigate = (slug: string) => {
    if (closingRef.current) return;
    closingRef.current = true;
    onNavigate(slug);
    onClose();
    // Scroll directo al top de la página después de navegar
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Cerrar con Escape (cuando está permitido)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (canClose) {
          e.preventDefault();
          handleClose();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [canClose]);

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-6 animate-fade-up-soft" role="dialog" aria-modal="true" aria-label="Recomendación complementaria">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div ref={scrollContainerRef} className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#d4af37]/35 bg-neutral-950/85 backdrop-blur-xl shadow-[0_8px_40px_-6px_rgba(0,0,0,0.75)] ring-1 ring-black/50">
        <div className="absolute -inset-px rounded-3xl pointer-events-none bg-[radial-gradient(circle_at_80%_10%,rgba(212,175,55,0.3),transparent_70%)]" />
        <div className="px-6 pt-8 pb-10 space-y-10 relative">
          <header className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f8e8bf] font-[var(--font-display)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              {remainingAcompanantes > 0
                ? 'Elige tu acompañante'
                : dessertMode
                  ? 'Acompaña tu postre'
                  : generalDishSuggestion
                    ? 'Sugerencia de bebida'
                    : 'Completa tu elección'}
            </h2>
            <p className="text-sm md:text-[15px] leading-relaxed text-neutral-300 max-w-2xl">
              {remainingAcompanantes > 0
                ? `Aún puedes elegir ${remainingAcompanantes === 1 ? 'un acompañante' : remainingAcompanantes + ' acompañantes'} para tus paquetes (puedes cerrar ahora).`
                : dessertMode
                  ? (dessertRemaining > 0
                    ? `Te sugerimos agregar ${dessertRemaining === 1 ? 'una bebida' : dessertRemaining + ' bebidas'} para ${dessertTotal === 1 ? 'tu postre' : 'tus postres'}. No es obligatorio.`
                    : 'Disfruta tu postre con la bebida perfecta.')
                  : generalDishSuggestion
                    ? `Añade una bebida para acompañar${dishName ? ' “' + dishName + '”' : ''}. Es totalmente opcional.`
                    : 'Te sugerimos equilibrar tu pedido con una bebida refrescante o caliente. También puedes cerrar esta ventana.'}
            </p>
            {generalDishSuggestion && (
              <div className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-wider text-neutral-400">
                <span className="px-2 py-0.5 rounded-full bg-neutral-800/70 border border-neutral-600/50">Opcional</span>
                <span>Tu pedido continuará igual si cierras.</span>
              </div>
            )}
            {enableAcompanante && totalPaqueteQty > 0 && (
              <div className="mt-4">
                <div className="h-2 rounded-full bg-neutral-700/50 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#b8911a] via-[#d4af37] to-[#f5e3ac] transition-all duration-500" style={{ width: `${progress * 100}%` }} />
                </div>
                <div className="mt-2 text-[11px] tracking-wider text-neutral-400 flex justify-between">
                  <span>Acompañantes: {completedAcompanantes}/{totalPaqueteQty}</span>
                  {remainingAcompanantes > 0 && <span className="text-[#d4af37]">Restantes: {remainingAcompanantes}</span>}
                </div>
              </div>
            )}
          </header>

          {enableAcompanante && currentSlug === 'paquetes' && (
            <section className="space-y-4">
              <h3 className="text-[13px] uppercase tracking-[0.25em] text-[#d4af37]/85 font-semibold">Acompañante del paquete</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ACOMPANANTES.map(a => {
                  const active = lastPicked === a.id && remainingAcompanantes !== totalPaqueteQty; // simple resaltado último
                  return (
                    <button
                      key={a.id}
                      onClick={() => selectAcompanante(a.id)}
                      className={`group relative rounded-2xl px-4 py-4 text-left border transition-all duration-400 backdrop-blur-sm ${active ? 'border-[#d4af37] bg-gradient-to-br from-[#2a2313] to-[#3a3019] shadow-[0_0_0_1px_#d4af37,0_6px_18px_-4px_rgba(0,0,0,0.65)]' : 'border-neutral-600/50 bg-neutral-800/40 hover:border-[#d4af37]/60 hover:bg-neutral-800/70'} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[15px] text-[#f3e2b2] font-[var(--font-display)]">{a.nombre}</span>
                        {active && <span className="text-[#d4af37] text-sm font-bold tracking-wide">＋</span>}
                      </span>
                      <span className="block mt-1 text-[12px] text-neutral-400 group-hover:text-neutral-300">{a.descripcion}</span>
                      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-[#d4af37]/40" />
                    </button>
                  );
                })}
                {/* Opción sin acompañante */}
                <button
                  onClick={() => {
                    if (closingRef.current) return;
                    setLastPicked('none');
                    // Auto-cerrar inmediatamente: el usuario indica que no agregará más acompañantes
                    setTimeout(() => handleClose(), 10);
                  }}
                  className={`group relative rounded-2xl px-4 py-4 text-left border transition-all duration-400 backdrop-blur-sm ${lastPicked === 'none' ? 'border-red-400/70 bg-gradient-to-br from-[#3a1d1d] to-[#2a1818] shadow-[0_0_0_1px_#b85555,0_6px_18px_-4px_rgba(0,0,0,0.65)]' : 'border-neutral-600/50 bg-neutral-800/40 hover:border-red-300/50 hover:bg-neutral-800/70'} focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300/50`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[15px] text-[#f3e2b2] font-[var(--font-display)]">Sin acompañante</span>
                    {lastPicked === 'none' && <span className="text-red-300 text-sm font-bold tracking-wide">–</span>}
                  </span>
                  <span className="block mt-1 text-[12px] text-neutral-400 group-hover:text-neutral-300">Ignorar esta vez</span>
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-red-300/40" />
                </button>
              </div>
            </section>
          )}

          {showBeverageSection && (
            <section className="space-y-5">
              <h3 className="text-[13px] uppercase tracking-[0.25em] text-[#d4af37]/85 font-semibold">Explora bebidas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DRINK_OPTIONS.map(opt => {
                  const recommended = opt.slug === 'cafe' && dessertMode;
                  return (
                    <button
                      key={opt.slug}
                      onClick={() => handleNavigate(opt.slug)}
                      className={`group relative flex flex-col items-start gap-2 rounded-2xl border ${recommended ? 'border-[#d4af37] ring-1 ring-[#d4af37]/50 shadow-[0_0_0_1px_#d4af37,0_6px_18px_-6px_rgba(0,0,0,0.7)]' : 'border-[#d4af37]/40'} bg-neutral-800/40 hover:bg-neutral-800/70 px-5 py-5 transition shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_4px_12px_-3px_rgba(0,0,0,0.55)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.55),0_8px_20px_-5px_rgba(0,0,0,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60`}
                    >
                      <span className="text-[15px] font-semibold text-[#f3e2b2] tracking-wide font-[var(--font-alt-display)] flex items-center gap-2">
                        {opt.label}
                        {recommended && <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-b from-[#e5cf88] via-[#d4af37] to-[#b28714] text-[#241a05] font-bold tracking-wider">Recomendado</span>}
                      </span>
                      <span className="text-[12px] text-neutral-400 group-hover:text-neutral-300 leading-snug">{opt.desc}</span>
                      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-[#d4af37]/40" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <footer className="flex flex-col items-center justify-center gap-5 pt-6 border-t border-neutral-700/40">
            {remainingAcompanantes === 0 ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <button
                  ref={footerRef}
                  onClick={handleClose}
                  className={`group relative inline-flex items-center justify-center rounded-full px-8 py-3 text-[15px] font-semibold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5e3a4]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 transition-all duration-400
                    bg-gradient-to-b from-[#f4e2ab] via-[#e0c468] to-[#b68a17] text-[#2a2107] shadow-[0_0_0_1px_rgba(0,0,0,0.55),0_6px_18px_-4px_rgba(0,0,0,0.65),0_0_0_6px_rgba(212,175,55,0.22)] hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.55),0_10px_28px_-6px_rgba(0,0,0,0.7),0_0_0_8px_rgba(212,175,55,0.3)] active:scale-[0.96]
                    ${completedFlash ? 'animate-[pulse_1.2s_ease-in-out_3] ring-2 ring-[#d4af37]/70 shadow-[0_0_0_2px_#d4af37,0_0_25px_0_rgba(212,175,55,0.55)]' : ''}`}
                  aria-label={dessertMode && dessertRemaining > 0 ? 'Cerrar sugerencia' : 'Cerrar y continuar'}
                >
                  <span className="relative z-10 drop-shadow-sm">{dessertMode && dessertRemaining > 0 ? 'Cerrar' : 'Listo'}</span>
                  <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
                </button>
                {completedFlash && (
                  <div className="flex flex-col items-center gap-2 animate-fade-up-soft" aria-live="polite">
                    <span className="text-[12px] font-medium text-[#f5e3ac] tracking-wide flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#d4af37] animate-ping" />
                      Acompañantes completos ✓
                    </span>
                    <span className="text-[10px] text-neutral-400">Pulsa “Listo” para continuar</span>
                  </div>
                )}
              </div>
            ) : lastPicked === 'none' ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <button
                  onClick={handleClose}
                  className="group relative inline-flex items-center justify-center rounded-full px-8 py-3 text-[15px] font-semibold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5e3a4]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 transition-all duration-400 bg-neutral-800/70 text-neutral-200 border border-neutral-600/60 hover:bg-neutral-700/70 hover:text-white active:scale-[0.96]"
                  aria-label="Cerrar y continuar"
                >
                  <span className="relative z-10 drop-shadow-sm">Listo</span>
                </button>
                <span className="text-[10px] text-neutral-400">Continuar sin acompañantes</span>
              </div>
            ) : (
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37]">Selecciona los acompañantes restantes</span>
            )}
          </footer>
        </div>
        <div className="pointer-events-none h-[4px] w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>
    </div>
  );
};

export default DrinkSuggestion;
