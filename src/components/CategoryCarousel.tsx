"use client";
import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { categoriasCarousel } from '@/data/menu';

interface Props {
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

// Parámetros visuales
const MAX_SCALE = 1.15;
const MIN_SCALE = 0.32;
const DEPTH_RADIUS = 380; // reducido para mejor centrado con círculos de 140px
const POWER_SCALE = 1.15;
const POWER_OPACITY = 1.6;
// Elevación base extra para separar los ítems de la línea inferior
const BASE_LIFT = -45; // valores negativos suben el contenido (aumentado de -14 a -45)

// Interacción lineal
const DRAG_THRESHOLD = 65; // píxeles para avanzar UNA categoría
// Eliminamos animación temporal automática; todos los cambios serán instantáneos hasta nueva decisión

const CategoryCarousel: React.FC<Props> = ({ selectedSlug, onSelect }) => {
  const total = categoriasCarousel.length;
  const stepDeg = 360 / total;
  const initialIndex = Math.max(0, categoriasCarousel.findIndex(c => c.slug === selectedSlug));

  // Índice virtual infinito (puede crecer / decrecer sin límite)
  const [virtualIndex, setVirtualIndex] = useState(initialIndex);
  // Ángulo animado actual (rotação global)
  const [angle, setAngle] = useState(-initialIndex * stepDeg);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Eliminado animRef: ya no hay animación progresiva automática
  const isDraggingRef = useRef(false);
  const dragRef = useRef<{ startX: number } | null>(null);

  const modIndex = (n: number) => ((n % total) + total) % total;
  const activeIndex = modIndex(virtualIndex);
  // Progreso visual (diamantes) para que el usuario comprenda el ciclo.
  const [visitedVersion, setVisitedVersion] = useState(0);
  const visitedRef = useRef<Set<number>>(new Set([initialIndex >= 0 ? initialIndex : 0]));
  const prevVirtualRef = useRef<number>(virtualIndex);
  const prevActiveRef = useRef<number>(activeIndex);
  const loopFlashRef = useRef<HTMLDivElement | null>(null);

  // Actualizar visitados y detectar reinicio de ciclo (wrap)
  useEffect(() => {
    const prevVirtual = prevVirtualRef.current;
    const prevActive = prevActiveRef.current;
    const forward = virtualIndex > prevVirtual; // heurística para dirección
    const wrappedForward = forward && prevActive === total - 1 && activeIndex === 0;
    const wrappedBackward = !forward && prevActive === 0 && activeIndex === total - 1;
    if (wrappedForward || wrappedBackward) {
      // Nuevo ciclo: limpiar y marcar activo
      visitedRef.current = new Set([activeIndex]);
      setVisitedVersion(v => v + 1);
      // Animación de flash dorado
      if (loopFlashRef.current) {
        loopFlashRef.current.classList.remove('animate-[pulse_900ms_ease-out]');
        void loopFlashRef.current.offsetWidth; // reflow para reiniciar animación
        loopFlashRef.current.classList.add('animate-[pulse_900ms_ease-out]');
      }
    } else {
      if (!visitedRef.current.has(activeIndex)) {
        visitedRef.current.add(activeIndex);
        setVisitedVersion(v => v + 1);
      }
    }
    prevVirtualRef.current = virtualIndex;
    prevActiveRef.current = activeIndex;
  }, [activeIndex, virtualIndex, total]);

  // Sync externo
  // Sync externo: ajustar virtualIndex lo mínimo posible para alcanzar el índice deseado
  useEffect(() => {
    const idx = categoriasCarousel.findIndex(c => c.slug === selectedSlug);
    if (idx < 0) return;
    if (idx === activeIndex) return;
    // Diferencia relativa mínima (mod circular) conservando continuidad del virtualIndex
    let diff = idx - activeIndex; // puede ser negativo
    // Elegir el diff más corto en el círculo (aunque normalmente será +- few)
    if (diff > total / 2) diff -= total;
    else if (diff < -total / 2) diff += total;
    moveDelta(diff);
    // Intencionalmente NO añadimos moveDelta ni total porque total es estable (derivado de length) y moveDelta es estable en este ciclo de vida.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug, activeIndex]);

  const commitVirtualIndex = (nextVirtual: number) => {
    setVirtualIndex(nextVirtual);
    const real = modIndex(nextVirtual);
    const cat = categoriasCarousel[real];
    if (cat) {
      // Emitir evento global para que el header pueda mostrar la categoría actual
      try {
        window.dispatchEvent(new CustomEvent('active-category-change', { detail: { slug: cat.slug, nombre: cat.nombre } }));
      } catch { }
    }
    if (cat && cat.slug !== selectedSlug) onSelect(cat.slug);
  };

  const moveToVirtual = (vIdx: number) => {
    // Movimiento suave que siempre centra la ficha activa
    const targetAngle = -vIdx * stepDeg;
    setAngle(targetAngle);
    commitVirtualIndex(vIdx);
  };

  const moveDelta = (delta: number) => {
    if (!delta) return;
    moveToVirtual(virtualIndex + delta);
  };

  // Eliminado loop de animación: ya no existe movimiento automático

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); moveDelta(-1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveDelta(1); }
    else if (e.key === 'Home') { e.preventDefault(); moveToVirtual(0); }
    else if (e.key === 'End') { e.preventDefault(); moveDelta(total); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); moveDelta(0); }
  };

