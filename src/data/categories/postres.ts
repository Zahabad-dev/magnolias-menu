import { CategoriaMenu } from '../menu';

const categoria: CategoriaMenu = {
  id: 'cat-postres',
  nombre: 'Postres',
  slug: 'postres',
  items: [
    { id: 'PT001', nombre: 'Pastel Turin', descripcion: 'Rebanada de pastel Turin', precio: 90 },
    { id: 'PT002', nombre: 'Pay de Elote con Helado de Vainilla', descripcion: 'Pay de elote acompañado de helado de vainilla', precio: 85 },
    { id: 'PT003', nombre: 'Flan Napolitano', descripcion: 'Flan napolitano tradicional', precio: 60 },
    { id: 'PT004', nombre: 'Bola de Helado', descripcion: '3 bolas de helado', precio: 55 },
    { id: 'PT005', nombre: 'Pastel de Nata', descripcion: 'Rebanada de pastel de nata', precio: 100 },
    { id: 'PT006', nombre: 'Pastel Ferrero', descripcion: '1 rebanada de pastel Ferrero', precio: 120 },
    { id: 'PT007', nombre: 'Pastel Raffaello', descripcion: '1 rebanada de pastel Raffaello', precio: 110 },
    { id: 'PT008', nombre: 'Cheese Cake Sin Azúcar', descripcion: 'Porción de cheese cake sin azúcar', precio: 90 },
    { id: 'PT009', nombre: 'Mousse de Guayaba', descripcion: 'Mousse de guayaba', precio: 90 },
    { id: 'PT010', nombre: 'Rol de Canela', descripcion: 'Rol de canela', precio: 65 },
  ],
};

export default categoria;
