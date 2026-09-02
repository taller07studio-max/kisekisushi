export const WHATSAPP_NUMBER = '526671234567'

export type Category = {
  id: string
  label: string
  tagline: string
}

export type Dish = {
  id: string
  name: string
  category: string
  price: number
  blurb: string
  description: string
  image: string
  ingredients: string[]
  heat: 0 | 1 | 2 | 3
  badge?: string
  featured?: boolean
}

export const categories: Category[] = [
  { id: 'crudos', label: 'Crudos', tagline: 'Curado en limón, servido helado' },
  { id: 'tostadas', label: 'Tostadas', tagline: 'Crujiente, generoso, de una mordida' },
  { id: 'brasa', label: 'A la brasa', tagline: 'Leña de mezquite y adobo rojo' },
  { id: 'tacos', label: 'Tacos', tagline: 'Dorados en la plancha' },
  { id: 'cocteles', label: 'Cócteles', tagline: 'Fríos, con clamato y limón' },
  { id: 'bebidas', label: 'Bebidas', tagline: 'Para bajar el picante' },
]

export const dishes: Dish[] = [
  {
    id: 'aguachile-rojo',
    name: 'Aguachile Rojo',
    category: 'crudos',
    price: 285,
    blurb: 'Camarón crudo en caldo de chiltepín y limón',
    description:
      'Nuestra receta insignia. Camarón del Golfo de California abierto en mariposa y curado apenas cuatro minutos en limón recién exprimido, chiltepín molido en molcajete y sal de mar. Se sirve al instante, todavía frío, con pepino en láminas finas y cebolla morada.',
    image: '/images/aguachile.png',
    ingredients: [
      'Camarón azul del Pacífico',
      'Chiltepín de la sierra',
      'Limón agrio',
      'Pepino',
      'Cebolla morada',
      'Sal de Topolobampo',
    ],
    heat: 3,
    badge: 'La casa',
    featured: true,
  },
  {
    id: 'callo-de-hacha',
    name: 'Callo de Hacha',
    category: 'crudos',
    price: 320,
    blurb: 'Callo fresco, aceite de oliva y serrano',
    description:
      'Callo de hacha buceado en la bahía y limpiado a mano la misma mañana. Lo cortamos en cubos gruesos para que se sienta la textura, y lo vestimos apenas con limón, aceite de oliva, serrano en rodajas y cilantro. Delicado a propósito: aquí el protagonista es el molusco.',
    image: '/images/callo-de-hacha.png',
    ingredients: [
      'Callo de hacha de bahía',
      'Aceite de oliva',
      'Chile serrano',
      'Pepino',
      'Cilantro',
      'Limón',
    ],
    heat: 1,
    badge: 'Temporada',
    featured: true,
  },
  {
    id: 'tostada-ceviche',
    name: 'Tostada de Ceviche',
    category: 'tostadas',
    price: 165,
    blurb: 'Sierra curada, aguacate y tomate',
    description:
      'Pescado sierra picado a cuchillo y curado en limón con tomate, pepino y cilantro, montado sobre tostada de maíz nixtamalizado frita al momento. Coronada con aguacate en abanico. Crujiente por fuera, fresca y ácida por dentro.',
    image: '/images/tostada-ceviche.png',
    ingredients: [
      'Pescado sierra',
      'Tomate',
      'Aguacate',
      'Pepino',
      'Cilantro',
      'Tostada de maíz',
    ],
    heat: 1,
    featured: true,
  },
  {
    id: 'tostada-marlin',
    name: 'Tostada de Marlín',
    category: 'tostadas',
    price: 155,
    blurb: 'Marlín ahumado en casa con chipotle',
    description:
      'Marlín que ahumamos nosotros con leña de mezquite durante seis horas, deshebrado y guisado en chipotle con cebolla y tomate. Va sobre tostada con aguacate y un hilo de crema. Ahumado, hondo y ligeramente dulce.',
    image: '/images/tostada-marlin.png',
    ingredients: [
      'Marlín ahumado en casa',
      'Chile chipotle',
      'Aguacate',
      'Crema',
      'Cebolla',
      'Tostada de maíz',
    ],
    heat: 2,
  },
  {
    id: 'pescado-zarandeado',
    name: 'Pescado Zarandeado',
    category: 'brasa',
    price: 690,
    blurb: 'Huachinango entero al mezquite, para compartir',
    description:
      'Huachinango entero abierto en mariposa, bañado en nuestro adobo rojo de chile guajillo y mostaza, y asado sobre brasa de mezquite en zaranda de alambre. Llega a la mesa humeando, con tortillas de harina, limones asados y salsa de la casa. Rinde para dos o tres personas.',
    image: '/images/pescado-zarandeado.png',
    ingredients: [
      'Huachinango entero (~1.2 kg)',
      'Adobo de chile guajillo',
      'Mostaza y mantequilla',
      'Leña de mezquite',
      'Tortillas de harina',
      'Limones asados',
    ],
    heat: 2,
    badge: 'Para compartir',
    featured: true,
  },
  {
    id: 'camarones-zarandeados',
    name: 'Camarones Zarandeados',
    category: 'brasa',
    price: 340,
    blurb: 'Camarón gigante glaseado en adobo',
    description:
      'Camarón gigante abierto y asado a fuego alto hasta que el adobo se caramelice en los bordes. Untuoso, ahumado y con un dulzor que sale del propio camarón. Se sirve con col rallada y limón a la brasa.',
    image: '/images/camarones-zarandeados.png',
    ingredients: [
      'Camarón gigante',
      'Adobo rojo de la casa',
      'Mantequilla de ajo',
      'Col morada',
      'Limón asado',
    ],
    heat: 2,
  },
  {
    id: 'taco-gobernador',
    name: 'Taco Gobernador',
    category: 'tacos',
    price: 95,
    blurb: 'Camarón y queso fundido, dorado en la plancha',
    description:
      'El clásico de Sinaloa, hecho como debe ser: tortilla de harina dorada en la plancha con queso Chihuahua fundido, camarón salteado con chile poblano y cebolla. Se come de inmediato, mientras el queso todavía se estira. Orden de dos piezas.',
    image: '/images/taco-gobernador.png',
    ingredients: [
      'Camarón',
      'Queso Chihuahua',
      'Chile poblano',
      'Cebolla',
      'Tortilla de harina',
    ],
    heat: 1,
    badge: 'Favorito',
  },
  {
    id: 'coctel-camaron',
    name: 'Cóctel de Camarón',
    category: 'cocteles',
    price: 245,
    blurb: 'Camarón, clamato y aguacate, bien frío',
    description:
      'Camarón cocido en su punto, servido en copa alta con caldo de tomate y clamato, cebolla, cilantro y trozos generosos de aguacate. Frío, salado y adictivo. Va con galletas saladas y salsa Huichol aparte.',
    image: '/images/coctel-camaron.png',
    ingredients: [
      'Camarón cocido',
      'Clamato y tomate',
      'Aguacate',
      'Cebolla',
      'Cilantro',
      'Galletas saladas',
    ],
    heat: 1,
  },
  {
    id: 'michelada',
    name: 'Michelada El Imposible',
    category: 'bebidas',
    price: 130,
    blurb: 'Escarchada de chamoy y chile',
    description:
      'Cerveza clara bien fría en tarro escarchado con chamoy y chile en polvo, limón, salsa inglesa y un toque de nuestra salsa de chiltepín. El acompañante obligado del aguachile.',
    image: '/images/michelada.png',
    ingredients: [
      'Cerveza clara',
      'Chamoy',
      'Chile en polvo',
      'Limón',
      'Salsa inglesa',
    ],
    heat: 1,
  },
]

export const featuredDishes = dishes.filter((d) => d.featured)

export function formatPrice(price: number) {
  return `$${price.toLocaleString('es-MX')}`
}

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function orderLink(dish?: Dish) {
  if (!dish) {
    return whatsappLink(
      '¡Hola El Imposible! Quisiera hacer un pedido, ¿me pueden ayudar?',
    )
  }
  return whatsappLink(
    `¡Hola El Imposible! Quiero pedir: ${dish.name} — ${formatPrice(dish.price)}`,
  )
}
