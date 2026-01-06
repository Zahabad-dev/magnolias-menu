"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelection } from '@/context/SelectionContext';
import { getCategoriaBySlug, prefetchCategoria, CategoriaMenu, GrupoMenu, MenuItem, categoriasCarousel } from '@/data/menu';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface MenuDisplayProps {
	slug: string;
}

// Cache en memoria de categorías ya cargadas (evita re-importar y flicker)
const categoriaCache = new Map<string, CategoriaMenu>();

export const MenuDisplay: React.FC<MenuDisplayProps> = ({ slug }) => {
	const [categoria, setCategoria] = useState<CategoriaMenu | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const requestIdRef = useRef(0);
	// --- EXPANDED VIEW STATE ---
	const [expanded, setExpanded] = useState<{ item: MenuItem; slug: string } | null>(null);
	const closeExpanded = useCallback(() => setExpanded(null), []);
	// --- PAQUETES MODAL STATE ---
	const [paqueteModal, setPaqueteModal] = useState<{ item: MenuItem; slug: string } | null>(null);
	const [selectedComplement, setSelectedComplement] = useState<string>('');
	const closePaqueteModal = useCallback(() => {
		setPaqueteModal(null);
		setSelectedComplement('');
	}, []);
	// --- ACOMPAÑANTE MODAL STATE ---
	const [acompananteModal, setAcompananteModal] = useState<{ item: MenuItem; slug: string } | null>(null);
	const [selectedAcompanante, setSelectedAcompanante] = useState<string>('');
	const closeAcompananteModal = useCallback(() => {
		setAcompananteModal(null);
		setSelectedAcompanante('');
	}, []);
	// --- BEBIDAS MODAL STATE ---
	const [bebidasModal, setBebidasModal] = useState<{ item: MenuItem; slug: string } | null>(null);
	const [selectedBebida, setSelectedBebida] = useState<string>('');
	const closeBebidasModal = useCallback(() => {
		setBebidasModal(null);
		setSelectedBebida('');
	}, []);


	// Función para manejar clicks en items y decidir qué modal abrir
	const handleItemClick = useCallback((item: MenuItem, slug: string, groupTitle?: string) => {
		console.log('🔍 handleItemClick DEBUG:', {
			categoriaSlug: categoria?.slug,
			groupTitle,
			itemName: item.nombre
		});

		if (groupTitle === 'Paquetes') {
			console.log('✅ Abriendo acompananteModal (Paquetes)');
			setAcompananteModal({ item, slug });
		} else if (categoria?.slug === 'menu-kids' && groupTitle === 'Menú de Desayunos Infantil') {
			console.log('🎯 Abriendo paqueteModal (Desayunos Infantil)');
			setPaqueteModal({ item, slug });
		} else if (categoria?.slug === 'menu-kids' && groupTitle === 'Menú de Comidas Infantil') {
			console.log('🎯 Abriendo paqueteModal (Comidas Infantil)');
			setPaqueteModal({ item, slug });
		} else {
			console.log('📖 Abriendo modal expandido normal');
			setExpanded({ item, slug });
		}
	}, [categoria?.slug]);
	// Ref para focus trap del modal
	const modalRef = useRef<HTMLDivElement | null>(null);
	const paqueteModalRef = useRef<HTMLDivElement | null>(null);
	const acompananteModalRef = useRef<HTMLDivElement | null>(null);
	const acompananteButtonRef = useRef<HTMLButtonElement | null>(null);
	const bebidasModalRef = useRef<HTMLDivElement | null>(null);
	const bebidasButtonRef = useRef<HTMLButtonElement | null>(null);

	const scrollLockRef = useRef<number>(0);
	// Selección para usar también dentro del modal
	const { items: selectedItems, add: addSel, inc: incSel, dec: decSel } = useSelection();
	const currentExpanded = expanded ? selectedItems.find((r: { id: string; qty: number }) => r.id === expanded.item.id) : null;
	// Estado para controlar hidratación de portals
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);
	const lastFocusRef = useRef<HTMLElement | null>(null);

	// Lógica de conteo de paquetes y acompañantes
	// Identificar ítems de paquetes por su ID (DB001-DB010)
	const isPaqueteItem = (item: { id: string }) => /^DB0(0[1-9]|10)$/.test(item.id);
	const paqueteItems = selectedItems.filter(item => isPaqueteItem(item) && !item.id.includes('_'));
	const totalPaquetes = paqueteItems.reduce((sum, item) => sum + item.qty, 0);

	const acompananteItems = selectedItems.filter(item =>
		item.id.includes('_fruta') ||
		item.id.includes('_jugo') ||
		item.id.includes('_limonada') ||
		item.id.includes('_sin_acompañante')
	);
	const totalAcompanantes = acompananteItems.reduce((sum, item) => sum + item.qty, 0);

	// Auto-scroll al botón cuando se selecciona un acompañante
	useEffect(() => {
		if (selectedAcompanante && acompananteButtonRef.current) {
			setTimeout(() => {
				acompananteButtonRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
			}, 300);
		}
	}, [selectedAcompanante]);

	// Auto-scroll al botón cuando se selecciona una bebida
	useEffect(() => {
		if (selectedBebida && bebidasButtonRef.current) {
			setTimeout(() => {
				bebidasButtonRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
			}, 300);
		}
	}, [selectedBebida]);

	// Scroll lock + focus trap + escape para modal expandido
	useEffect(() => {
		if (!expanded) return;
		lastFocusRef.current = document.activeElement as HTMLElement;
		const y = window.scrollY;
		scrollLockRef.current = y;
		const body = document.body;
		const docEl = document.documentElement;
		const scrollBarWidth = window.innerWidth - docEl.clientWidth;
		const prev = { overflow: body.style.overflow, position: body.style.position, top: body.style.top, width: body.style.width, paddingRight: body.style.paddingRight };
		body.style.position = 'fixed';
		body.style.top = `-${y}px`;
		body.style.width = '100%';
		body.style.overflow = 'hidden';
		if (scrollBarWidth > 0) body.style.paddingRight = scrollBarWidth + 'px';
		requestAnimationFrame(() => {
			if (modalRef.current) {
				modalRef.current.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
			}
		});
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') { closeExpanded(); return; }
			if (e.key === 'Tab' && modalRef.current) {
				const focusables = Array.from(modalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
				if (!focusables.length) return;
				const first = focusables[0];
				const last = focusables[focusables.length - 1];
				if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
				else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => {
			document.removeEventListener('keydown', handleKey);
			body.style.overflow = prev.overflow;
			body.style.position = prev.position;
			body.style.top = prev.top;
			body.style.width = prev.width;
			body.style.paddingRight = prev.paddingRight;
			window.scrollTo(0, scrollLockRef.current);
			lastFocusRef.current?.focus({ preventScroll: true });
		};
	}, [expanded, closeExpanded]);

	// Scroll lock + focus trap + escape para modal de paquetes
	useEffect(() => {
		if (!paqueteModal) return;
		lastFocusRef.current = document.activeElement as HTMLElement;
		const y = window.scrollY;
		scrollLockRef.current = y;
		const body = document.body;
		const docEl = document.documentElement;
		const scrollBarWidth = window.innerWidth - docEl.clientWidth;
		const prev = { overflow: body.style.overflow, position: body.style.position, top: body.style.top, width: body.style.width, paddingRight: body.style.paddingRight };
		body.style.position = 'fixed';
		body.style.top = `-${y}px`;
		body.style.width = '100%';
		body.style.overflow = 'hidden';
		if (scrollBarWidth > 0) body.style.paddingRight = scrollBarWidth + 'px';
		requestAnimationFrame(() => {
			if (paqueteModalRef.current) {
				paqueteModalRef.current.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
			}
		});
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') { closePaqueteModal(); return; }
			if (e.key === 'Tab' && paqueteModalRef.current) {
				const focusables = Array.from(paqueteModalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
				if (!focusables.length) return;
				const first = focusables[0];
				const last = focusables[focusables.length - 1];
				if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
				else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => {
			document.removeEventListener('keydown', handleKey);
			body.style.overflow = prev.overflow;
			body.style.position = prev.position;
			body.style.top = prev.top;
			body.style.width = prev.width;
			body.style.paddingRight = prev.paddingRight;
			window.scrollTo(0, scrollLockRef.current);
			lastFocusRef.current?.focus({ preventScroll: true });
		};
	}, [paqueteModal, closePaqueteModal]);

	// Scroll lock + focus trap + escape para modal de acompañante
	useEffect(() => {
		if (!acompananteModal) return;
		lastFocusRef.current = document.activeElement as HTMLElement;
		const y = window.scrollY;
		scrollLockRef.current = y;
		const body = document.body;
		const docEl = document.documentElement;
		const scrollBarWidth = window.innerWidth - docEl.clientWidth;
		const prev = { overflow: body.style.overflow, position: body.style.position, top: body.style.top, width: body.style.width, paddingRight: body.style.paddingRight };
		body.style.position = 'fixed';
		body.style.top = `-${y}px`;
		body.style.width = '100%';
		body.style.overflow = 'hidden';
		if (scrollBarWidth > 0) body.style.paddingRight = scrollBarWidth + 'px';
		requestAnimationFrame(() => {
			if (acompananteModalRef.current) {
				acompananteModalRef.current.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
			}
		});
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') { closeAcompananteModal(); return; }
			if (e.key === 'Tab' && acompananteModalRef.current) {
				const focusables = Array.from(acompananteModalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
				if (!focusables.length) return;
				const first = focusables[0];
				const last = focusables[focusables.length - 1];
				if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
				else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => {
			document.removeEventListener('keydown', handleKey);
			body.style.overflow = prev.overflow;
			body.style.position = prev.position;
			body.style.top = prev.top;
			body.style.width = prev.width;
			body.style.paddingRight = prev.paddingRight;
			window.scrollTo(0, scrollLockRef.current);
			lastFocusRef.current?.focus({ preventScroll: true });
		};
	}, [acompananteModal, closeAcompananteModal]);

	// Scroll lock + focus trap + escape para modal de bebidas
	useEffect(() => {
		if (!bebidasModal) return;
		lastFocusRef.current = document.activeElement as HTMLElement;
		const y = window.scrollY;
		scrollLockRef.current = y;
		const body = document.body;
		const docEl = document.documentElement;
		const scrollBarWidth = window.innerWidth - docEl.clientWidth;
		const prev = { overflow: body.style.overflow, position: body.style.position, top: body.style.top, width: body.style.width, paddingRight: body.style.paddingRight };
		body.style.position = 'fixed';
		body.style.top = `-${y}px`;
		body.style.width = '100%';
		body.style.overflow = 'hidden';
		body.style.paddingRight = `${scrollBarWidth}px`;

		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') { closeBebidasModal(); return; }
			if (e.key !== 'Tab') return;
			const focusables = bebidasModalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
			if (!focusables || focusables.length === 0) return;
			const first = focusables[0] as HTMLElement;
			const last = focusables[focusables.length - 1] as HTMLElement;
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => {
			document.removeEventListener('keydown', handleKey);
			body.style.overflow = prev.overflow;
			body.style.position = prev.position;
			body.style.top = prev.top;
			body.style.width = prev.width;
			body.style.paddingRight = prev.paddingRight;
			window.scrollTo(0, scrollLockRef.current);
			lastFocusRef.current?.focus({ preventScroll: true });
		};
	}, [bebidasModal, closeBebidasModal]);



	useEffect(() => {
		let cancelled = false;
		const load = async () => {
			setLoading(true);
			setError(null);
			requestIdRef.current += 1;
			const myId = requestIdRef.current;
			// Cache hit
			if (categoriaCache.has(slug)) {
				if (!cancelled) {
					setCategoria(categoriaCache.get(slug)!);
					setLoading(false);
				}
				// Pre-fetch adyacentes silenciosamente
				prefetchNeighbors(slug);
				return;
			}
			const data = await getCategoriaBySlug(slug);
			if (cancelled || myId !== requestIdRef.current) return;
			if (!data) {
				setError('No se pudo cargar esta categoría.');
				setCategoria(null);
			} else {
				categoriaCache.set(slug, data);
				setCategoria(data);
				// Prefetch vecinos
				prefetchNeighbors(slug);
			}
			setLoading(false);
		};
		load();
		return () => { cancelled = true; };
	}, [slug]);

	const prefetchNeighbors = (currentSlug: string) => {
		const index = categoriasCarousel.findIndex((c: { slug: string }) => c.slug === currentSlug);
		if (index === -1) return;
		const prev = categoriasCarousel[(index - 1 + categoriasCarousel.length) % categoriasCarousel.length];
		const next = categoriasCarousel[(index + 1) % categoriasCarousel.length];
		if (prev && !categoriaCache.has(prev.slug)) prefetchCategoria(prev.slug);
		if (next && !categoriaCache.has(next.slug)) prefetchCategoria(next.slug);
	};

	if (error) {
		return <div className="mt-8 text-center text-sm text-red-600 animate-fade-soft">{error}</div>;
	}

	return (
		<div className="mt-6 space-y-8 animate-fade-soft min-h-[300px]">
			{loading && (
				<Skeleton categoriaSlug={slug} />
			)}
			{!loading && categoria && (
				<>
					{categoria.notaSuperior && (
						<div className="whitespace-pre-line text-[13px] bg-gradient-to-r from-petroleo-dark/90 to-petroleo/80 text-white rounded-md px-4 py-3 leading-relaxed shadow-sm border border-white/10 animate-fade-up-soft">
							{categoria.notaSuperior}
						</div>
					)}
					{categoria.items.length > 0 && (
						<section className="animate-fade-up-soft">
							<ItemGrid items={categoria.items} slug={categoria.slug} onExpand={(item, groupTitle) => handleItemClick(item, categoria.slug, groupTitle)} />
						</section>
					)}
					{categoria.grupos && categoria.grupos.map((grupo: GrupoMenu, index: number) => (
						<React.Fragment key={grupo.titulo}>
							{/* Leyenda para Desayunos antes del grupo Paquetes */}
							{categoria.slug === 'desayunos' && grupo.titulo === 'Paquetes' && (
								<div className="mb-4 animate-fade-up-soft">
									<div className="text-center bg-gradient-to-r from-amber-600/20 via-yellow-500/25 to-amber-600/20 text-amber-200 rounded-lg px-4 py-3 border border-amber-500/30 shadow-sm">
										<p className="text-sm font-medium">
											⏰ Desayunos desde las 8:00 a.m. hasta la 1:00 p.m.
										</p>
									</div>
								</div>
							)}

							{/* Leyenda para Comidas y Cenas antes del grupo Entradas */}
							{categoria.slug === 'comidas-cenas' && grupo.titulo === 'Entradas' && (
								<div className="mb-4 animate-fade-up-soft">
									<div className="text-center bg-gradient-to-r from-orange-600/20 via-red-500/25 to-orange-600/20 text-orange-200 rounded-lg px-4 py-3 border border-orange-500/30 shadow-sm">
										<p className="text-sm font-medium">
											🍽️ Comidas servidas a partir de la 1:00 p.m.
										</p>
									</div>
								</div>
							)}

							<GrupoSection
								grupo={grupo}
								categoriaSlug={categoria.slug}
								onExpand={(item, groupTitle) => handleItemClick(item, categoria.slug, groupTitle)}
								collapsible={categoria.slug === 'desayunos' || categoria.slug === 'comidas-cenas' || categoria.slug === 'menu-kids' || categoria.slug === 'cafe' || categoria.slug === 'bebidas-refrescantes' || categoria.slug === 'mixologia' || categoria.slug === 'vinos-licores'}
							/>
						</React.Fragment>
					))}

					{/* --- MODAL DE TEXTO AMPLIADO (inicio bloque prueba) --- */}
					{isClient && expanded && createPortal(
						<div className="fixed inset-0 z-[3000] flex items-center justify-center px-3 py-6" role="dialog" aria-modal="true" aria-labelledby="modal-titulo-menu" aria-describedby="modal-descripcion-menu">
							<div className="absolute inset-0 bg-black/65 backdrop-blur-md" onClick={closeExpanded} />
							<div ref={modalRef} className="relative flex flex-col w-full max-w-md max-h-[92vh] rounded-2xl border border-neutral-600/50 bg-neutral-900/85 backdrop-blur-xl text-neutral-100 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.65)] animate-fade-up-soft focus:outline-none ring-1 ring-black/40">
								<div className="flex items-start gap-5 px-6 pt-6 pb-4 border-b border-neutral-700/50">
									<h2 id="modal-titulo-menu" className="text-4xl font-semibold leading-tight flex-1 tracking-tight drop-shadow-sm font-[var(--font-display)]">{expanded.item.nombre}</h2>
								</div>
								<div id="modal-descripcion-menu" className="px-6 pt-6 pb-5 overflow-y-auto space-y-7 text-lg leading-relaxed">
									<div className="flex items-center gap-5 flex-wrap">
										<span className="inline-flex items-center rounded-md bg-petroleo-strong/30 text-magnolias text-base font-semibold px-4 py-1.5 border border-petroleo-strong/60 shadow-sm">${expanded.item.precio}</span>
										<span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-medium">{expanded.slug}</span>
									</div>
									{expanded.item.descripcion && (
										<p className="whitespace-pre-line text-neutral-200/95">{expanded.item.descripcion}</p>
									)}
								</div>
								<div className="mt-auto px-6 pt-3 pb-6 border-t border-neutral-700/40 bg-neutral-900/50 backdrop-blur-sm">
									<div className="flex items-center justify-between flex-wrap gap-4">
										<div className="flex items-center gap-4">
											{!currentExpanded && (
												<button
													onClick={() => addSel(expanded.item, expanded.slug)}
													className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#e7c968] via-[#d4af37] to-[#b68a17] text-[#241a05] text-lg font-semibold px-6 py-2.5 shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_4px_10px_-2px_rgba(0,0,0,0.55),0_0_0_6px_rgba(212,175,55,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5e3a4]/70 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-900 transition-all duration-300 active:scale-[0.96] hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_6px_16px_-2px_rgba(0,0,0,0.65),0_0_0_6px_rgba(212,175,55,0.3)]"
													aria-label={`Agregar ${expanded.item.nombre}`}
													data-variant="add"
												>
													<span className="text-3xl leading-none -translate-y-[1px] font-[var(--font-alt-display)]">＋</span>
													<span>Agregar</span>
												</button>
											)}
											{currentExpanded && (
												<div className="flex items-center gap-3 bg-petroleo-strong/25 rounded-full px-3 py-2">
													<button onClick={() => decSel(currentExpanded.id)} className="h-10 w-10 rounded-full bg-petroleo-strong text-magnolias text-2xl leading-none flex items-center justify-center">-</button>
													<span className="min-w-[2.2rem] text-center text-lg font-semibold text-[#ffd84d] drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">{currentExpanded.qty}</span>
													<button onClick={() => incSel(currentExpanded.id)} className="h-10 w-10 rounded-full bg-petroleo-strong text-magnolias text-2xl leading-none flex items-center justify-center">+</button>
												</div>
											)}
										</div>
										<button
											onClick={closeExpanded}
											className="ml-auto inline-flex items-center rounded-lg bg-gradient-to-b from-[#f0d778] via-[#d4af37] to-[#b8941c] text-[#2a2105] text-base font-semibold px-6 py-3 shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_4px_12px_-2px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5e3a4]/70 transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_6px_16px_-2px_rgba(0,0,0,0.65)]"
										>
											Cerrar
										</button>
									</div>
								</div>
							</div>
						</div>, document.body)
					}
					{/* --- MODAL DE PAQUETES --- */}
					{isClient && paqueteModal && createPortal(
						<div className="fixed inset-0 z-[3000] flex items-center justify-center px-3 py-6" role="dialog" aria-modal="true" aria-labelledby="modal-paquete-titulo" aria-describedby="modal-paquete-descripcion">
							<div className="absolute inset-0 bg-black/65 backdrop-blur-md" onClick={closePaqueteModal} />
							<div ref={paqueteModalRef} className="relative flex flex-col w-full max-w-md max-h-[92vh] rounded-2xl border border-neutral-600/50 bg-neutral-900/85 backdrop-blur-xl text-neutral-100 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.65)] animate-fade-up-soft focus:outline-none ring-1 ring-black/40">
								<div className="flex items-start gap-5 px-6 pt-6 pb-4 border-b border-neutral-700/50">
									<h2 id="modal-paquete-titulo" className="text-3xl font-semibold leading-tight flex-1 tracking-tight drop-shadow-sm font-[var(--font-display)]">{paqueteModal.item.nombre}</h2>
								</div>
								<div id="modal-paquete-descripcion" className="px-6 pt-6 pb-5 overflow-y-auto space-y-6 text-lg leading-relaxed">
									<div className="flex items-center gap-5 flex-wrap">
										<span className="inline-flex items-center rounded-md bg-petroleo-strong/30 text-magnolias text-base font-semibold px-4 py-1.5 border border-petroleo-strong/60 shadow-sm">${paqueteModal.item.precio}</span>
										<span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
											{categoria?.slug === 'menu-kids' ? 'MENÚ KIDS' : 'PAQUETE'}
										</span>
									</div>
									{paqueteModal.item.descripcion && (
										<p className="whitespace-pre-line text-neutral-200/95">{paqueteModal.item.descripcion}</p>
									)}

									<div className="bg-gradient-to-r from-petroleo-dark/90 to-petroleo/80 text-white rounded-md px-4 py-3 leading-relaxed shadow-sm border border-white/10">
										<p className="text-sm font-medium mb-3 text-center">
											{categoria?.slug === 'menu-kids'
												? 'INCLUYE BEBIDA:'
												: 'INCLUYE FRUTA, JUGO DE NARANJA O LIMONADA,\nREFILL DE CAFÉ (HASTA 3 TAZAS) O UN TÉ.'
											}
										</p>
										<p className="text-sm font-semibold text-center text-magnolias mb-4">
											{categoria?.slug === 'menu-kids' ? 'Selecciona tu bebida:' : 'Selecciona tu acompañante:'}
										</p>

										<div className="space-y-2">
											{(() => {
												const opciones = categoria?.slug === 'menu-kids'
													? ['Chocomilk Frío', 'Chocomilk Tibio', 'Limonada Natural', 'Limonada Mineral']
													: ['Fruta', 'Jugo de Naranja', 'Limonada', 'Sin Acompañante'];
												console.log('🎨 Renderizando opciones paqueteModal:', { categoriaSlug: categoria?.slug, opciones });
												return opciones;
											})().map((complement) => (
												<label key={complement} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
													<input
														type="radio"
														name="complement"
														value={complement}
														checked={selectedComplement === complement}
														onChange={(e) => setSelectedComplement(e.target.value)}
														className="w-4 h-4 text-magnolias bg-neutral-800 border-neutral-600 focus:ring-magnolias focus:ring-2"
													/>
													<span className="text-sm text-neutral-200">{complement}</span>
												</label>
											))}
										</div>
									</div>
								</div>
								<div className="mt-auto px-6 pt-3 pb-6 border-t border-neutral-700/40 bg-neutral-900/50 backdrop-blur-sm">
									<div className="flex items-center justify-between flex-wrap gap-4">
										<button
											onClick={() => {
												if (selectedComplement) {
													// Crear item personalizado con el complemento seleccionado
													const itemConComplemento = {
														...paqueteModal.item,
														id: `${paqueteModal.item.id}_${selectedComplement.replace(/\s+/g, '_').toLowerCase()}`,
														nombre: `${paqueteModal.item.nombre} (${selectedComplement})`
													};
													addSel(itemConComplemento, paqueteModal.slug);
													closePaqueteModal();
												}
											}}
											disabled={!selectedComplement}
											className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-[#e7c968] via-[#d4af37] to-[#b68a17] text-[#241a05] text-lg font-semibold px-6 py-3 shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_4px_10px_-2px_rgba(0,0,0,0.55),0_0_0_6px_rgba(212,175,55,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5e3a4]/70 transition-all duration-300 active:scale-[0.96] hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_6px_16px_-2px_rgba(0,0,0,0.65),0_0_0_6px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
											aria-label={`Agregar ${paqueteModal.item.nombre} con ${selectedComplement}`}
											data-variant="add"
										>
											<span className="text-2xl leading-none -translate-y-[1px] font-[var(--font-alt-display)]">＋</span>
											<span>Agregar al Pedido</span>
										</button>
										<button
											onClick={closePaqueteModal}
											className="ml-auto inline-flex items-center rounded-lg bg-gradient-to-b from-[#f0d778] via-[#d4af37] to-[#b8941c] text-[#2a2105] text-base font-semibold px-6 py-3 shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_4px_12px_-2px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5e3a4]/70 transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_6px_16px_-2px_rgba(0,0,0,0.65)]"
										>
											Cancelar
										</button>
									</div>
								</div>
							</div>
						</div>, document.body)
					}
					{/* --- MODAL DE ACOMPAÑANTE --- */}
					{isClient && acompananteModal && createPortal(
						<div className="fixed inset-0 z-[3000] flex items-center justify-center px-3 py-6" role="dialog" aria-modal="true" aria-labelledby="modal-acompanante-titulo" aria-describedby="modal-acompanante-descripcion">
							<div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeAcompananteModal} />
							<div ref={acompananteModalRef} className="relative flex flex-col w-full max-w-sm max-h-[85vh] rounded-2xl border border-[#d4af37]/40 bg-gradient-to-b from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl text-neutral-100 shadow-[0_12px_48px_-8px_rgba(0,0,0,0.8),0_0_0_1px_rgba(212,175,55,0.2)] animate-fade-up-soft focus:outline-none">
								<div className="absolute -inset-px rounded-2xl pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.15),transparent_70%)]" />
								<div className="relative px-6 pt-8 pb-6 text-center border-b border-neutral-700/30">
									<h2 id="modal-acompanante-titulo" className="text-2xl font-bold tracking-tight text-[#f8e8bf] font-[var(--font-display)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mb-2">
										{categoria?.slug === 'menu-kids' ? 'Elige tu bebida' : 'Elige tu acompañante'}
									</h2>
									<p className="text-sm text-neutral-300 leading-snug mb-3">
										Para: <span className="font-semibold text-magnolias">{acompananteModal.item.nombre}</span>
									</p>
									<div className="inline-flex items-center gap-2 bg-magnolias/10 border border-magnolias/30 rounded-full px-3 py-1.5">
										<div className="w-2 h-2 bg-magnolias rounded-full animate-pulse" />
										<span className="text-xs font-medium text-magnolias">
											{categoria?.slug === 'menu-kids' ? 'Elige tu bebida' : 'Elige tu acompañante'}
										</span>
									</div>
								</div>
								<div id="modal-acompanante-descripcion" className="px-6 pt-6 pb-4 space-y-5">
									<div className="bg-gradient-to-r from-petroleo-dark/80 to-petroleo/70 text-white rounded-lg px-4 py-3 border border-[#d4af37]/20 shadow-sm">
										<p className="text-xs font-medium text-center leading-tight">
											{categoria?.slug === 'menu-kids'
												? 'INCLUYE BEBIDA:'
												: 'INCLUYE FRUTA, JUGO DE NARANJA O LIMONADA,\nREFILL DE CAFÉ (HASTA 3 TAZAS) O UN TÉ.'
											}
										</p>
									</div>

									<div className="space-y-3">
										{(categoria?.slug === 'menu-kids'
											? ['Chocomilk Frío', 'Chocomilk Tibio', 'Limonada Natural', 'Limonada Mineral']
											: ['Fruta', 'Jugo de Naranja', 'Limonada', 'Sin Acompañante']
										).map((acompanante, index) => (
											<label key={acompanante} className="group flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-neutral-800/50 transition-all duration-200 border border-transparent hover:border-neutral-600/30">
												<div className="relative">
													<input
														type="radio"
														name="acompanante"
														value={acompanante}
														checked={selectedAcompanante === acompanante}
														onChange={(e) => setSelectedAcompanante(e.target.value)}
														className="sr-only"
													/>
													<div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${selectedAcompanante === acompanante
														? 'border-magnolias bg-magnolias shadow-[0_0_0_2px_rgba(212,175,55,0.3)]'
														: 'border-neutral-500 group-hover:border-neutral-400'
														}`}>
														{selectedAcompanante === acompanante && (
															<div className="w-2 h-2 bg-neutral-900 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
														)}
													</div>
												</div>
												<span className="text-base font-medium text-neutral-200 group-hover:text-neutral-100 transition-colors">
													{acompanante}
												</span>
											</label>
										))}
									</div>
								</div>
								<div className="mt-auto px-6 pt-4 pb-6 border-t border-neutral-700/30 bg-neutral-900/30 backdrop-blur-sm">
									<div className="flex flex-col gap-3">
										<button
											ref={acompananteButtonRef}
											onClick={() => {
												if (selectedAcompanante) {
													const itemConAcompanante = {
														...acompananteModal.item,
														id: `${acompananteModal.item.id}_${selectedAcompanante.replace(/\s+/g, '_').toLowerCase()}`,
														nombre: `${acompananteModal.item.nombre} (${selectedAcompanante})`
													};
													addSel(itemConAcompanante, acompananteModal.slug);
													closeAcompananteModal();
												}
											}}
											disabled={!selectedAcompanante}
											className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#e9cc70] via-[#d4af37] to-[#b28714] text-[#2a2105] text-lg font-bold px-6 py-4 shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_6px_16px_-4px_rgba(0,0,0,0.6),0_0_0_8px_rgba(212,175,55,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5e3a4]/80 transition-all duration-300 active:scale-[0.97] hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.6),0_8px_20px_-4px_rgba(0,0,0,0.7),0_0_0_10px_rgba(212,175,55,0.2)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:transform-none"
											aria-label={`Confirmar ${acompananteModal.item.nombre} con ${selectedAcompanante}`}
										>
											<span className="text-2xl leading-none -translate-y-[1px] font-[var(--font-alt-display)]">
												✓
											</span>
											<span>
												Confirmar Pedido
											</span>
										</button>
										<button
											onClick={closeAcompananteModal}
											className="w-full inline-flex items-center justify-center rounded-lg bg-neutral-800/60 hover:bg-neutral-700/70 text-neutral-200 hover:text-neutral-100 text-base font-medium px-6 py-3 border border-neutral-600/40 shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/60"
										>
											Cancelar
										</button>
									</div>
								</div>
							</div>
						</div>, document.body)
					}

					{/* Modal de Selección de Bebidas */}
					{isClient && bebidasModal && createPortal(
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
							<div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeBebidasModal} />
							<div
								ref={bebidasModalRef}
								className="relative w-full max-w-md mx-auto bg-neutral-900/95 backdrop-blur-lg rounded-2xl border border-neutral-700/50 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300"
								role="dialog"
								aria-modal="true"
								aria-labelledby="bebidas-modal-title"
								aria-describedby="bebidas-modal-desc"
							>
								{/* Cabecera del modal */}
								<div className="p-6 pb-4 border-b border-neutral-700/50">
									<h3 id="bebidas-modal-title" className="text-xl font-bold text-neutral-100 text-center">
										Selecciona tu Bebida
									</h3>
									<p id="bebidas-modal-desc" className="text-sm text-neutral-400 text-center mt-2">
										Elige una bebida para acompañar tu {bebidasModal.item.nombre}
									</p>
								</div>

								{/* Lista de bebidas disponibles */}
								<div className="p-6 space-y-4">
									{[
										'Limonada Natural',
										'Limonada Mineral',
										'Chocomilk Frío',
										'Chocomilk Tibio'
									].map((bebida) => (
										<label
											key={bebida}
											className="flex items-center p-3 rounded-lg border border-neutral-700/50 hover:border-neutral-600/70 hover:bg-neutral-800/50 transition-all duration-200 cursor-pointer group"
										>
											<input
												type="radio"
												name="bebida-selection"
												value={bebida}
												checked={selectedBebida === bebida}
												onChange={(e) => setSelectedBebida(e.target.value)}
												className="sr-only"
											/>
											<div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${selectedBebida === bebida
												? 'border-amber-500 bg-amber-500 shadow-md shadow-amber-500/20'
												: 'border-neutral-500 group-hover:border-neutral-400'
												}`}>
												{selectedBebida === bebida && (
													<div className="w-2 h-2 bg-neutral-900 rounded-full mx-auto mt-0.5" />
												)}
											</div>
											<span className="ml-3 text-neutral-200 font-medium">{bebida}</span>
										</label>
									))}
								</div>

								{/* Botones de acción */}
								<div className="p-6 pt-4 space-y-3">
									<button
										ref={bebidasButtonRef}
										onClick={() => {
											if (selectedBebida) {
												// Agregar item con bebida seleccionada
												const itemConBebida = {
													id: `${bebidasModal.item.id}_${selectedBebida.replace(/\s+/g, '_').toLowerCase()}`,
													nombre: `${bebidasModal.item.nombre} + ${selectedBebida}`,
													precio: bebidasModal.item.precio,
													descripcion: bebidasModal.item.descripcion
												};
												addSel(itemConBebida, bebidasModal.slug);
												closeBebidasModal();
											}
										}}
										disabled={!selectedBebida}
										className={`w-full inline-flex items-center justify-center rounded-lg text-base font-medium px-6 py-3 shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 ${selectedBebida
											? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-neutral-900 shadow-lg shadow-amber-500/25'
											: 'bg-neutral-700/50 text-neutral-500 cursor-not-allowed'
											}`}
										aria-label={`Confirmar ${bebidasModal.item.nombre} con ${selectedBebida}`}
									>
										<span>
											{selectedBebida
												? `Agregar con ${selectedBebida}`
												: 'Selecciona una bebida'
											}
										</span>
									</button>
									<button
										onClick={closeBebidasModal}
										className="w-full inline-flex items-center justify-center rounded-lg bg-neutral-800/60 hover:bg-neutral-700/70 text-neutral-200 hover:text-neutral-100 text-base font-medium px-6 py-3 border border-neutral-600/40 shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/60"
									>
										Cancelar
									</button>
								</div>
							</div>
						</div>, document.body)
					}


					{/* --- MODAL DE TEXTO AMPLIADO (fin bloque prueba) --- */}
				</>
			)}
		</div>
	);
};

const Skeleton: React.FC<{ categoriaSlug: string }> = () => {
	const cards = Array.from({ length: 6 });
	return (
		<div className="space-y-8">
			<div className="h-8 w-56 rounded bg-gradient-to-r from-petroleo/15 to-petroleo/5 animate-pulse" />
			<ul className="grid grid-cols-1 gap-4">
				{cards.map((_, i) => (
					<li key={i} className="rounded-xl border border-neutral-700/60 bg-neutral-800/50 backdrop-blur-sm p-4 shadow-sm animate-pulse space-y-3">
						<div className="h-4 w-3/4 rounded bg-neutral-700/70" />
						<div className="h-3 w-full rounded bg-neutral-700/50" />
						<div className="h-3 w-2/3 rounded bg-neutral-700/40" />
					</li>
				))}
			</ul>
		</div>
	);
};

// Función para mapear subcategorías a sus imágenes correspondientes
const getSubcategoryImage = (groupTitle: string): string => {
	const imageMap: Record<string, string> = {
		// Desayunos
		'Paquetes': '/images/portadascat/1Paquetes.png',
		'De la Granja': '/images/portadascat/2DelaGranja.png',
		'Toast': '/images/portadascat/3Toast.png',
		'Omelettes': '/images/portadascat/4Omelettes.png',
		'Enchiladas, chilaquiles y más': '/images/portadascat/5Enchiladas.png',
		'Dulces, pan y fruta': '/images/portadascat/6Dulces.png',

		// Comidas y Cenas
		'Entradas': '/images/portadascat/7Entradas.png',
		'Sopas y Pastas': '/images/portadascat/8Sopas.png',
		'Ensaladas': '/images/portadascat/9Ensaladas.png',
		'Del mar': '/images/portadascat/10Delmar.png',
		'Pollo': '/images/portadascat/11pollo.png',
		'Cortes': '/images/portadascat/12Cortes.png',
		'Tacos': '/images/portadascat/13Tacos.png',
		'Especialidades del Chef': '/images/portadascat/14Especialidades.png',
		'Snacks': '/images/portadascat/15Snacks.png',

		// Menu Kids
		'Menú de Desayunos Infantil': '/images/portadascat/17menuinfantildesayunos.png',
		'Menú de Comidas Infantil': '/images/portadascat/17KidsComida.png',

		// Bebidas Refrescantes
		'Limonadas y Bebidas Cítricas': '/images/portadascat/18limonadasybebidas.png',
		'Mocktails (Cocteles Sin Alcohol)': '/images/portadascat/19mocktails.png',
		'Bebidas Tradicionales Mexicanas': '/images/portadascat/20bebidastradicionales.png',
		'Jugos Naturales': '/images/portadascat/21jugos.png',
		'Bebidas Lácteas y Cremosas': '/images/portadascat/22bebidaslacteascremosas.png',
		'AGUAS FRESCAS': '/images/portadascat/23Aguas.png',
		'REFRESCOS Y SODAS': '/images/portadascat/24Refrescos.png',
		'AGUAS MINERALES Y TÓNICAS': '/images/portadascat/25Minerales.png',

		// Bebidas Calientes
		'CAFÉS ESPRESSO PUROS': '/images/portadascat/26Espresso.png',
		'CAFÉS CON LECHE': '/images/portadascat/27CafesLeche.png',
		'LATTES ESPECIALES': '/images/portadascat/28Lattes.png',
		'TÉS E INFUSIONES': '/images/portadascat/29Tes.png',
		'CHOCOLATES': '/images/portadascat/30Chocolates.png',
		'SERVICIO DE CAFÉ': '/images/portadascat/31ServicioCafe.png',
	};

	return imageMap[groupTitle] || '';
};

const GrupoSection: React.FC<{ grupo: GrupoMenu; depth?: number; categoriaSlug: string; onExpand: (item: MenuItem, groupTitle?: string) => void; collapsible?: boolean }> = ({ grupo, depth = 0, categoriaSlug, onExpand, collapsible }) => {
	const [open, setOpen] = React.useState(!collapsible); // si es desplegable, inicia cerrado
	const titleRef = React.useRef<HTMLButtonElement>(null);

	const toggle = () => {
		if (collapsible) {
			setOpen(o => {
				// Si se va a abrir (estaba cerrado), primero cerrar todos los otros
				if (!o) {
					// Guardar la posición actual del scroll
					const currentScrollY = window.scrollY;

					window.dispatchEvent(new CustomEvent('closeAllGroups'));

					// Pequeño delay para permitir que se cierren otros grupos primero
					setTimeout(() => {
						setOpen(true);

						// Después de abrir, mantener el foco en el título
						setTimeout(() => {
							if (titleRef.current) {
								const titleRect = titleRef.current.getBoundingClientRect();
								const titleTop = titleRect.top + window.scrollY;

								// Solo hacer scroll si el título no está visible o está tapado por el header
								if (titleRect.top < 220 || titleRect.bottom > window.innerHeight - 50) {
									window.scrollTo({
										top: titleTop - 250, // 250px desde la parte superior para asegurar que el título sea completamente visible
										behavior: 'smooth'
									});
								}
							}
						}, 300); // Esperar a que termine la animación de apertura
					}, 10);
					return false; // Mantener cerrado momentáneamente
				} else {
					// Si se va a cerrar, simplemente cerrar
					return false;
				}
			});
		}
	};	// Escuchar evento para cerrar todos los grupos
	React.useEffect(() => {
		const closeAllHandler = () => {
			if (collapsible) {
				setOpen(false);
			}
		};
		window.addEventListener('closeAllGroups', closeAllHandler);
		return () => window.removeEventListener('closeAllGroups', closeAllHandler);
	}, [collapsible]);
	return (
		<section className="animate-fade-up-soft">
			<div className={`flex items-center ${depth === 0 ? 'mt-3' : 'mt-2'} mb-2`}>
				<button
					ref={titleRef}
					type="button"
					onClick={toggle}
					className={`group flex items-center gap-3 w-full text-left ${collapsible ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
					aria-expanded={collapsible ? open : undefined}
				>
					<span
						className={
							`relative flex items-center gap-3 font-semibold ` +
							(collapsible
								? `text-[20px] ${open ? 'text-[#f8e2a2]' : 'text-[#d6b24f]'} hover:text-[#ffe9b8] transition-colors`
								: `text-[15px] ${depth === 0 ? 'text-petroleo' : 'text-petroleo-strong'}`)
						}
						style={collapsible ? { fontFamily: 'var(--font-alt-display)', letterSpacing: '0.025em' } : { fontFamily: 'var(--font-display)' }}
					>
						{collapsible && (
							<span
								className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-500 ease-out select-none relative overflow-visible
									${open
										? 'border-[#e8cc74]/70 bg-[#2c2412]/95 shadow-[0_0_0_1px_rgba(232,204,116,0.35),0_0_14px_-2px_rgba(232,204,116,0.55)]'
										: 'border-[#c9a744]/60 bg-[#211b0e]/90 shadow-[0_0_0_1px_rgba(201,167,68,0.28),0_0_10px_-2px_rgba(0,0,0,0.55)] hover:bg-[#2b2313]'}
								`}
								aria-hidden="true"
							>
								{/* Halo pulsante al abrir */}
								<span className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 ${open ? 'animate-[pulse_2.4s_ease-in-out_infinite]' : 'opacity-0'} bg-gradient-to-br from-[#f4de9c]/5 via-[#e2c060]/10 to-transparent`} />
								{/* Contenedor del símbolo (rotación sutil) */}
								<span className={`relative block h-6 w-6 transition-transform duration-500 ease-[cubic-bezier(.77,0,.22,1)] ${open ? 'rotate-180 scale-[1.02]' : 'rotate-0 scale-100'}`}>
									{/* Barra horizontal */}
									<span
										className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[3px] w-6 rounded-full bg-gradient-to-r from-[#f9e7b9] via-[#e0c468] to-[#b8911a] shadow-[0_0_4px_1px_rgba(255,236,180,0.35)] transition-all duration-500 ${open ? 'w-6 opacity-100' : 'w-6'}`}
									/>
									{/* Barra vertical (se contrae al abrir) */}
									<span
										className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-gradient-to-b from-[#f9e7b9] via-[#e0c468] to-[#b8911a] shadow-[0_0_4px_1px_rgba(255,236,180,0.35)] transition-all duration-500 origin-center ${open ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'}`}
									/>
								</span>
								{/* Línea inferior brillante al hover / abierto */}
								<span className={`pointer-events-none absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#fcecb8]/60 to-transparent transition-all duration-500 ${open ? 'opacity-70' : 'opacity-0 group-hover:opacity-50'}`}></span>
							</span>
						)}
						<span className={`relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:bg-current after:rounded-full after:transition-[width,background-color] after:duration-600 after:ease-[cubic-bezier(.77,0,.22,1)] ${open ? 'after:w-full' : 'after:w-0 group-hover:after:w-full'} whitespace-nowrap`}>{grupo.titulo}</span>
					</span>
				</button>
			</div>
			<div className={`space-y-4 transition-all duration-400 ${open ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'} `}>
				{/* Imagen de subcategoría */}
				{collapsible && getSubcategoryImage(grupo.titulo) && (
					<div className="relative rounded-xl overflow-hidden border border-neutral-700/60 bg-neutral-800/50 backdrop-blur-sm shadow-sm">
						<Image
							src={getSubcategoryImage(grupo.titulo)}
							alt={`Ilustración de ${grupo.titulo}`}
							width={832}
							height={468}
							className="w-full h-auto object-cover"
							priority={false}
						/>
					</div>
				)}
				{grupo.leyendas && grupo.leyendas.length > 0 && (
					<div className="space-y-3">
						{grupo.leyendas.map((l: string, idx: number) => (
							<p key={idx} className="whitespace-pre-line text-[13px] leading-snug text-neutral-300 bg-neutral-800/60 backdrop-blur-sm rounded-md p-3 border border-neutral-700 shadow-sm">
								{l}
							</p>
						))}
					</div>
				)}
				{grupo.items.length > 0 && <ItemGrid items={grupo.items} slug={categoriaSlug} onExpand={onExpand} groupTitle={grupo.titulo} />}
				{grupo.subgrupos && grupo.subgrupos.length > 0 && (
					<div className="space-y-6 pt-2 pl-1 border-l-2 border-petroleo/20">
						{grupo.subgrupos.map((sub: GrupoMenu) => (
							<GrupoSection
								key={sub.titulo}
								grupo={sub}
								depth={depth + 1}
								categoriaSlug={categoriaSlug}
								onExpand={onExpand}
								collapsible={grupo.titulo !== 'Copeo' && collapsible}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

const ItemGrid: React.FC<{ items: MenuItem[]; slug?: string; onExpand: (item: MenuItem, groupTitle?: string) => void; groupTitle?: string }> = ({ items, slug, onExpand, groupTitle }) => {
	return (
		<ul className="grid grid-cols-1 gap-4">
			{items.map(item => (
				<ItemCard key={item.id} item={item} slug={slug} onExpand={onExpand} groupTitle={groupTitle} />
			))}
		</ul>
	);
};

const ItemCard: React.FC<{ item: MenuItem; slug?: string; onExpand: (item: MenuItem, groupTitle?: string) => void; groupTitle?: string }> = ({ item, slug, onExpand, groupTitle }) => {
	const { add, items, inc, dec } = useSelection();
	const selected = items.find((r: { id: string; qty: number }) => r.id === item.id);
	const openModal = () => onExpand(item, groupTitle);
	return (
		<li className="group relative rounded-xl border border-neutral-700 bg-neutral-800/60 backdrop-blur-sm px-4 pt-4 pb-5 shadow-sm hover:shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-petroleo/50 will-change-transform animate-scale-fade cursor-pointer" onClick={openModal}>
			<div className="flex items-start justify-between gap-3">
				<h3 className="font-semibold text-[18px] tracking-wide font-[var(--font-display)] text-neutral-50 leading-snug">
					{item.nombre}
				</h3>
				<span className="shrink-0 inline-flex items-center rounded-md bg-petroleo/25 text-magnolias text-[13px] font-semibold px-2 py-1 border border-petroleo-strong/40 shadow-sm">
					${item.precio}
				</span>
			</div>
			{item.descripcion && (
				<p className="mt-1 text-[14px] leading-snug text-neutral-200/95 line-clamp-3">
					{item.descripcion}
				</p>
			)}
			{/* Controles de selección */}
			<div className="mt-3 flex items-center justify-end" onClick={e => e.stopPropagation()}>
				{!selected && (
					<button
						onClick={() => {
							// Si es un ítem de paquetes, abrir modal de acompañantes
							if (groupTitle === 'Paquetes') {
								onExpand(item, groupTitle);
							} else {
								add(item, slug || 'categoria');
							}
						}}
						className="group inline-flex items-center gap-1 rounded-full bg-gradient-to-b from-[#e9cc70] via-[#d4af37] to-[#b28714] text-[#2a2105] text-[13px] font-semibold px-3.5 py-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_3px_8px_-1px_rgba(0,0,0,0.55),0_0_0_5px_rgba(212,175,55,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5e3a4]/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white/5 transition-all duration-300 active:scale-[0.95] hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_5px_14px_-2px_rgba(0,0,0,0.6),0_0_0_6px_rgba(212,175,55,0.28)]"
						aria-label={`Agregar ${item.nombre}`}
						data-variant="add"
					>
						<span className="text-[28px] leading-none -translate-y-[1px] font-[var(--font-alt-display)]">＋</span>
						<span>Pedir al Mesero</span>
					</button>
				)}
				{selected && (
					<div className="flex items-center gap-2 bg-petroleo-strong/25 rounded-full px-2 py-1">
						<button onClick={() => dec(selected.id)} className="h-8 w-8 rounded-full bg-petroleo-strong text-magnolias text-[18px] leading-none flex items-center justify-center">-</button>
						<span className="min-w-[2rem] text-center text-[14px] font-semibold text-magnolias">{selected.qty}</span>
						<button onClick={() => inc(selected.id)} className="h-8 w-8 rounded-full bg-petroleo-strong text-magnolias text-[18px] leading-none flex items-center justify-center">+</button>
					</div>
				)}
			</div>
			<div className="pointer-events-none absolute inset-0 rounded-xl ring-0 group-hover:ring-[3px] ring-petroleo/0 group-hover:ring-magnolias/40 transition" />
		</li>
	);
};

export default MenuDisplay;
