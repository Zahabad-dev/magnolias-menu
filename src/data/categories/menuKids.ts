import { CategoriaMenu } from '../menu';

const categoria: CategoriaMenu = {
    id: 'cat-menu-kids',
    nombre: 'Menu Kids',
    slug: 'menu-kids',
    items: [],
    grupos: [
        {
            titulo: 'Menú de Desayunos Infantil',
            leyendas: ['INCLUYE BEBIDA: LIMONADA NATURAL/MINERAL O CHOCOMILK FRÍO/TIBIO'],
            items: [
                { id: 'KP001', nombre: 'Molletes Tradicionales', descripcion: '2 piezas de molletes tradicionales con frijoles, jamón y queso', precio: 70 },
                { id: 'KP002', nombre: 'Enfrijoladas Gratinadas', descripcion: '2 piezas de enfrijoladas gratinadas', precio: 70 },
                { id: 'KP003', nombre: 'Entomatadas de Pollo con Queso', descripcion: '2 piezas de entomatadas de pollo con queso', precio: 70 },
                { id: 'KP004', nombre: 'Mini Hot Cakes Infantil', descripcion: 'Mini hot cakes con leche condensada o mermelada', precio: 70 },
                { id: 'KP005', nombre: 'Huevos al Gusto Infantil', descripcion: '2 huevos al gusto con jamón y frijoles', precio: 70 },
            ]
        },
        {
            titulo: 'Menú de Comidas Infantil',
            items: [
                { id: 'KP006', nombre: 'Hamburguesa Infantil', descripcion: 'Hamburguesa con carne de res, queso manchego, tocino, mayonesa, cátsup y mostaza. Acompañada de papas', precio: 90 },
                { id: 'KP007', nombre: 'Pechuga Empanizada con Papas', descripcion: 'Pechuga de pollo empanizada con papas', precio: 90 },
                { id: 'KP008', nombre: 'Spaghetti Italiano', descripcion: 'Spaghetti con crema, jitomate, jamón y queso', precio: 90 },
                { id: 'KP009', nombre: 'Sincronizadas', descripcion: 'Sincronizadas con tortilla de harina', precio: 50 },
                { id: 'KP010', nombre: 'Macarrones con Queso', descripcion: 'Macarrones con queso', precio: 120 },
                { id: 'KP011', nombre: 'Spaghetti con Deditos de Queso', descripcion: 'Spaghetti con deditos de queso', precio: 120 },
            ]
        }
    ]
};

export default categoria;