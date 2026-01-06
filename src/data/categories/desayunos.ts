import { CategoriaMenu } from '../menu';

const categoria: CategoriaMenu = {
  id: 'cat-desayunos',
  nombre: 'Desayunos',
  slug: 'desayunos',
  items: [],
  grupos: [
    {
      titulo: 'Paquetes',
      leyendas: ['INCLUYEN FRUTA, JUGO DE NARANJA O LIMONADA,', 'REFILL DE CAFÉ (HASTA 3 TAZAS) O UN TÉ.'],
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
      ]
    },
    {
      titulo: 'De la Granja', items: [
        { id: 'DB011', nombre: 'Huevos Regionales', descripcion: '3 huevos en salsa verde con longaniza de la región, tortillas hechas a mano y frijoles refritos', precio: 120 },
        { id: 'DB012', nombre: 'Huevos al Albañil', descripcion: 'Huevos revueltos con arrachera en salsa verde cruda, acompañado de tortillas a mano', precio: 120 },
        { id: 'DB013', nombre: 'Huevos Divorciados', descripcion: '2 huevos fritos sobre tortillas hechas a mano, bañados en salsa verde o roja, crema y gratinados', precio: 120 },
        { id: 'DB014', nombre: 'Huevos Magnolias', descripcion: 'Huevos revueltos con cocina en salsa mora acompañados de huarache con base de frijol', precio: 150 },
        { id: 'DB015', nombre: 'Huevos Tirados', descripcion: 'Huevos revueltos con frijoles y chiles verdes picados, acompañados de aguacate, queso fresco y tortillas hechas a mano', precio: 90 },
        { id: 'DB016', nombre: 'Huevo con Mole', descripcion: 'Huevo con mole', precio: 115 },
      ]
    },
    {
      titulo: 'Toast', items: [
        { id: 'TS001', nombre: 'Jamón Serrano', descripcion: 'Pan de masa madre, aguacate, jamón serrano, almendra fileteada, ajonjoli, balsámico y miel', precio: 135 },
        { id: 'TS002', nombre: 'Mediterráneo', descripcion: 'Pan de masa madre, tomate cherry, salmón, toque de pesto, salsa macha con arándano y queso de cabra', precio: 150 },
        { id: 'TS003', nombre: 'Avocado', descripcion: 'Pan de masa madre, queso philadelphia, aguacate, salsa macha con arándanos, pechuga de pavo o huevo estrellado', precio: 130 },
      ]
    },
    {
      titulo: 'Omelettes', items: [
        { id: 'OM001', nombre: 'Omelette Jamón y Queso', descripcion: 'Omelette con queso manchego y jamón de pavo, guarnición puré de papa al horno con queso provolone y pico de gallo', precio: 130 },
        { id: 'OM002', nombre: 'Omelette Champiñones con Tocino y Queso', descripcion: 'Omelette con champiñones frescos, tocino, queso manchego, guarnición puré de papa al horno con queso provolone y pico de gallo', precio: 130 },
        { id: 'OM003', nombre: 'Omelette Ligero', descripcion: 'Claras de huevo, relleno de espinacas con queso de cabra o champiñones con queso panela, acompañado de pico de gallo y ensalada', precio: 150 },
        { id: 'OM004', nombre: 'Omelette Mediterráneo', descripcion: 'Claras de huevo, espinacas, queso oxxaca, salmón, acompañado de ensalada de espinacas con jitomate cherry', precio: 160 },
      ]
    },
    {
      titulo: 'Enchiladas, chilaquiles y más', items: [
        { id: 'EN001', nombre: 'Enchiladas Magnolias', descripcion: 'Enchiladas rellenas de pollo sazonado con salsa cremosa especial de la casa a base de champiñones, gratinadas y terminadas con cebolla morada', precio: 150 },
        { id: 'EN002', nombre: 'Enchiladas Suizas', descripcion: 'Enchiladas rellenas de pollo sazonado, con salsa cremosa, gratinadas', precio: 150 },
        { id: 'EN003', nombre: 'Enmoladas', descripcion: 'Rellenas de pollo o queso panela, terminadas con cebolla morada, crema, queso y ajonjolí', precio: 160 },
        { id: 'EN004', nombre: 'Enchiladas Charola', descripcion: '4 piezas de enchiladas con pollo o queso fundido con crema, queso, lechuga y cebolla', precio: 80 },
        { id: 'EN005', nombre: 'Enchiladas Rellenas', descripcion: 'Enchiladas rellenas de arrachera, pollo, huevo o queso panela con salsa a elegir (habanero, mora, pasilla, verde)', precio: 140 },
        { id: 'CL001', nombre: 'Chilaquiles Especiales', descripcion: 'Chilaquiles terminados con cebolla morada, cilantro, rábano, queso, crema y aguacate. Salsa a elegir y proteína a elegir', precio: 135 },
        { id: 'SP001', nombre: 'Sopes', descripcion: '4 piezas de sopes con frijoles refritos, salsa tatemada, crema, cebolla y queso. Proteína a elegir', precio: 115 },
        { id: 'PL001', nombre: 'Cecina Especial', descripcion: 'Cecina con enchiladas o chilaquiles, salsa de su preferencia y frijoles refritos', precio: 190 },
        { id: 'PL002', nombre: 'Arrachera', descripcion: '220g de arrachera acompañada de 3 sopes o enchiladas', precio: 240 },
        { id: 'PL003', nombre: 'Pechuga de Pollo al Grill', descripcion: 'Pechuga de pollo al grill acompañada con ensalada o chilaquiles', precio: 150 },
        { id: 'SD001', nombre: 'Club Sandwich', descripcion: 'Sandwich a base de pan de caja con pechuga de pollo empanizada, jamón, tocino, lechuga, jitomate, queso manchego, acompañado de papas a la francesa', precio: 130 },
        { id: 'SD002', nombre: 'Toast Sandwich', descripcion: 'Pan integral con pechuga de pollo a la plancha, lechuga, queso panela y aguacate, acompañado de ensalada', precio: 150 },
        { id: 'BG001', nombre: 'Baguette Clásico Ahumado', descripcion: 'Pan masa madre con jamón, queso provolone, acompañado de papas gajo y aguacate', precio: 185 },
        { id: 'BG002', nombre: 'Baguette Magno', descripcion: 'Pan masa madre con salmón al pesto, espinaca, jitomate cherry, rábano encurtido y aderezo Philadelphia con chipotle', precio: 200 },
        { id: 'BG003', nombre: 'Baguette Cochinita Pibil', descripcion: 'Baguette con cochinita pibil', precio: 190 },
        { id: 'BG004', nombre: 'Baguette Rib Eye o Arrachera', descripcion: '180g de Rib Eye o Arrachera en pan masa madre con espinacas, queso provolone gratinado, acompañado de papas gajo, aguacate y salsa macha', precio: 200 },
      ]
    },
    {
      titulo: 'Dulces, pan y fruta', items: [
        { id: 'PS002', nombre: 'Waffles con Nutella', descripcion: 'Waffles cubierto de nutella, plátano y helado', precio: 95 },
        { id: 'PS003', nombre: 'Mini Hot Cakes', descripcion: 'Mini hot cakes con frutos rojos, lechera y crema batida', precio: 85 },
        { id: 'PS004', nombre: 'Hot Cakes', descripcion: '3 piezas de hot cakes con complemento (maple, mermelada o lechera)', precio: 95 },
        { id: 'PS005', nombre: 'Concha Rellena', descripcion: 'Concha rellena de nata o nutella', precio: 50 },
        { id: 'PS006', nombre: 'Concha Rellena Especial', descripcion: 'Concha rellena de nata con fresas o nutella con fresas', precio: 60 },
        { id: 'PS007', nombre: 'Bisquets a la Plancha', descripcion: 'Bisquets a la plancha con mermelada de fresa', precio: 45 },
        { id: 'PS008', nombre: 'Bisquets con Duraznos', descripcion: 'Bisquets con duraznos en almíbar y lechera', precio: 70 },
        { id: 'PS009', nombre: 'Pan Gourmet', descripcion: 'Pan gourmet', precio: 35 },
        { id: 'PS010', nombre: 'Concha', descripcion: 'Concha tradicional', precio: 25 },
        { id: 'PS011', nombre: 'Bowl de Frutos Rojos', descripcion: 'Bowl con frutos rojos, yogurt griego y granola', precio: 120 },
        { id: 'PS012', nombre: 'Plato de Fruta de Temporada', descripcion: 'Plato de fruta de temporada acompañado de miel y granola', precio: 75 },
      ]
    },
  ],
};

export default categoria;
