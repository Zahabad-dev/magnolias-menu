import { CategoriaMenu } from '../menu';

const categoria: CategoriaMenu = {
  id: 'cat-comidas',
  nombre: 'Comidas y Cenas',
  slug: 'comidas-cenas',
  items: [],
  grupos: [
    {
      titulo: 'Entradas', items: [
        { id: 'AP001', nombre: 'Taco Chile Relleno Gobernador', descripcion: '1 pieza de taco chile relleno gobernador con frijoles, camarones y una costra de queso', precio: 75 },
        { id: 'AP002', nombre: 'Queso Fundido', descripcion: 'Queso fundido con chistorra, chorizo argentino, arrachera o champiñones', precio: 130 },
        { id: 'AP003', nombre: 'Tostada de Agua Chile de Camarón', descripcion: 'Tostada de agua chile de camarón acompañada de aguacate, cilantro, cebolla morada, habanero y pepino', precio: 75 },
        { id: 'AP004', nombre: 'Guacamole', descripcion: 'Guacamole acompañado de chicharrón, queso fresco y totopos', precio: 100 },
        { id: 'AP005', nombre: 'Empanadas', descripcion: '3 piezas de empanadas de camarón con queso', precio: 120 },
        { id: 'AP006', nombre: 'Empalme de Cochinita Pibil', descripcion: 'Empalme de cochinita pibil con frijoles refritos, cochinita pibil y cebolla encurtida', precio: 85 },
        { id: 'AP007', nombre: 'Quesadillas de Huitlacoche', descripcion: '4 piezas de quesadillas de huitlacoche', precio: 100 },
        { id: 'AP008', nombre: 'Tabla de Quesos y Carnes Frías Grande', descripcion: 'Tabla grande de quesos y carnes frías para 8 personas', precio: 600 },
        { id: 'AP009', nombre: 'Tabla de Quesos y Carnes Frías Chica', descripcion: 'Tabla chica de quesos y carnes frías para 2-3 personas', precio: 350 },
      ]
    },
    {
      titulo: 'Sopas y Pastas', items: [
        { id: 'SP002', nombre: 'Sopa Azteca', descripcion: 'Sopa con julianas de tortillas de maíz en caldillo, con queso, crema, chile pasilla, chicharrón esponjado y aguacate', precio: 80 },
        { id: 'SP003', nombre: 'Caldo Tlalpeño', descripcion: 'Caldo con cubos de pollo, aguacate, zanahoria, papa y cubitos de queso', precio: 70 },
        { id: 'SP004', nombre: 'Caldo Magnolias', descripcion: 'Caldo con arroz, pollo desebrado, huevo duro sin yema, queso, aguacate, cilantro, cebolla, jitomate y chiles verdes', precio: 80 },
        { id: 'PA001', nombre: 'Pasta Poblana', descripcion: 'Fetuchini con crema de chile poblano, granos de elote, queso panela y pechuga de pollo al grill', precio: 190 },
        { id: 'PA002', nombre: 'Pasta Alfredo', descripcion: 'Pasta Alfredo con pechuga de pollo al grill y champiñones', precio: 230 },
        { id: 'PA003', nombre: 'Pasta al Pesto', descripcion: 'Pasta al pesto con camarones sarteneados al pesto', precio: 200 },
        { id: 'PA004', nombre: 'Pasta al Chipotle', descripcion: 'Fettuchine con camarones al chipotle', precio: 230 },
      ]
    },
    {
      titulo: 'Ensaladas', items: [
        { id: 'SL001', nombre: 'Ensalada Dell', descripcion: 'Mix de lechuga, uva verde, fresa, blue Berry, arándanos, nuez, bolitas de queso philadelphia y ajonjoli', precio: 180 },
        { id: 'SL002', nombre: 'Ensalada Griega', descripcion: 'Mix de lechugas, duraznos en almíbar a la plancha, piña a la plancha, pera, albahaca, queso de cabra, nuez troceada tostada y canela', precio: 180 },
        { id: 'SL003', nombre: 'Ensalada Magnolias', descripcion: 'Mix de lechugas, espinacas, jitomate cherry, ajonjoli tostado, pasta fusilli, salmón, aguacate y queso cabra', precio: 180 },
        { id: 'SL004', nombre: 'Ensalada de la Huerta', descripcion: 'Lechuga, espinaca, queso de cabra, gajos de naranja, plátano macho, anis y nuez', precio: 160 },
        { id: 'SL005', nombre: 'Ensalada Tirana', descripcion: 'Arrachera, lechuga, espinaca, champiñones, queso provolone, aguacate, jitomate y cebolla morada', precio: 160 },
      ]
    },
    {
      titulo: 'Del mar', items: [
        { id: 'SM001', nombre: 'Salmón Magnolias', descripcion: '220g de salmón con salsa cremosa, queso parmesano, tomate Cherry y espinacas. Acompañado de fetuccini', precio: 285 },
        { id: 'SM002', nombre: 'Salmón a las Finas Hierbas', descripcion: '220g de salmón con ensalada de la casa y papa al horno', precio: 260 },
        { id: 'SM003', nombre: 'Camarones Magnolias', descripcion: 'Camarones rellenos de queso Philadelphia, envueltos con tocino sobre salsa de la casa, acompañados de ensalada', precio: 240 },
      ]
    },
    {
      titulo: 'Pollo', items: [
        { id: 'PL004', nombre: 'Pechuga en Salsa de Queso', descripcion: 'Pechuga de pollo rellena en salsa de queso con chipotle y ensalada de la casa', precio: 170 },
        { id: 'PL005', nombre: 'Pechuga Cordon Blue', descripcion: 'Pechuga de pollo empanizada, rellena de queso manchego y jamón con ensalada', precio: 170 },
        { id: 'PL006', nombre: 'Pechuga Asada', descripcion: '200g de pechuga asada acompañada de ensalada y papa al horno', precio: 160 },
      ]
    },
    {
      titulo: 'Cortes', items: [
        { id: 'CT001', nombre: 'Arrachera', descripcion: '220g de arrachera con guarniciones', precio: 260 },
        { id: 'CT002', nombre: 'Rib Eye', descripcion: '220g de rib eye con guarniciones', precio: 260 },
        { id: 'CT003', nombre: 'New York', descripcion: '220g de corte New York con guarniciones', precio: 260 },
        { id: 'CT004', nombre: 'Cow Boy', descripcion: 'Corte cow boy con guarniciones', precio: 260 },
        { id: 'CT005', nombre: 'Aguja Norteña', descripcion: '220g de aguja norteña con guarniciones', precio: 260 },
        { id: 'CT006', nombre: 'Cecina', descripcion: '180g de cecina con guarniciones', precio: 190 },
      ], leyendas: [
        'Guarnición A:\nPapa al horno gratinada con queso provolone y chile jalapeño relleno de queso (Excepto cecina)',
        'Guarnición B:\nGuacamole, nopal, cebolla cambray, quesadilla y chorizo'
      ]
    },
    {
      titulo: 'Tacos', items: [
        { id: 'TC001', nombre: 'Tacos Arrachera', descripcion: '3 tacos de arrachera (180g total)', precio: 160 },
        { id: 'TC002', nombre: 'Tacos Rib Eye', descripcion: '3 tacos de rib eye (180g total)', precio: 160 },
        { id: 'TC003', nombre: 'Tacos Chorizo Argentino', descripcion: '3 tacos de chorizo argentino', precio: 150 },
        { id: 'TC004', nombre: 'Tacos Chistorra', descripcion: '3 tacos de chistorra', precio: 150 },
        { id: 'TC005', nombre: 'Tacos Cochinita Pibil', descripcion: '3 tacos de cochinita pibil', precio: 150 },
        { id: 'TC006', nombre: 'Tacos Fish', descripcion: 'Tacos de pescado', precio: 130 },
      ]
    },
    {
      titulo: 'Especialidades del Chef', items: [
        { id: 'CF001', nombre: 'Chile Magnolias', descripcion: 'Pieza de chile poblano relleno de frijol, queso y carne a elegir (cecina, arrachera o aguja norteña), bañado en salsa a elegir', precio: 130 },
      ]
    },
    {
      titulo: 'Snacks', items: [
        { id: 'SK001', nombre: 'Alitas', descripcion: '6 piezas de alitas en salsa a elegir: mango-habanero, búfalo, BBQ, habanero o jalapeño', precio: 110 },
        { id: 'SK002', nombre: 'Boneless', descripcion: '220g de boneless en salsa a elegir: mango-habanero, búfalo, BBQ, habanero o jalapeño', precio: 110 },
        { id: 'BG005', nombre: 'Hamburguesa Magnolias', descripcion: 'Hamburguesa con bollo parillero, arrachera y chorizo argentino, queso provolone, espinaca, jitomate, pepinillos, aderezo. Acompañada con papas gajo', precio: 180 },
        { id: 'BG006', nombre: 'Hamburguesa Mar y Tierra', descripcion: 'Hamburguesa con bollo parillero, carne de res, camarones empanizados, salsa tártara y aderezo de chipotle. Con papas gajo', precio: 180 },
        { id: 'BG007', nombre: 'Hamburguesa Tradicional', descripcion: 'Hamburguesa con carne de res, queso manchego, queso amarillo, tocino, pepinillos, cátsup, mostaza y mayonesa. Con papas a la francesa', precio: 150 },
        { id: 'AD001', nombre: 'Papas a la Francesa', descripcion: '300g de papas a la francesa', precio: 60 },
        { id: 'AD002', nombre: 'Papas Gajo', descripcion: '250g de papas gajo', precio: 60 },
        { id: 'AD003', nombre: 'Papas Magnolias', descripcion: '250g de papas con queso derretido y tocino', precio: 80 },
      ]
    },
  ],
};

export default categoria;
