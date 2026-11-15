export type MenuCategory = 'To begin' | 'The mains' | 'Something sweet';
export type MenuItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  ingredients: string;
  category: MenuCategory;
  price: number;
  image: string;
  vegetarian?: boolean;
  highlight?: string;
};
export const menu: MenuItem[] = [
  { id: 1, slug: 'burrata-heirloom', name: 'Burrata & Heirloom', category: 'To begin', price: 19, image: '/media/burrata.webp', vegetarian: true, highlight: 'A guest favourite', description: 'An Italian-inspired beginning, as generous as the table itself.', ingredients: 'Fresh burrata, heirloom tomato, basil oil and aged balsamic' },
  { id: 2, slug: 'crispy-calamari', name: 'Crispy Calamari', category: 'To begin', price: 22, image: '/media/dinner.webp', description: 'Crisp and golden with a bright, citrus-led finish.', ingredients: 'Calamari, lemon aioli, parsley and charred citrus' },
  { id: 3, slug: 'mushroom-arancini', name: 'Wild Mushroom Arancini', category: 'To begin', price: 18, image: '/media/table.webp', vegetarian: true, description: 'Slow-cooked comfort, beautifully crisp on the outside.', ingredients: 'Wild mushrooms, arborio rice, truffle cream and parmesan' },
  { id: 4, slug: 'saffron-pappardelle', name: 'Saffron Pappardelle', category: 'The mains', price: 34, image: '/media/pasta.webp', vegetarian: true, highlight: 'Signature', description: 'A softly luxurious plate of handmade-inspired pasta.', ingredients: 'Pappardelle, slow tomato, pecorino, basil and olive oil' },
  { id: 5, slug: 'wood-fired-market-fish', name: 'Wood-Fired Market Fish', category: 'The mains', price: 42, image: '/media/seafood.webp', highlight: 'From the fire', description: 'From the ocean, finished over the flame.', ingredients: 'Seasonal fish, preserved lemon, garden greens and beurre blanc' },
  { id: 6, slug: 'slow-braised-lamb', name: 'Slow-Braised Lamb', category: 'The mains', price: 46, image: '/media/grill.webp', highlight: 'Chef’s pick', description: 'A rich centrepiece, made for an evening without a hurry.', ingredients: 'Lamb, smoked aubergine, pomegranate and mint' },
  { id: 7, slug: 'citrus-olive-oil-cake', name: 'Citrus Olive Oil Cake', category: 'Something sweet', price: 17, image: '/media/dessert.webp', vegetarian: true, description: 'Light, citrusy and just sweet enough.', ingredients: 'Olive oil cake, orange, pistachio and whipped mascarpone' },
  { id: 8, slug: 'dark-chocolate-cremeux', name: 'Dark Chocolate Crémeux', category: 'Something sweet', price: 18, image: '/media/dessert.webp', vegetarian: true, description: 'A little indulgence, exactly as it should be.', ingredients: 'Dark chocolate, salted caramel, cocoa nib and vanilla' },
];
export const categories = ['All', 'To begin', 'The mains', 'Something sweet'] as const;
export const money = (amount: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
export function itemById(id: number) { return menu.find(item => item.id === id); }
export function itemBySlug(slug: string) { return menu.find(item => item.slug === slug); }
export const photos = {
  hero: '/media/hero-room.webp',
  interior: '/media/interior.webp',
  table: '/media/table.webp',
  chef: '/media/chef.webp',
  pasta: '/media/pasta.webp',
  fish: '/media/seafood.webp',
  grill: '/media/grill.webp',
  dinner: '/media/dinner.webp',
} as const;
