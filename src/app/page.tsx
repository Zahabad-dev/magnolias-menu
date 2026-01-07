"use client";
import { useState, useEffect, useRef } from 'react';
import CategoryCarousel from '@/components/CategoryCarousel';
import MenuDisplay from '@/components/MenuDisplay';
import WelcomeModal from '@/components/WelcomeModal';
import { categoriasCarousel } from '@/data/menu';
import { useSelection } from '@/context/SelectionContext';
import DrinkSuggestion from '@/components/DrinkSuggestion';

export default function Home() {
  const [slug, setSlug] = useState<string>(categoriasCarousel[0]?.slug || '');
  const { clear, total, items } = useSelection();
  const DRINK_SLUGS = useRef(new Set(['cafe', 'mixologia', 'vinos-licores', 'bebidas-refrescantes']));
  const [dismissedFor, setDismissedFor] = useState<string | null>(null); // sólo para sugerencia de bebida básica
  const [dessertDismissedForCount, setDessertDismissedForCount] = useState<number | null>(null);
  const [forcedDishSuggestion, setForcedDishSuggestion] = useState<{ id: string; slug: string; name: string } | null>(null);
  const dismissedDishIdsRef = useRef<Set<string>>(new Set());
  const seenIdsRef = useRef<Set<string>>(new Set());
  // Bandera para suprimir cualquier popup de sugerencia hasta que cambie el contexto (por ejemplo se agreguen nuevos items relevantes o se completen acompañantes)
  // Recordar si el usuario cerró el modal de acompañantes con paquetes pendientes en un cierto paqueteQty
  const [dismissedAcompanantesForPaqueteQty, setDismissedAcompanantesForPaqueteQty] = useState<number | null>(null);

  // Modal de bienvenida - se muestra al cargar la página por primera vez
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Clasificaciones
  const paqueteLineItems = items.filter(i => i.slug === 'paquetes' && !i.id.startsWith('acompanante-'));
  const dessertLineItems = items.filter(i => i.slug === 'postres');
  const paqueteQty = paqueteLineItems.reduce((s, r) => s + r.qty, 0);
  const acompananteLineItems = items.filter(i => i.id.startsWith('acompanante-'));
  const acompananteQty = acompananteLineItems.reduce((s, r) => s + r.qty, 0);
  // Regla 1:1 restaurada: se requiere un acompañante por cada paquete
  const remainingAcompanantes = Math.max(0, paqueteQty - acompananteQty);
  const dessertQty = dessertLineItems.reduce((s, r) => s + r.qty, 0);

  const beverageItems = items.filter(i => DRINK_SLUGS.current.has(i.slug));
  // Identificar ítems de paquetes por su ID (DB001-DB010)
  const isPaqueteItem = (item: { id: string }) => /^DB0(0[1-9]|10)$/.test(item.id);
  // Identificar ítems del menú kids por su ID (KP001-KP999 o con sufijo de bebida)
  const isMenuKidsItem = (item: { id: string }) => item.id.startsWith('KP');
  const nonBeverageFoods = items.filter(i => !DRINK_SLUGS.current.has(i.slug) && !i.id.startsWith('acompanante-') && !isPaqueteItem(i) && !isMenuKidsItem(i));
  const baseFood = nonBeverageFoods[0];

  // Condición bebida simple (sólo si no hay obligación pendiente de acompañantes)
  const canSuggestBeverageBasic = remainingAcompanantes === 0 && nonBeverageFoods.length === 1 && beverageItems.length === 0 && (!dismissedFor || dismissedFor !== baseFood?.id);
  const dessertRemaining = Math.max(0, dessertQty - beverageItems.length);
  const dessertMode = remainingAcompanantes === 0 && dessertRemaining > 0 && (dessertDismissedForCount !== dessertQty);

  // Mostrar popup si: hay acompañantes pendientes O se puede sugerir bebida básica
  // Detectar nuevos platillos agregados para sugerencia opcional individual
  useEffect(() => {
    const currentIds = new Set(items.map(i => i.id));
    for (const it of items) {
      if (!seenIdsRef.current.has(it.id)) {
        seenIdsRef.current.add(it.id);
        // Si es un platillo no-bebida (y no acompañante ni paquete ni menu-kids) y no está descartado, preparar sugerencia
        if (!DRINK_SLUGS.current.has(it.slug) && !it.id.startsWith('acompanante-') && !isPaqueteItem(it) && !isMenuKidsItem(it)) {
          if (!dismissedDishIdsRef.current.has(it.id)) {
            setForcedDishSuggestion({ id: it.id, slug: it.slug, name: it.item.nombre });
          }
        }
      }
    }
    // Limpiar ids removidos (opcional)
    for (const oldId of Array.from(seenIdsRef.current)) {
      if (!currentIds.has(oldId)) {
        seenIdsRef.current.delete(oldId);
      }
    }
  }, [items, DRINK_SLUGS]);

  const paqueteContextActive = slug === 'paquetes';
  const needAcompanantePrompt = remainingAcompanantes > 0 && paqueteContextActive && dismissedAcompanantesForPaqueteQty !== paqueteQty;
  const shouldShowDrinkPrompt = needAcompanantePrompt || dessertMode || canSuggestBeverageBasic || !!forcedDishSuggestion;

  // Reset del salto cuando se cumplen acompañantes
  useEffect(() => {
    if (remainingAcompanantes === 0) {
      // Al completar acompañantes limpiamos el registro de cierre previo
      setDismissedAcompanantesForPaqueteQty(null);
    }
  }, [remainingAcompanantes]);

  // Limpiar "Mis alimentos" al cargar la página y mostrar modal de bienvenida (solo primer montaje)
  useEffect(() => {
    // Solo limpiar si había algo (evita escritura innecesaria)
    if (total > 0) clear();
    else clear(); // si se desea SIEMPRE limpiar por especificación

    // Mostrar modal de bienvenida después de un pequeño retraso para mejor UX
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <CategoryCarousel selectedSlug={slug} onSelect={setSlug} />
      <div key={slug} className="page-transition-enter">
        <MenuDisplay slug={slug} />
      </div>
      {shouldShowDrinkPrompt && (baseFood || forcedDishSuggestion) && (
        <DrinkSuggestion
          onClose={() => {
            if (needAcompanantePrompt) {
              // Usuario cerró sin completar; no volver a mostrar hasta que cambie el paqueteQty
              setDismissedAcompanantesForPaqueteQty(paqueteQty);
            }
            if (dessertMode) {
              setDessertDismissedForCount(dessertQty);
            }
            if (canSuggestBeverageBasic && baseFood) {
              setDismissedFor(baseFood.id);
            }
            if (forcedDishSuggestion) {
              dismissedDishIdsRef.current.add(forcedDishSuggestion.id);
              setForcedDishSuggestion(null);
            }
          }}
          onNavigate={(s) => setSlug(s)}
          enableAcompanante={paqueteQty > 0 && paqueteContextActive}
          remainingAcompanantes={remainingAcompanantes}
          totalPaqueteQty={paqueteQty}
          showBeverageSection={true}
          dessertMode={dessertMode}
          dessertRemaining={dessertRemaining}
          dessertTotal={dessertQty}
          generalDishSuggestion={!!forcedDishSuggestion && remainingAcompanantes === 0 && !dessertMode}
          dishName={forcedDishSuggestion?.name}
          currentSlug={slug}
        />
      )}

      {/* Modal de bienvenida */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => {
          console.log('Closing welcome modal from parent'); // Debug log
          setShowWelcomeModal(false);
        }}
      />
    </div>
  );
}
