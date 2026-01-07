"use client";
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelection } from '@/context/SelectionContext';
// Modo oscuro fijo: se elimina el toggle

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  // Sólo sombra al hacer scroll; sin compactación ni fixed (será sticky)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { total, items, inc, dec, remove, clear } = useSelection();
  const [open, setOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  // Leyenda dinámica
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [showCategoryLegend, setShowCategoryLegend] = useState(false);
  const lastCategoryRef = useRef<string>('');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstFocusRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Cerrar modal si ya no hay items
  useEffect(() => { if (summaryOpen && total === 0) setSummaryOpen(false); }, [summaryOpen, total]);

  // Bloqueo de scroll / focus management
  useEffect(() => {
    if (summaryOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => { firstFocusRef.current?.focus(); }, 30);
      return () => { clearTimeout(t); document.body.style.overflow = original; previouslyFocused.current?.focus?.(); };
    }
  }, [summaryOpen]);

  // Trap de foco dentro del modal
  useEffect(() => {
    if (!summaryOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSummaryOpen(false); }
      if (e.key !== 'Tab') return;
      const root = modalRef.current; if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [summaryOpen]);

  // Escuchar cambios de categoría desde el carrusel
  useEffect(() => {
    const handler = (e: Event) => {
      const detail: { nombre?: string } = (e as CustomEvent).detail;
      if (detail?.nombre) {
        lastCategoryRef.current = detail.nombre;
        setActiveCategory(detail.nombre);
      }
    };
    window.addEventListener('active-category-change', handler as EventListener);
    return () => window.removeEventListener('active-category-change', handler as EventListener);
  }, []);

  // Detectar cuando el carrusel sale completamente de la vista (scroll hacia abajo)
  useEffect(() => {
    const check = () => {
      const carousel = document.querySelector('[data-carousel-root]') as HTMLElement | null;
      if (!carousel) return;
      const rect = carousel.getBoundingClientRect();
      // Consideramos "fuera" cuando su bottom queda por arriba del borde superior del viewport
      const out = rect.bottom <= 0;
      setShowCategoryLegend(out);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);

  return (
    <header
      id="site-header"
      className={`w-full fixed top-0 left-0 right-0 z-[999] backdrop-blur-md transition-shadow ${scrolled ? 'shadow-soft' : 'shadow-none'}`}
      style={{ WebkitBackdropFilter: 'blur(10px)' }}
    >
      <div className="relative border-b border-white/10">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(105deg, rgba(3,18,46,0.90) 0%, rgba(6,32,72,0.80) 38%, rgba(10,48,100,0.78) 55%, rgba(4,22,50,0.88) 100%),
              linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: `radial-gradient(circle at 70% 18%, rgba(255,255,255,0.12), transparent 55%)` }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-white/3 pointer-events-none" />
        <div className="mx-auto max-w-md px-4 pt-3 pb-6 overflow-visible relative">
          <div className="flex items-center justify-between relative">
            {/* Logo ligeramente desplazado hacia el centro */}
            <div className="relative h-20 w-20 translate-x-16 md:translate-x-20 select-none transition-transform">
              <div className="absolute inset-0 origin-center scale-[2.9] md:scale-[3.2]">
                <Image
                  src="/images/logo_mag.png"
                  alt="Logo"
                  fill
                  sizes="(max-width:768px) 260px, 330px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="sr-only">Logo Menú Magnolias</span>
            </div>
            {/* Botón Mis alimentos */}
            <div className="flex items-center gap-3 pr-1 relative z-10">
              <div className="relative">
                <button
                  onClick={() => setOpen(o => !o)}
                  className={`relative inline-flex items-center gap-2 rounded-full transition-all duration-500
                  ${total > 0 ? 'px-5 py-2.5 text-[12px] bg-gradient-to-b from-[#1d2f3b] via-[#203d4c] to-[#162833] hover:from-[#234555] hover:to-[#1a3140] border border-[#d4af37]/50 text-[#fbe8b4] animate-glow-pulse-long shadow-[0_0_0_1px_rgba(212,175,55,0.35),0_4px_14px_-4px_rgba(0,0,0,0.55)]' : 'px-4 py-2 text-[11px] bg-white/10 hover:bg-white/20 border border-white/25 text-white'}
                  backdrop-blur-md font-semibold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-magnolias/70`}
                  aria-expanded={open}
                  aria-haspopup="dialog"
                >
                  <span>Mis alimentos</span>
                  <span className={`h-5 min-w-5 px-1 rounded-full flex items-center justify-center font-extrabold shadow-[0_0_0_1px_rgba(0,0,0,0.25),0_2px_5px_-1px_rgba(0,0,0,0.45)] transition-colors
                  ${total > 0 ? 'bg-[#d4af37] text-[#2c2308]' : 'bg-[#ffd84d] text-[#3a2a00]'}
                `}>
                    {total}
                  </span>
                </button>
                {open && (
                  <div className="absolute right-0 mt-3 w-80 max-h-[70vh] overflow-y-auto rounded-xl border border-white/15 bg-neutral-900/95 backdrop-blur-xl shadow-2xl p-4 space-y-3 text-neutral-100 z-50 animate-fade-up-soft">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[12px] font-semibold tracking-wide uppercase">Seleccionados ({total})</h3>
                      {total > 0 && (
                        <button onClick={clear} className="text-[11px] text-neutral-400 hover:text-red-300 transition">Limpiar</button>
                      )}
                    </div>
                    {total === 0 && (
                      <p className="text-[12px] text-neutral-400">Aún no agregas productos. Usa el botón + en la carta.</p>
                    )}
                    {total > 0 && (
                      <ul className="space-y-2">
                        {items.map(r => {
                          const showTokens = r.qty > 1;
                          const maxTokens = 6; // mostrar hasta 6 círculos, luego resumir
                          const visibleCount = Math.min(r.qty, maxTokens);
                          const extra = r.qty - visibleCount;
                          return (
                            <li
                              key={r.id}
                              className="flex items-center gap-3 rounded-md border border-neutral-700/60 bg-neutral-800/65 px-3 py-2 group transition-colors hover:bg-neutral-800/80"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-medium leading-tight truncate text-neutral-100 flex items-center gap-2">
                                  <span>{r.item.nombre}</span>
                                  {showTokens && (
                                    <span className="inline-flex items-center gap-1" aria-label={`Cantidad: ${r.qty}`}>
                                      {Array.from({ length: visibleCount }).map((_, i) => (
                                        <span
                                          key={i}
                                          className={`h-2 w-2 rounded-full border border-[#d4af37]/40 ${i === 0 ? 'bg-[#d4af37]/70' : 'bg-[#d4af37]/30'} shadow-[0_0_0_1px_rgba(0,0,0,0.35)]`}
                                        />
                                      ))}
                                      {extra > 0 && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#e8d18c] border border-[#d4af37]/30 font-semibold tracking-wide">+{extra}</span>
                                      )}
                                    </span>
                                  )}
                                </p>
                              </div>
                              {r.qty > 1 && (
                                <span className="text-[10px] uppercase tracking-wider text-[#d4af37]/70 font-semibold px-1.5 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/25 select-none">x{r.qty}</span>
                              )}
                              <button
                                onClick={() => remove(r.id)}
                                aria-label="Quitar"
                                className="ml-1 text-neutral-500 hover:text-red-400 text-[13px] px-1 transition-colors"
                              >✕</button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <div className="pt-1">
                      <button
                        disabled={total === 0}
                        onClick={() => { if (total > 0) { setOpen(false); setSummaryOpen(true); } }}
                        className="w-full rounded-md bg-gradient-to-b from-[#0f2f3f] via-[#16475d] to-[#103544] hover:from-[#185066] hover:to-[#154154] disabled:opacity-40 disabled:cursor-not-allowed text-magnolias text-[12px] font-semibold tracking-wide px-4 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_12px_-3px_rgba(0,0,0,0.5)] transition-colors"
                      >
                        Listo para mi mesero
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Leyenda centrada anclada al fondo del header */}
            <div className="pointer-events-none select-none absolute left-1/2 top-full -translate-x-1/2 translate-y-10">
              <div className="relative h-7 min-w-[140px] flex items-center justify-center">
                {/* Texto base */}
                <span
                  aria-hidden
                  className={
                    `px-5 py-1 rounded-md text-[11px] tracking-[0.38em] uppercase font-semibold transition-all duration-500 ease-[cubic-bezier(.4,.18,.2,1)]
                   bg-[#0d2230]/92 border border-white/15 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.65)] ring-1 ring-white/5
                   ${showCategoryLegend ? 'opacity-0 scale-[0.95] translate-y-[4px]' : 'opacity-100 scale-100 translate-y-0'}
                  `}
                >Menú Digital</span>
                {/* Categoría activa */}
                <span
                  aria-hidden
                  className={
                    `absolute inset-0 flex items-center justify-center px-4 py-1 rounded-md text-[11px] tracking-[0.30em] uppercase font-semibold transition-all duration-500 ease-[cubic-bezier(.4,.18,.2,1)]
                   bg-[#0d2230]/95 border border-[#d4af37]/30 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.7)] ring-1 ring-[#d4af37]/15
                   ${showCategoryLegend ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.95] -translate-y-[4px]'}
                  `}
                >{activeCategory || ' '}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      {summaryOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[1300]" role="dialog" aria-modal="true" aria-labelledby="resumen-titulo">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xl overlay-animate-in" style={{ WebkitBackdropFilter: 'blur(18px)' }} onClick={() => setSummaryOpen(false)} />
          <div className="relative h-full w-full flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4 py-8" style={{ paddingTop: 'max(1.5rem,env(safe-area-inset-top))', paddingBottom: 'max(1.5rem,env(safe-area-inset-bottom))' }}>
              <div ref={modalRef} className="w-full max-w-md max-h-[88vh] overflow-hidden rounded-2xl border border-white/12 bg-neutral-900/90 backdrop-blur-2xl shadow-[0_14px_70px_-6px_rgba(0,0,0,0.85)] flex flex-col modal-animate-in">
                <div className="flex items-start gap-5 px-6 pt-6 pb-5 border-b border-white/10">
                  <h2 id="resumen-titulo" className="text-2xl font-semibold tracking-wide text-white font-[var(--font-display)] flex-1 leading-snug">Resumen de mis platillos</h2>
                  <button ref={firstFocusRef} onClick={() => setSummaryOpen(false)} aria-label="Cerrar" className="text-neutral-400 hover:text-white transition text-2xl px-2 leading-none">✕</button>
                </div>
                <div className="px-6 pt-6 pb-7 overflow-y-auto space-y-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-700/60 hover:scrollbar-thumb-neutral-600/70">
                  <p className="text-xl text-neutral-300 leading-snug">Este es el resumen de mis platillos, confirmaré con mi mesero.</p>
                  {total === 0 && (
                    <p className="text-xl text-neutral-500">No hay elementos seleccionados.</p>
                  )}
                  {total > 0 && (
                    <ul className="space-y-4">
                      {items.map(r => (
                        <li key={r.id} className="flex items-center gap-5 rounded-xl bg-neutral-800/70 border border-neutral-700/60 px-5 py-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xl font-semibold text-neutral-100 truncate leading-tight">{r.item.nombre}</p>
                          </div>
                          {r.qty > 1 && (
                            <span className="text-lg font-bold text-[#f5d676] bg-[#f5d676]/10 border border-[#f5d676]/30 rounded-full px-4 py-1 tracking-wide">x{r.qty}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-auto px-6 pt-5 pb-6 border-t border-white/10 bg-neutral-900/80 flex gap-5">
                  <button
                    onClick={() => setSummaryOpen(false)}
                    className="flex-1 rounded-md bg-neutral-800/70 hover:bg-neutral-700/70 text-neutral-200 text-lg font-medium px-5 py-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60"
                  >Volver</button>
                  <button
                    onClick={() => setSummaryOpen(false)}
                    className="flex-1 rounded-md bg-gradient-to-b from-[#e7c968] via-[#d4af37] to-[#b68a17] text-[#241a05] text-lg font-semibold px-5 py-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_5px_12px_-4px_rgba(0,0,0,0.55)] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5e3a4]/60"
                  >Confirmar</button>
                </div>
              </div>
            </div>
          </div>
        </div>, document.body)
      }
    </header>
  );
};

export default Header;
