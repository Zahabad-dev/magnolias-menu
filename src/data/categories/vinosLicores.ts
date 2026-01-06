import { CategoriaMenu } from '../menu';

const categoria: CategoriaMenu = {
  id: 'cat-vinos-licores',
  nombre: 'Vinos y Licores',
  slug: 'vinos-licores',
  items: [], // Movimos todo a grupos para diseño colapsible
  grupos: [
    {
      titulo: 'Vinos',
      items: [
        { id: 'VL001', nombre: 'Matarromera Crianza', descripcion: 'Vino tinto Matarromera Crianza', precio: 1500 },
        { id: 'VL002', nombre: 'Casa Madero 3V', descripcion: 'Vino Casa Madero 3V', precio: 900 },
        { id: 'VL003', nombre: 'La Cetto Cabernet Sauvignon', descripcion: 'Vino tinto La Cetto Cabernet Sauvignon', precio: 350 },
        { id: 'VL004', nombre: 'La Cetto Merlot', descripcion: 'Vino tinto La Cetto Merlot', precio: 350 },
        { id: 'VL005', nombre: 'Casillero del Diablo Merlot', descripcion: 'Vino tinto Casillero del Diablo Merlot', precio: 550 },
        { id: 'VL006', nombre: 'Lambrusco', descripcion: 'Vino Lambrusco', precio: 350 },
      ]
    },
    {
      titulo: 'Cervezas',
      items: [
        { id: 'CV001', nombre: 'Heineken', descripcion: 'Cerveza Heineken', precio: 45 },
        { id: 'CV002', nombre: 'Heineken 00', descripcion: 'Cerveza sin alcohol', precio: 50 },
        { id: 'CV003', nombre: 'Amstel Ultra', descripcion: 'Cerveza Amstel Ultra', precio: 45 },
        { id: 'CV004', nombre: 'Bohemia', descripcion: 'Cerveza Bohemia', precio: 45 },
        { id: 'CV005', nombre: 'Indio', descripcion: 'Cerveza Indio', precio: 35 },
        { id: 'CV006', nombre: 'XX Lager', descripcion: 'Cerveza XX Lager', precio: 35 },
        { id: 'CV007', nombre: 'Tecate', descripcion: 'Cerveza Tecate', precio: 35 },
        { id: 'CV008', nombre: 'Tarro Michelado', descripcion: 'Tarro michelado con salsas y chamoy', precio: 15 },
        { id: 'CV009', nombre: 'Tarro de Salsas', descripcion: 'Tarro con salsas para michelada', precio: 10 },
        { id: 'CV010', nombre: 'Tarro Chelada', descripcion: 'Tarro de chelada', precio: 5 },
      ]
    },
    {
      titulo: 'Copeo',
      items: [], // Mantenemos items vacío para que funcione con subgrupos
      subgrupos: [
        {
          titulo: 'Whisky',
          items: [
            { id: 'CP001', nombre: "Buchanan's Deluxe", descripcion: "Whisky Buchanan's Deluxe", precio: 90 },
            { id: 'CP002', nombre: "Buchanan's Master", descripcion: "Whisky Buchanan's Master", precio: 110 },
            { id: 'CP003', nombre: "Buchanan's Two Souls", descripcion: "Whisky Buchanan's Two Souls", precio: 100 },
            { id: 'CP004', nombre: 'Black & White', descripcion: 'Whisky Black & White', precio: 50 },
          ]
        },
        {
          titulo: 'Coñac',
          items: [
            { id: 'CP005', nombre: 'Martell VS', descripcion: 'Coñac Martell VS', precio: 100 },
          ]
        },
        {
          titulo: 'Licores',
          items: [
            { id: 'LIC001', nombre: 'Crema de Whisky Baileys', descripcion: 'Licor de crema de whisky Baileys', precio: 90 },
            { id: 'LIC002', nombre: 'Ancho Reyes con Frutos Rojos', descripcion: 'Licor Ancho Reyes con frutos rojos', precio: 100 },
            { id: 'LIC003', nombre: 'Ancho Reyes con Refresco de Toronja', descripcion: 'Licor Ancho Reyes con refresco de toronja', precio: 70 },
          ]
        },
        {
          titulo: 'Brandy',
          items: [
            { id: 'BRD001', nombre: 'Torres 5', descripcion: 'Brandy Torres 5', precio: 50 },
            { id: 'BRD002', nombre: 'Torres 10', descripcion: 'Brandy Torres 10', precio: 70 },
            { id: 'BRD003', nombre: 'Torres 15', descripcion: 'Brandy Torres 15', precio: 90 },
          ]
        },
        {
          titulo: 'Ron',
          items: [
            { id: 'RON001', nombre: 'Matusalem Platino', descripcion: 'Ron Matusalem Platino', precio: 55 },
            { id: 'RON002', nombre: 'Captain Morgan Spiced', descripcion: 'Ron Captain Morgan Spiced', precio: 45 },
            { id: 'RON003', nombre: 'Bacardi Añejo', descripcion: 'Ron Bacardi Añejo', precio: 55 },
            { id: 'RON004', nombre: 'Bacardi Blanco', descripcion: 'Ron Bacardi Blanco', precio: 50 },
          ]
        },
        {
          titulo: 'Tequila',
          items: [
            { id: 'TEQ001', nombre: '1800 Cristalino Añejo', descripcion: 'Tequila 1800 Cristalino Añejo', precio: 140 },
            { id: 'TEQ002', nombre: 'Maestro Dobel Diamante', descripcion: 'Tequila Maestro Dobel Diamante', precio: 110 },
            { id: 'TEQ003', nombre: 'Don Julio 70 Cristalino', descripcion: 'Tequila Don Julio 70 Cristalino', precio: 140 },
            { id: 'TEQ004', nombre: 'José Cuervo Tradicional Reposado', descripcion: 'Tequila José Cuervo Tradicional Reposado', precio: 55 },
            { id: 'TEQ005', nombre: 'José Cuervo Tradicional Plata', descripcion: 'Tequila José Cuervo Tradicional Plata', precio: 55 },
            { id: 'TEQ006', nombre: 'José Cuervo Especial Reposado', descripcion: 'Tequila José Cuervo Especial Reposado', precio: 50 },
          ]
        },
        {
          titulo: 'Mezcal',
          items: [
            { id: 'MEZ001', nombre: 'Mezcal Montelobos', descripcion: 'Mezcal Montelobos', precio: 90 },
            { id: 'MEZ002', nombre: '400 Conejos', descripcion: 'Mezcal 400 Conejos', precio: 90 },
          ]
        },
        {
          titulo: 'Ginebra',
          items: [
            { id: 'GIN001', nombre: 'Bombay Sapphire', descripcion: 'Ginebra Bombay Sapphire', precio: 90 },
          ]
        },
        {
          titulo: 'Vodka',
          items: [
            { id: 'VOD001', nombre: 'Grey Goose', descripcion: 'Vodka Grey Goose', precio: 80 },
            { id: 'VOD002', nombre: 'Smirnoff', descripcion: 'Vodka Smirnoff', precio: 45 },
            { id: 'VOD003', nombre: 'Absolut Vodka', descripcion: 'Vodka Absolut', precio: 55 },
          ]
        },
      ]
    },
  ],
};

export default categoria;
