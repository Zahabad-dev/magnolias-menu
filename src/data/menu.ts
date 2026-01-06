// Tipos básicos
export type MenuItem = { id: string; nombre: string; descripcion: string; precio: number; imagen?: string };
export type GrupoMenu = { titulo: string; items: MenuItem[]; leyendas?: string[]; subgrupos?: GrupoMenu[] };
export type CategoriaMenu = { id: string; nombre: string; slug: string; items: MenuItem[]; grupos?: GrupoMenu[]; notaSuperior?: string };

// Metadatos ligeros para el carrusel (no incluye los items pesados)
const meta: Array<Pick<CategoriaMenu, 'id' | 'nombre' | 'slug'>> = [
	{ id: 'cat-desayunos', nombre: 'Desayunos', slug: 'desayunos' },
	{ id: 'cat-comidas', nombre: 'Comidas y Cenas', slug: 'comidas-cenas' },
	{ id: 'cat-menu-kids', nombre: 'Menu Kids', slug: 'menu-kids' },
	{ id: 'cat-bebidas-refrescantes', nombre: 'Bebidas Refrescantes', slug: 'bebidas-refrescantes' },
	{ id: 'cat-cafe', nombre: 'Bebidas Calientes', slug: 'cafe' },
	{ id: 'cat-postres', nombre: 'Postres', slug: 'postres' },
	{ id: 'cat-mixologia', nombre: 'Mixología', slug: 'mixologia' },
	{ id: 'cat-vinos-licores', nombre: 'Vinos y Licores', slug: 'vinos-licores' },
];

const slugToImage: Record<string, string> = {
	'desayunos': '/images/desayunos.png',
	'comidas-cenas': '/images/cenas.png',
	'bebidas-refrescantes': '/images/bebidas.png',
	'cafe': '/images/cafes.png',
	'postres': '/images/postres.png',
	'mixologia': '/images/mixologia.png',
	'vinos-licores': '/images/vinos.png',
	'menu-kids': '/images/kids.png',
};
export const categoriasCarousel = meta.map(c => ({
	...c,
	imagen: slugToImage[c.slug] ?? '/images/placeholder.svg'
}));

// Pre-carga estática opcional: Comidas y Cenas siempre disponible (evita flash / retraso)
import comidasCenasStatic from './categories/comidasCenas';
const STATIC_PRELOADED: Record<string, CategoriaMenu> = {
	'comidas-cenas': comidasCenasStatic,
};

// Carga dinámica por categoría (code-splitting): cada import crea un chunk separado.
// NOTA: Para completar se deben crear archivos en src/data/categories/*.ts con la estructura de cada categoría.
// Mientras esos archivos no existan, getCategoriaBySlug devolverá undefined.
export async function getCategoriaBySlug(slug: string): Promise<CategoriaMenu | undefined> {
	try {
		// Revisar primero si está en el set estático precargado
		if (STATIC_PRELOADED[slug]) return STATIC_PRELOADED[slug];
		switch (slug) {
			case 'desayunos':
				return (await import('./categories/desayunos')).default;
			case 'comidas-cenas':
				return (await import('./categories/comidasCenas')).default;
			case 'cafe':
				return (await import('./categories/cafe')).default;
			case 'postres':
				return (await import('./categories/postres')).default;
			case 'mixologia':
				return (await import('./categories/mixologia')).default;
			case 'bebidas-refrescantes':
				return (await import('./categories/bebidasRefrescantes')).default;
			case 'vinos-licores':
				return (await import('./categories/vinosLicores')).default;
			case 'menu-kids':
				return (await import('./categories/menuKids')).default;
			default:
				return undefined;
		}
	} catch (e) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn('Fallo al cargar categoría', slug, e);
		}
		return undefined;
	}
}

// Prefetch opcional (podría usarse más adelante para precalentar la siguiente categoría)
export function prefetchCategoria(slug: string) {
	getCategoriaBySlug(slug);
}

// Precalentar categorías clave al montar la app (puedes llamarlo una sola vez desde Layout o root)
export function prewarmCoreCategories() {
	// Hoy sólo aseguramos 'comidas-cenas' (ya está estática) pero dejamos la estructura para más.
	prefetchCategoria('desayunos');
}

