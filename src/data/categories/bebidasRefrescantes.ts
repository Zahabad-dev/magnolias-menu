import { CategoriaMenu } from '../menu';

const bebidasRefrescantes: CategoriaMenu = {
  id: 'cat-bebidas-refrescantes',
  nombre: 'Bebidas Refrescantes',
  slug: 'bebidas-refrescantes',
  items: [], // Movimos todo a grupos
  grupos: [
    {
      titulo: 'Limonadas y Bebidas Cítricas',
      items: [
        { id: 'BR001', nombre: 'Limonada Clásica', descripcion: 'Limonada natural refrescante', precio: 45 },
        { id: 'BR002', nombre: 'Limonada de Frutos Rojos', descripcion: 'Limonada combinada con frutos rojos', precio: 65 },
        { id: 'BR003', nombre: 'Limonada de Maracuyá', descripcion: 'Limonada con sabor a maracuyá', precio: 65 },
        { id: 'BR006', nombre: 'Naranjada', descripcion: 'Bebida refrescante de naranja', precio: 35 },
      ]
    },
    {
      titulo: 'Mocktails (Cocteles Sin Alcohol)',
      items: [
        { id: 'BR004', nombre: 'Mocktail Fresa-Maracuyá', descripcion: 'Coctel sin alcohol de fresa y maracuyá', precio: 90 },
        { id: 'BR005', nombre: 'Mocktail Frutos Rojos', descripcion: 'Coctel sin alcohol de frutos rojos', precio: 90 },
      ]
    },
    {
      titulo: 'Bebidas Tradicionales Mexicanas',
      items: [
        { id: 'BR007', nombre: 'Agua Rusa', descripcion: 'Bebida tradicional agua rusa', precio: 45 },
        { id: 'BR008', nombre: 'Clamato Preparado', descripcion: 'Clamato preparado estilo mexicano', precio: 55 },
        { id: 'BR009', nombre: 'Sangría Preparada', descripcion: 'Sangría preparada sin alcohol', precio: 55 },
        { id: 'BR010', nombre: 'Piñada', descripcion: 'Bebida refrescante de piña', precio: 80 },
      ]
    },
    {
      titulo: 'Jugos Naturales',
      leyendas: ['(Disponibles hasta la 1:00 pm)'],
      items: [
        { id: 'BR011', nombre: 'Jugo de Naranja', descripcion: 'Jugo de naranja natural recién exprimido', precio: 40 },
        { id: 'BR012', nombre: 'Jugo Verde', descripcion: 'Jugo verde natural con verduras frescas', precio: 40 },
        { id: 'BR013', nombre: 'Jugo de Zanahoria', descripcion: 'Jugo de zanahoria natural', precio: 40 },
      ]
    },
    {
      titulo: 'Bebidas Lácteas y Cremosas',
      items: [
        { id: 'BR014', nombre: 'Malteadas', descripcion: 'Malteada cremosa de fresa, vainilla o chocolate', precio: 60 },
        { id: 'BR015', nombre: 'Choco Milk', descripcion: 'Chocolate frío preparado', precio: 40 },
        { id: 'BR016', nombre: 'Spunch', descripcion: 'Bebida refrescante Spunch', precio: 85 },
        { id: 'BR017', nombre: 'Milky', descripcion: 'Bebida refrescante Milky', precio: 85 },
        { id: 'BF001', nombre: 'Frappuccino', descripcion: 'Bebida de café fría batida', precio: 85 },
        { id: 'BF002', nombre: 'Frappe Oreo', descripcion: 'Frappe con galletas Oreo', precio: 80 },
        { id: 'BF003', nombre: 'Frappe', descripcion: 'Frappe de Baileys, Crema Irlandesa, Chai, Taro, Matcha o Vainilla', precio: 85 },
        { id: 'BF004', nombre: 'Chai', descripcion: 'Té chai servido frío', precio: 70 },
        { id: 'BF005', nombre: 'Taro', descripcion: 'Bebida de taro servida fría', precio: 60 },
        { id: 'BF006', nombre: 'Matcha', descripcion: 'Matcha latte servido frío', precio: 70 },
        { id: 'BF007', nombre: 'Smoothies', descripcion: 'Smoothie cremoso de frutas', precio: 75 },
        { id: 'BF008', nombre: 'Smoothie Frutos Rojos', descripcion: 'Smoothie especial de frutos rojos', precio: 90 },
        { id: 'BF009', nombre: 'Smoothie Maracuyá con Frutos Rojos y Yogurt', descripcion: 'Smoothie de maracuyá con frutos rojos y yogurt', precio: 85 },
        { id: 'BF010', nombre: 'Smoothie Maracuyá con Frutos Rojos', descripcion: 'Smoothie de maracuyá con frutos rojos', precio: 85 },
      ]
    },
    {
      titulo: 'Aguas Frescas',
      items: [
        { id: 'BR018', nombre: 'Jarra de Frutos Rojos 1L', descripcion: 'Jarra de 1 litro de agua fresca de frutos rojos', precio: 90 },
        { id: 'BR020', nombre: 'Jarra de Frutos Rojos 2L', descripcion: 'Jarra de 2 litros de agua fresca de frutos rojos', precio: 140 },
        { id: 'BR019', nombre: 'Jarra del Día 1L', descripcion: 'Jarra de 1 litro de agua fresca del día', precio: 80 },
        { id: 'BR021', nombre: 'Jarra del Día 2L', descripcion: 'Jarra de 2 litros de agua fresca del día', precio: 130 },
      ]
    },
    {
      titulo: 'Refrescos y Sodas',
      items: [
        { id: 'BR022', nombre: 'Coca-Cola', descripcion: 'Refresco Coca-Cola (normal, light, sin azúcar)', precio: 40 },
        { id: 'BR023', nombre: 'Sprite', descripcion: 'Refresco Sprite lima-limón', precio: 40 },
        { id: 'BR024', nombre: 'Fresca', descripcion: 'Refresco Fresca de toronja', precio: 40 },
        { id: 'BR025', nombre: 'Fanta', descripcion: 'Refresco Fanta de naranja', precio: 40 },
        { id: 'BR026', nombre: 'Sidral Mundet', descripcion: 'Refresco Sidral Mundet de manzana', precio: 40 },
      ]
    },
    {
      titulo: 'Aguas Minerales y Tónicas',
      items: [
        { id: 'BR027', nombre: 'Agua Mineral Ciel', descripcion: 'Agua mineral Ciel', precio: 40 },
        { id: 'BR028', nombre: 'Agua Mineral Topo Chico', descripcion: 'Agua mineral Topo Chico', precio: 40 },
        { id: 'BR029', nombre: 'Perrier', descripcion: 'Agua mineral gasificada Perrier', precio: 60 },
        { id: 'BR030', nombre: 'Agua Tónica', descripcion: 'Agua tónica', precio: 40 },
        { id: 'BR031', nombre: 'Botella de Agua 600ml', descripcion: 'Botella de agua purificada de 600 ml', precio: 25 },
      ]
    },
  ],
};

export default bebidasRefrescantes;
