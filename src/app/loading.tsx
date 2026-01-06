// Pantalla de carga global para segmentos de la App Router
// Debe exportar por default un componente React válido
export default function Loading() {
	return (
		<div className="flex items-center justify-center w-full h-[50vh] animate-fade-soft">
			<div className="flex flex-col items-center gap-4 text-neutral-300">
				<div className="relative h-12 w-12">
					<div className="absolute inset-0 rounded-full border-4 border-petroleo/25 border-t-magnolias animate-[ring-spin_1s_linear_infinite]" />
					<div className="absolute inset-2 rounded-full bg-petroleo-strong/20 blur-sm" />
				</div>
				<span className="text-sm tracking-wide uppercase text-neutral-400">Cargando…</span>
				<span className="sr-only" role="status" aria-live="polite">Cargando contenido</span>
			</div>
		</div>
	);
}
