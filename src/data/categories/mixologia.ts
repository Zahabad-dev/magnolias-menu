import { CategoriaMenu } from '../menu';

const categoria: CategoriaMenu = {
  id: 'cat-mixologia',
  nombre: 'Mixología',
  slug: 'mixologia',
  items: [], // Movimos todo a grupos
  grupos: [
    {
      titulo: 'Coctelería',
      items: [
        { id: 'CO001', nombre: 'Frozen Daiquiri', descripcion: 'Ron, jugo de limón, jarabe', precio: 85 },
        { id: 'CO002', nombre: 'Daiquiri', descripcion: 'Daiquiri de fresa, menta o maracuyá', precio: 95 },
        { id: 'mix6', nombre: 'Negroni', descripcion: 'Gin, vermouth rosso y bitter italiano, balance amargo-dulce', precio: 115 },
        { id: 'CO004', nombre: 'Zambuca', descripcion: 'Licor Zambuca', precio: 90 },
        { id: 'CO005', nombre: 'Piña Colada', descripcion: 'Ron, crema de coco, jugo de piña y leche evaporada', precio: 90 },
        { id: 'CO006', nombre: 'Mojito', descripcion: 'Ron, hierbabuena, limón, jarabe y agua mineral', precio: 60 },
        { id: 'CO007', nombre: 'Mojito de Frutos Rojos', descripcion: 'Ron, frutos rojos, hierbabuena, limón, jarabe y agua mineral', precio: 90 },
        { id: 'CO008', nombre: 'Mojito de Verano', descripcion: 'Mojito especial de verano', precio: 95 },
        { id: 'CO009', nombre: 'Vodka Tonic', descripcion: 'Vodka, jugo de limón y agua tónica', precio: 90 },
        { id: 'CO010', nombre: 'Bloody Mary', descripcion: 'Vodka, jugo de tomate, salsas, jugo de limón, sal y pimienta', precio: 70 },
        { id: 'CO011', nombre: 'Paloma', descripcion: 'Jose Cuervo Especial con refresco de toronja', precio: 50 },
        { id: 'mix5', nombre: 'Aperol Spritz', descripcion: 'Aperol, prosecco, naranja fresca y burbuja ligera', precio: 180 },
        { id: 'mix4', nombre: 'Carajillo', descripcion: 'Licor 43 y café expreso', precio: 130 },
        { id: 'CO014', nombre: 'Café Irlandés', descripcion: 'Whisky, café americano, azúcar y crema batida', precio: 70 },
        { id: 'CO015', nombre: 'Vampiro', descripcion: 'Tequila, jugo de limón, sangrita, refresco de toronja', precio: 90 },
        { id: 'CO016', nombre: 'Margarita', descripcion: 'Tequila, jugo de limón, licor de naranja, jarabe de granadina. Licuado con hielo', precio: 85 },
        { id: 'CO017', nombre: 'Margarita de Fresa', descripcion: 'Tequila, licor de fresa, jugo de limón, jarabe. Licuado con hielo', precio: 95 },
        { id: 'CO018', nombre: 'Mezcalitas', descripcion: 'Mezcal con sabor a pepino, piña o fresa', precio: 115 },
        { id: 'CO019', nombre: 'Gin & Tonic', descripcion: 'Ginebra y agua tónica. Decorado con cítrico, pepino o frutos rojos', precio: 100 },
        { id: 'CO020', nombre: 'Tinto de Verano', descripcion: 'Vermut dulce, vino tinto, jugo de limón, jarabe y sprite', precio: 110 },
        { id: 'CO021', nombre: 'Sangría/Sangría Blanca', descripcion: 'Vino tinto o blanco, agua mineral, jarabe y jugo de limón', precio: 95 },
        { id: 'CO022', nombre: 'Jarra Clericot', descripcion: 'Jarra de clericot para compartir', precio: 220 },
        { id: 'CO023', nombre: 'Copa de Clericot', descripcion: 'Copa individual de clericot', precio: 70 },
        { id: 'CO024', nombre: 'Mimosa', descripcion: 'Vino espumoso con jugo de naranja', precio: 120 },
        { id: 'CO025', nombre: 'Cosmopolitan', descripcion: 'Vodka, jugos de arándano y Controy', precio: 90 },

        // Manteniendo algunos cocteles premium existentes
        { id: 'mix9', nombre: 'Martini de Lychee', descripcion: 'Vodka premium, licor de lychee y toque floral', precio: 150 },
        { id: 'mix11', nombre: 'Whisky Sour', descripcion: 'Whisky, limón, almíbar natural y espuma suave', precio: 140 },
        { id: 'mix13', nombre: 'Spritz de Maracuyá', descripcion: 'Maracuyá natural, espumoso seco y bitter cítrico', precio: 140 },
        { id: 'mix14', nombre: 'French 75', descripcion: 'Gin, champaña, limón y ligero almíbar', precio: 160 },
        { id: 'mix15', nombre: 'Expresso Martini', descripcion: 'Vodka, café espresso, licor de café y espuma', precio: 155 },
        { id: 'mix17', nombre: 'Smoked Mezcalita', descripcion: 'Mezcal, limón, jarabe de agave y sal ahumada', precio: 150 },
        { id: 'mix20', nombre: 'Lavender Collins', descripcion: 'Gin, limón, jarabe de lavanda y soda fría', precio: 145 },
        { id: 'mix21', nombre: 'Cranberry Mule', descripcion: 'Vodka, arándano rojo, limón y ginger beer', precio: 130 },
        { id: 'mix22', nombre: 'Julep de Menta', descripcion: 'Bourbon, hierbabuena fresca y hielo frappé', precio: 140 },
        { id: 'mix23', nombre: 'Tamarindo Picante', descripcion: 'Tequila, tamarindo natural, chile seco y cítrico', precio: 145 },
        { id: 'mix24', nombre: 'Cocoa Old Fashioned', descripcion: 'Whisky, bitter de cacao, naranja flameada', precio: 155 },
        { id: 'mix25', nombre: 'Verde Herbal', descripcion: 'Mezcal, pepino, albahaca y limón fresco', precio: 150 },
        { id: 'mix8', nombre: 'Mezcal Mule', descripcion: 'Mezcal joven, ginger beer artesanal, limón y dash de angostura', precio: 150 },
      ]
    }
  ],
};

export default categoria;