  // Calcular estilos de cada categoría basados en ángulo animado
  const wheelItems = useMemo(() => {
    // categoriasCarousel es un array importado estático; no se incluye en deps para evitar re-cálculos innecesarios.
    return categoriasCarousel.map((cat, idx) => {
      const baseAngle = idx * stepDeg + angle; // desplazamiento total
      const norm = ((baseAngle % 360) + 360) % 360; // 0..359
      const signed = norm > 180 ? norm - 360 : norm; // -180..180
      const rad = (signed * Math.PI) / 180;
      const depth = (Math.cos(rad) + 1) / 2; // 0 atrás, 1 frente

      // La ficha activa siempre tiene valores fijos de centro
      const isCurrentActive = idx === activeIndex;

      // Para transiciones más suaves, las fichas muy cerca del centro (depth > 0.95) 
      // gradualmente adoptan las características del centro
      const isNearCenter = depth > 0.95;
      const centerInfluence = isCurrentActive ? 1 : (isNearCenter ? (depth - 0.95) / 0.05 : 0);

      const calculatedScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * Math.pow(depth, POWER_SCALE);
      const calculatedOpacity = 0.18 + 0.82 * Math.pow(depth, POWER_OPACITY);
      const calculatedTranslateY = BASE_LIFT + 34 * (1 - depth);
      const calculatedBlur = depth < 0.1 ? 1.5 : depth < 0.25 ? 0.5 : 0;

      // Interpolar entre valores calculados y valores del centro
      const scale = isCurrentActive
        ? MAX_SCALE
        : calculatedScale + (MAX_SCALE - calculatedScale) * centerInfluence;

      const opacity = isCurrentActive
        ? 1
        : calculatedOpacity + (1 - calculatedOpacity) * centerInfluence;

      const translateY = isCurrentActive
        ? BASE_LIFT
        : calculatedTranslateY + (BASE_LIFT - calculatedTranslateY) * centerInfluence;

      const blur = isCurrentActive || centerInfluence > 0
        ? 0
        : calculatedBlur;
      return {
        idx,
        cat,
        isActive: idx === activeIndex,
        liStyle: {
          transform: `rotateY(${idx * stepDeg}deg) translateZ(${DEPTH_RADIUS}px)`,
          zIndex: Math.round(depth * 100),
          opacity,
          filter: blur ? `blur(${blur}px)` : undefined,
          pointerEvents: opacity < 0.3 ? 'none' : 'auto'
        } as CSSProperties,
        innerStyle: {
          transform: `translateY(${translateY}px) scale(${scale})`
        } as CSSProperties
      };
    });
  }, [angle, activeIndex, stepDeg]);

