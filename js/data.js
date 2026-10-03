// --- TABLA DE RACIONES (BÁSICOS) según Serafín Murillo ---
// gramsPerHCGiven10 = gramos del alimento que contienen 10 g de hidratos (1 ración)

const basicFoods = [
  // Panes
  { name: "Pan blanco (Barra)", gramsPerHCGiven10: 20, category: "Panes" },
  { name: "Pan integral", gramsPerHCGiven10: 20, category: "Panes" },
  { name: "Pan de molde blanco", gramsPerHCGiven10: 20, category: "Panes" },
  { name: "Pan de molde integral", gramsPerHCGiven10: 23, category: "Panes" },
  { name: "Pan tostado", gramsPerHCGiven10: 15, category: "Panes" },
  { name: "Pan de Centeno", gramsPerHCGiven10: 20, category: "Panes" },
  { name: "Pan de Maíz", gramsPerHCGiven10: 15, category: "Panes" },
  { name: "Pan de Pueblo (Hogaza)", gramsPerHCGiven10: 20, category: "Panes" },
  { name: "Pan Chapata", gramsPerHCGiven10: 20, category: "Panes" },
  { name: "Pan de Hamburguesa", gramsPerHCGiven10: 18, category: "Panes", unit: "ud" },
  { name: "Pan de Perrito", gramsPerHCGiven10: 18, category: "Panes", unit: "ud" },
  { name: "Picos / Regañás", gramsPerHCGiven10: 15, category: "Panes" },

  // Cereales
  { name: "Arroz cocido", gramsPerHCGiven10: 38, category: "Cereales" },
  { name: "Arroz integral cocido", gramsPerHCGiven10: 40, category: "Cereales" },
  { name: "Pasta cocida", gramsPerHCGiven10: 50, category: "Cereales" },
  { name: "Pasta integral cocida", gramsPerHCGiven10: 50, category: "Cereales" },
  { name: "Harina de trigo", gramsPerHCGiven10: 15, category: "Cereales" },
  { name: "Copos de avena", gramsPerHCGiven10: 15, category: "Cereales" },
  { name: "Cuscús cocido", gramsPerHCGiven10: 65, category: "Cereales" },
  { name: "Quinoa cocida", gramsPerHCGiven10: 48, category: "Cereales" },
  { name: "Maíz dulce (lata)", gramsPerHCGiven10: 50, category: "Cereales" },

  // Legumbres y tubérculos
  { name: "Lentejas cocidas", gramsPerHCGiven10: 50, category: "Legumbres" },
  { name: "Garbanzos cocidos", gramsPerHCGiven10: 50, category: "Legumbres" },
  { name: "Judías blancas cocidas", gramsPerHCGiven10: 50, category: "Legumbres" },
  { name: "Guisantes cocidos", gramsPerHCGiven10: 50, category: "Legumbres" },
  { name: "Patata cocida", gramsPerHCGiven10: 50, category: "Tubérculos" },
  { name: "Patata frita", gramsPerHCGiven10: 30, category: "Tubérculos" },
  { name: "Boniato asado", gramsPerHCGiven10: 50, category: "Tubérculos" },

  // Verduras
  { name: "Zanahoria cruda", gramsPerHCGiven10: 150, category: "Verduras" },
  { name: "Zanahoria cocida", gramsPerHCGiven10: 200, category: "Verduras" },
  { name: "Tomate", gramsPerHCGiven10: 300, category: "Verduras" },
  { name: "Pimiento rojo/verde", gramsPerHCGiven10: 300, category: "Verduras" },
  { name: "Cebolla", gramsPerHCGiven10: 150, category: "Verduras" },
  { name: "Lechuga / Especias", gramsPerHCGiven10: 300, category: "Verduras" },
  { name: "Espinacas", gramsPerHCGiven10: 300, category: "Verduras" },
  { name: "Brócoli", gramsPerHCGiven10: 300, category: "Verduras" },
  { name: "Calabacín", gramsPerHCGiven10: 300, category: "Verduras" },
  { name: "Berenjena", gramsPerHCGiven10: 300, category: "Verduras" },
  { name: "Champiñones", gramsPerHCGiven10: 1000, category: "Verduras" },

  // Frutas
  { name: "Manzana", gramsPerHCGiven10: 100, category: "Frutas" },
  { name: "Plátano", gramsPerHCGiven10: 50, category: "Frutas" },
  { name: "Naranja", gramsPerHCGiven10: 100, category: "Frutas" },
  { name: "Mandarina", gramsPerHCGiven10: 100, category: "Frutas" },
  { name: "Pera", gramsPerHCGiven10: 100, category: "Frutas" },
  { name: "Fresas", gramsPerHCGiven10: 100, category: "Frutas" },
  { name: "Uvas", gramsPerHCGiven10: 50, category: "Frutas" },
  { name: "Sandía", gramsPerHCGiven10: 200, category: "Frutas" },
  { name: "Melón", gramsPerHCGiven10: 200, category: "Frutas" },
  { name: "Kiwi", gramsPerHCGiven10: 100, category: "Frutas" },
  { name: "Piña", gramsPerHCGiven10: 100, category: "Frutas" },
  { name: "Melocotón", gramsPerHCGiven10: 100, category: "Frutas" },
  // Bollería
  { name: "Croissant (Normal)", gramsPerHCGiven10: 25, category: "Bollería", unit: "ud", gramsPerUnit: 40 },
  { name: "Croissant (Chocolate)", gramsPerHCGiven10: 30, category: "Bollería", unit: "ud", gramsPerUnit: 60 },
  { name: "Napolitana (Crema)", gramsPerHCGiven10: 50, category: "Bollería", unit: "ud", gramsPerUnit: 100 },
  { name: "Napolitana (Chocolate)", gramsPerHCGiven10: 55, category: "Bollería", unit: "ud", gramsPerUnit: 100 },
  { name: "Donut (Glaseado)", gramsPerHCGiven10: 25, category: "Bollería", unit: "ud", gramsPerUnit: 50 },
  { name: "Donut (Chocolate)", gramsPerHCGiven10: 30, category: "Bollería", unit: "ud", gramsPerUnit: 60 },
  { name: "Ensaimada", gramsPerHCGiven10: 25, category: "Bollería", unit: "ud", gramsPerUnit: 50 },
  { name: "Palmera (Azúcar)", gramsPerHCGiven10: 50, category: "Bollería", unit: "ud", gramsPerUnit: 80 },
  { name: "Palmera (Chocolate)", gramsPerHCGiven10: 60, category: "Bollería", unit: "ud", gramsPerUnit: 100 },
  { name: "Magdalena", gramsPerHCGiven10: 20, category: "Bollería", unit: "ud", gramsPerUnit: 40 },
  { name: "Churros (4-5 ud)", gramsPerHCGiven10: 30, category: "Bollería", unit: "ud", gramsPerUnit: 30 },
  { name: "Caña de Crema/Chocolate", gramsPerHCGiven10: 45, category: "Bollería", unit: "ud", gramsPerUnit: 80 },

  // Bebidas
  { name: "Cerveza (Caña 200ml)", gramsPerHCGiven10: 250, category: "Bebidas", unit: "ml", mlPerUnit: 200 },
  { name: "Cerveza (Tercio 330ml)", gramsPerHCGiven10: 330 * (10/13), category: "Bebidas", unit: "ml", mlPerUnit: 330 },
  { name: "Cerveza (Pinta 500ml)", gramsPerHCGiven10: 500 * (10/20), category: "Bebidas", unit: "ml", mlPerUnit: 500 },
  { name: "Cerveza Sin Alcohol (Tercio)", gramsPerHCGiven10: 330 * (10/13), category: "Bebidas", unit: "ml", mlPerUnit: 330 },
  { name: "Vino (Copa 150ml)", gramsPerHCGiven10: 200, category: "Bebidas", unit: "ml", mlPerUnit: 150 },
  { name: "Refresco (Lata 330ml)", gramsPerHCGiven10: 165, category: "Bebidas", unit: "ml", mlPerUnit: 330 },
  { name: "Refresco Zero (Lata 330ml)", gramsPerHCGiven10: Infinity, category: "Bebidas", unit: "ml", mlPerUnit: 330 },
  { name: "Zumo Naranja (Vaso 200ml)", gramsPerHCGiven10: 100, category: "Bebidas", unit: "ml", mlPerUnit: 200 },
  { name: "Cubata (Copa)", gramsPerHCGiven10: 200, category: "Bebidas", unit: "ml", mlPerUnit: 200 }
];

