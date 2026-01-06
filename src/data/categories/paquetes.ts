import { CategoriaMenu } from '../menu';

const categoria: CategoriaMenu = {
  id: 'cat-paquetes',
  nombre: 'Paquetes',
  slug: 'paquetes',
  notaSuperior: 'INCLUYEN FRUTA, JUGO DE NARANJA O LIMONADA,\nREFILL DE CAFÉ (HASTA 3 TAZAS) O UN TÉ.',
  items: [
    { id: 'DB001', nombre: 'Huevos al Gusto', descripcion: '3 huevos preparados al gusto con jamón, chorizo, tocino o a la mexicana', precio: 135 },
    { id: 'DB002', nombre: 'Chilaquiles', descripcion: 'Chilaquiles rojos o verdes con pollo, huevo estrellado o hervido, terminados con cebolla, cilantro, queso y crema', precio: 140 },
    { id: 'DB003', nombre: 'Tacos Dorados', descripcion: '4 piezas de tacos dorados de papa o pollo bañados en salsa verde con lechuga, crema y queso', precio: 140 },
    { id: 'DB004', nombre: 'Molletes', descripcion: '4 piezas de molletes con ingrediente a elegir: arrachera, jamón de pavo o chorizo tradicional', precio: 150 },
    { id: 'DB005', nombre: 'Enfrijoladas', descripcion: 'Enfrijoladas rellenas de pollo, crema y gratinadas', precio: 150 },
    { id: 'DB006', nombre: 'Huarache', descripcion: 'Huarache con chorizo, cecina o huevo duro, base de frijol, cubierto de queso, crema, rábano y lechuga, acompañado de salsa molcajeteada', precio: 140 },
    { id: 'DB007', nombre: 'Huevo en Salsa', descripcion: 'Huevo en salsa verde, pasilla o mora', precio: 140 },
    { id: 'DB008', nombre: 'Envueltos Magnolias', descripcion: 'Envueltos rellenos de huevo bañados en salsa verde con cilantro, cebolla, crema y queso', precio: 150 },
    { id: 'DB009', nombre: 'Quesadillas Huitlacoche', descripcion: '4 piezas de quesadillas de huitlacoche', precio: 120 },
    { id: 'DB010', nombre: 'Quesadillas Chicharrón Prensado', descripcion: '4 piezas de quesadillas de chicharrón prensado', precio: 120 },
  ],
};

export default categoria;