  // Drag lineal por pasos
  const [isDragging, setIsDragging] = useState(false);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    dragRef.current = { startX: e.clientX };
    // sin animación activa que cancelar
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (dx <= -DRAG_THRESHOLD) {
      dragRef.current.startX -= DRAG_THRESHOLD; // reajustar para permitir cadena
      moveDelta(1); // siguiente categoría (visual a la derecha)
    } else if (dx >= DRAG_THRESHOLD) {
      dragRef.current.startX += DRAG_THRESHOLD;
      moveDelta(-1); // categoría anterior (visual a la izquierda)
    }
  };
  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    // Alinear (si se interrumpe una animación) usando su virtualIndex actual
    moveToVirtual(virtualIndex);
  };
  const onPointerUp = () => endDrag();
  const onPointerLeave = () => endDrag();
  useEffect(() => {
    const prevent = (e: TouchEvent) => { if (isDragging) e.preventDefault(); };
    document.addEventListener('touchmove', prevent, { passive: false });
    return () => document.removeEventListener('touchmove', prevent);
  }, [isDragging]);

  return (
    <div className="relative mt-1 -mx-4 px-4 pt-4 pb-10 select-none overflow-hidden" aria-label="Categorías del menú" data-carousel-root>
      {/* Gradientes laterales (oscuro consistente, sin blancos) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral-950 via-neutral-950/70 to-transparent" />
      {/* Fondo suave detrás del carrusel para evitar contraste duro */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(20,38,52,0.55),rgba(7,14,26,0.9)_65%)]" />

      {/* Botones de navegación laterales */}
      <button
        type="button"
        aria-label="Categoría anterior"
        onClick={() => moveDelta(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-50 group
                   w-12 h-12 rounded-full 
                   bg-gradient-to-br from-amber-500/20 to-amber-600/30 
                   backdrop-blur-md border border-amber-500/40 
                   shadow-lg shadow-amber-500/20 
                   flex items-center justify-center 
                   text-amber-400 hover:text-amber-300 
                   hover:shadow-xl hover:shadow-amber-500/30
                   hover:scale-110 active:scale-95
                   transition-all duration-300 ease-out
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="group-hover:-translate-x-0.5 transition-transform duration-200">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Categoría siguiente"
        onClick={() => moveDelta(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-50 group
                   w-12 h-12 rounded-full 
                   bg-gradient-to-br from-amber-500/20 to-amber-600/30 
                   backdrop-blur-md border border-amber-500/40 
                   shadow-lg shadow-amber-500/20 
                   flex items-center justify-center 
                   text-amber-400 hover:text-amber-300 
                   hover:shadow-xl hover:shadow-amber-500/30
                   hover:scale-110 active:scale-95
                   transition-all duration-300 ease-out
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="group-hover:translate-x-0.5 transition-transform duration-200">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Área del carrusel limpia para touch/drag */}
      <div
        ref={containerRef}
        role="listbox"
        aria-activedescendant={categoriasCarousel[activeIndex].id}
        tabIndex={0}
        onKeyDown={handleKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        className="relative h-56 w-full [perspective:2000px] select-none"
        style={{ perspectiveOrigin: 'center center' }}
      >
        <div
          className="relative h-56 w-full"
        >
          <div
            ref={wheelRef}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-10 w-[200px] h-[200px] [transform-style:preserve-3d] ${!isDragging ? 'transition-transform duration-500 ease-out' : ''}`}
            style={{
              transform: `translateZ(-${DEPTH_RADIUS}px) rotateY(${angle}deg) scale(0.92)`,
              transformOrigin: 'center center'
            }}
          >
            <ul className="absolute inset-0 m-0 p-0 list-none [transform-style:preserve-3d]">
              {wheelItems.map(({ idx, cat, isActive, liStyle, innerStyle }) => (
                <li
                  key={cat.id}
                  id={cat.id}
                  role="option"
                  aria-selected={isActive}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
                  style={liStyle}
                >
                  <button
                    ref={el => { itemRefs.current[idx] = el; }}
                    onClick={() => {
                      let diff = idx - activeIndex;
                      if (diff > total / 2) diff -= total; else if (diff < -total / 2) diff += total;
                      moveDelta(diff);
                    }}
                    className="relative flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-petroleo/60"
                    aria-pressed={isActive}
                    tabIndex={isActive ? 0 : -1}
                  >
                    <div
                      className={`relative h-[140px] w-[140px] rounded-full flex items-center justify-center overflow-hidden will-change-transform transition-all duration-500 ease-[cubic-bezier(.34,1.56,.4,1)] ${isActive ? 'shadow-[0_8px_24px_-6px_rgba(0,0,0,0.55)]' : 'shadow-[0_3px_8px_-4px_rgba(0,0,0,0.45)]'}`}
                      style={{ ...innerStyle, WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                    >
                      <div className={`absolute inset-0 rounded-full border transition-colors ${isActive ? 'border-[#d4af37] ring-4 ring-[#d4af37]/30 shadow-[0_0_0_2px_#e5d3ab_inset,0_12px_28px_-10px_rgba(0,0,0,0.6),0_0_0_8px_rgba(212,175,55,0.12)]' : 'border-neutral-600/50'} `} />
                      {isActive && <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_55%,rgba(212,175,55,0.45),transparent_62%)] mix-blend-screen" />}
                      <Image
                        src={cat.imagen}
                        alt={cat.nombre}
                        fill
                        priority={isActive}
                        sizes="(max-width:640px) 88px, 112px"
                        className="object-contain p-2 rounded-full select-none [image-rendering:-webkit-optimize-contrast]"
                        draggable={false}
                      />
                    </div>
                    <span
                      className={`text-[26px] text-center leading-tight w-40 -mt-4 line-clamp-2 transition-colors select-none ${isActive ? 'text-magnolias drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]' : 'text-neutral-300/90 hover:text-neutral-200 focus-visible:text-neutral-100'}`}
                      style={{
                        fontFamily: '"Qwigley", cursive',
                        fontWeight: '400',
                        fontStyle: 'normal',
                        WebkitTextStroke: isActive ? '0.5px rgba(255,255,255,0.4)' : '0.3px rgba(255,255,255,0.2)',
                        letterSpacing: '0.01em',
                        textShadow: isActive ? '0 4px 12px rgba(0,0,0,0.8), 0 2px 6px rgba(248,232,191,0.7)' : '0 3px 8px rgba(0,0,0,0.6)',
                        filter: isActive ? 'brightness(1.15) contrast(1.1)' : 'brightness(0.95)'
                      }}
                    >{cat.nombre}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Barra de progreso dorada con diamantes */}
      <div className="mt-8 relative mx-auto max-w-sm px-8">
        <div className="relative h-5 flex items-center" aria-hidden>
          <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#b89320] via-[#d4af37] to-[#b89320] rounded-full" />
          <div
            ref={loopFlashRef}
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 [animation-fill-mode:forwards]"
            style={{ boxShadow: '0 0 0 0 rgba(212,175,55,0.55)' }}
          />
          <ul
            className="relative z-10 w-full flex justify-between"
            role="progressbar"
            aria-label="Progreso dentro del ciclo de categorías"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={activeIndex + 1}
          >
            {categoriasCarousel.map((cat, idx) => {
              const isActive = idx === activeIndex;
              const visited = visitedRef.current.has(idx);
              return (
                <li key={cat.id} className="flex-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      let diff = idx - activeIndex;
                      if (diff > total / 2) diff -= total; else if (diff < -total / 2) diff += total;
                      moveDelta(diff);
                    }}
                    aria-label={`Ir a ${cat.nombre}`}
                    className={`relative h-3 w-3 rotate-45 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/70 focus-visible:rounded-sm
                      ${isActive ? 'scale-125 shadow-[0_0_0_2px_#d4af37,0_0_10px_2px_rgba(212,175,55,0.5)] bg-[#d4af37]' : visited ? 'bg-[#d4af37]/70 shadow-[0_0_0_1px_#d4af37]' : 'bg-neutral-700 shadow-[0_0_0_1px_rgba(212,175,55,0.35)] hover:bg-[#d4af37]/60'}`}
                  >
                    {isActive && <span className="absolute inset-0 -rotate-45 flex items-center justify-center text-[6px] font-bold text-[#2b2109]">★</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Barra de progreso eliminada según solicitud */}
    </div>
  );
};

export default CategoryCarousel;