const fastFoods = [
  // --- Hamburguesas ---
  {
    id: "whopper",
    name: "Whopper",
    brand: "Burger King",
    components: [
      { name: "Pan hamburguesa", carbs: 27, default: true },
      { name: "Carne vacuna 100g", carbs: 0, default: true },
      { name: "Lechuga", carbs: 1, default: true },
      { name: "Tomate", carbs: 1, default: true },
      { name: "Mayonesa", carbs: 0.5, default: true },
      { name: "Queso", carbs: 0.5, default: false }
    ]
  },
  {
    id: "cheeseburger",
    name: "Cheeseburger",
    brand: "McDonald's",
    components: [
      { name: "Pan hamburguesa", carbs: 25, default: true },
      { name: "Carne vacuna 90g", carbs: 0, default: true },
      { name: "Queso", carbs: 0.5, default: true },
      { name: "Ketchup", carbs: 1, default: true },
      { name: "Mostaza", carbs: 0, default: false }
    ]
  },

  // --- Nuggets ---
  {
    id: "mc_nuggets_6",
    name: "McNuggets 6 ud",
    brand: "McDonald's",
    components: [
      { name: "Nuggets pollo (6 ud)", carbs: 9, default: true },
      { name: "Salsa BBQ", carbs: 2, default: false }
    ]
  },

  // --- Patatas fritas ---
  {
    id: "mc_fries_m",
    name: "Patatas fritas medianas",
    brand: "McDonald's",
    components: [
      { name: "Patatas fritas", carbs: 29, default: true },
      { name: "Ketchup", carbs: 1, default: false }
    ]
  },

  // --- Hot Dogs ---
  {
    id: "hot_dog",
    name: "Hot Dog",
    brand: "Wieners",
    components: [
      { name: "Pan hot dog", carbs: 22, default: true },
      { name: "Salchicha", carbs: 0, default: true },
      { name: "Mostaza", carbs: 0, default: false },
      { name: "Ketchup", carbs: 1, default: false }
    ]
  },

  // --- Pizzas ---
  {
    id: "pizza_pepperoni",
    name: "Pizza Pepperoni 1 slice",
    brand: "Domino's",
    components: [
      { name: "Masa", carbs: 15, default: true },
      { name: "Queso", carbs: 1, default: true },
      { name: "Pepperoni", carbs: 0.5, default: true },
      { name: "Salsa tomate", carbs: 2, default: true }
    ]
  },

  // --- Wraps / Burritos ---
  {
    id: "chicken_wrap",
    name: "Chicken Wrap",
    brand: "KFC",
    components: [
      { name: "Tortilla", carbs: 20, default: true },
      { name: "Pollo rebozado", carbs: 5, default: true },
      { name: "Lechuga", carbs: 1, default: true },
      { name: "Salsa BBQ", carbs: 1, default: false }
    ]
  },

  {
    id: "beef_burrito",
    name: "Beef Burrito",
    brand: "Taco Bell",
    components: [
      { name: "Tortilla", carbs: 20, default: true },
      { name: "Carne vacuna", carbs: 0, default: true },
      { name: "Frijoles", carbs: 12, default: true },
      { name: "Queso", carbs: 1, default: true },
      { name: "Salsa", carbs: 1, default: true }
    ]
  },

  // --- Kebabs / Durum ---
  {
    id: "kebab_durum",
    name: "Kebab Durum Pollo",
    brand: "Kebab",
    components: [
      { name: "Tortilla pan durum", carbs: 30, default: true },
      { name: "Pollo", carbs: 0, default: true },
      { name: "Lechuga", carbs: 1, default: true },
      { name: "Tomate", carbs: 1, default: true },
      { name: "Salsa yogur", carbs: 2, default: false }
    ]
  },
  {
    id: "kebab_carne",
    name: "Kebab Carne Mixta",
    brand: "Kebab",
    components: [
      { name: "Pan pita", carbs: 28, default: true },
      { name: "Carne mixta", carbs: 0, default: true },
      { name: "Cebolla", carbs: 1, default: true },
      { name: "Tomate", carbs: 1, default: true },
      { name: "Salsa picante", carbs: 1, default: false }
    ]
  },

  // --- Comida china ---
  {
    id: "arroz_chino",
    name: "Arroz tres delicias",
    brand: "China",
    components: [
      { name: "Arroz cocido", carbs: 35, default: true },
      { name: "Guisantes", carbs: 2, default: true },
      { name: "Huevo revuelto", carbs: 1, default: true },
      { name: "Zanahoria", carbs: 1, default: true }
    ]
  },
  {
    id: "pollo_chino",
    name: "Pollo agridulce",
    brand: "China",
    components: [
      { name: "Pollo rebozado", carbs: 5, default: true },
      { name: "Salsa agridulce", carbs: 10, default: true },
      { name: "Verduras", carbs: 2, default: true }
    ]
  },

  // --- Refrescos ---
  {
    id: "coca_lata",
    name: "Coca-Cola Lata 330ml",
    brand: "Coca-Cola",
    components: [
      { name: "Refresco", carbs: 35, default: true }
    ]
  },
  {
    id: "sprite_lata",
    name: "Sprite Lata 330ml",
    brand: "Coca-Cola",
    components: [
      { name: "Refresco", carbs: 34, default: true }
    ]
  },
  {
    id: "fanta_lata",
    name: "Fanta Lata 330ml",
    brand: "Coca-Cola",
    components: [
      { name: "Refresco", carbs: 36, default: true }
    ]
  },
  {
    id: "refresco_zero",
    name: "Refresco Zero Lata 330ml",
    brand: "Coca-Cola",
    components: [
      { name: "Refresco", carbs: 0, default: true }
    ]
  },

  // --- Batidos ---
  {
    id: "batido_chocolate",
    name: "Batido Chocolate 400ml",
    brand: "McDonald's",
    components: [
      { name: "Leche", carbs: 20, default: true },
      { name: "Chocolate en polvo", carbs: 18, default: true }
    ]
  },
  {
    id: "batido_fresa",
    name: "Batido Fresa 400ml",
    brand: "McDonald's",
    components: [
      { name: "Leche", carbs: 20, default: true },
      { name: "Sirope de fresa", carbs: 15, default: true }
    ]
  }
];


// Función para calcular raciones y HC totales
function calcularHidratos(food, cantidad) {
  if (!food || !isFinite(food.gramsPerHCGiven10)) return { raciones: 0, hidratos: 0 };
  
  let raciones, hidratos;
  if (food.unit === 'ud') {
    raciones = cantidad;           // 1 unidad = 1 ración
    hidratos = raciones * 10;      // 10 g HC por unidad
  } else {
    raciones = cantidad / food.gramsPerHCGiven10;
    hidratos = raciones * 10;
  }
  return { raciones, hidratos };
}

// Export para Node.js
if (typeof module !== 'undefined') {
  module.exports = { basicFoods, calcularHidratos };
}
