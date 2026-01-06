import { CategoriaMenu } from '../menu';

const categoria: CategoriaMenu = {
  id: 'cat-cafe',
  nombre: 'Bebidas Calientes',
  slug: 'cafe',
  items: [], // Movimos todo a grupos
  grupos: [
    {
      titulo: 'Cafés Espresso Puros',
      items: [
        { id: 'BC001', nombre: 'Espresso', descripcion: 'Café espresso tradicional (simple, doble, romano, cortado)', precio: 30 },
        { id: 'BC002', nombre: 'Espresso Doble', descripcion: 'Doble shot de café espresso', precio: 60 },
        { id: 'BC003', nombre: 'Espresso Romano', descripcion: 'Espresso con toque especial', precio: 60 },
        { id: 'BC004', nombre: 'Espresso Cortado', descripcion: 'Espresso con un toque de leche', precio: 35 },
        { id: 'BC006', nombre: 'Café Americano', descripcion: 'Café americano tradicional', precio: 40 },
        { id: 'BC005', nombre: 'Affogato', descripcion: 'Helado bañado en espresso (café + helado)', precio: 70 },
      ]
    },
    {
      titulo: 'Cafés con Leche',
      items: [
        { id: 'BC007', nombre: 'Capuccino', descripcion: 'Capuccino clásico', precio: 70 },
        { id: 'BC008', nombre: 'Capuccino Sabor', descripcion: 'Capuccino con sabor a vainilla, avellana, moka o crema irlandesa', precio: 80 },
        { id: 'BC009', nombre: 'Capuccino Magnolias', descripcion: 'Capuccino especial de la casa sabor Turin', precio: 85 },
        { id: 'BC010', nombre: 'Café Lechero', descripcion: 'Café con leche tradicional', precio: 75 },
        { id: 'BC012', nombre: 'Flat White', descripcion: 'Café flat white', precio: 55 },
        { id: 'BC013', nombre: 'Latte', descripcion: 'Latte tradicional', precio: 70 },
        { id: 'BC014', nombre: 'Latte Sabor', descripcion: 'Latte con sabor a vainilla, avellana, moka o crema irlandesa', precio: 85 },
        { id: 'BC015', nombre: 'Caramel Macciato', descripcion: 'Café con caramelo y leche', precio: 85 },
      ]
    },
    {
      titulo: 'Lattes Especiales',
      items: [
        { id: 'BC016', nombre: 'Taro Latte', descripcion: 'Latte con sabor a taro', precio: 85 },
        { id: 'BC017', nombre: 'Matcha Latte', descripcion: 'Latte con matcha', precio: 85 },
      ]
    },
    {
      titulo: 'Tés e Infusiones',
      items: [
        { id: 'BC018', nombre: 'Chai Clásico', descripcion: 'Té chai tradicional', precio: 80 },
        { id: 'BC019', nombre: 'Chai Vainilla', descripcion: 'Té chai con sabor a vainilla', precio: 80 },
        { id: 'BC020', nombre: 'Chai Sucio', descripcion: 'Chai con shot de espresso', precio: 80 },
        { id: 'BC021', nombre: 'Tisanas de Frutas', descripcion: 'Infusión de frutos de la pasión, fresa-kiwi o manzana-arándano', precio: 80 },
        { id: 'BC025', nombre: 'Tés Tradicionales', descripcion: 'Té verde, manzana canela, hierbabuena, manzanilla, fresa-vainilla o frutos del bosque', precio: 20 },
      ]
    },
    {
      titulo: 'Chocolates',
      items: [
        { id: 'BC022', nombre: 'Chocolate Clásico', descripcion: 'Chocolate caliente tradicional', precio: 70 },
        { id: 'BC023', nombre: 'Chocolate Espumoso', descripcion: 'Chocolate caliente espumoso', precio: 70 },
        { id: 'BC024', nombre: 'Chocolate Especial de la Casa', descripcion: 'Chocolate especial de la casa', precio: 85 },
      ]
    },
    {
      titulo: 'Servicio de Café',
      items: [
        { id: 'BC011', nombre: 'Café Refil', descripcion: 'Refill de café (hasta la 1:00 pm)', precio: 30 },
      ]
    },
  ],
};

export default categoria;
