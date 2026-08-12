const mongoose = require('mongoose');
require('dotenv').config();

const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

const restaurants = [
  {
    name: 'Burger Palace',
    description: 'Best burgers in town with fresh ingredients',
    cuisine: 'American',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    rating: 4.5,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    minOrder: 8,
    tags: ['burgers', 'fast food', 'american'],
  },
  {
    name: 'Pizza Roma',
    description: 'Authentic Italian pizza baked in wood fire oven',
    cuisine: 'Italian',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    rating: 4.7,
    deliveryTime: '25-40 min',
    deliveryFee: 2.49,
    minOrder: 12,
    tags: ['pizza', 'italian', 'pasta'],
  },
  {
    name: 'Sushi Heaven',
    description: 'Fresh sushi and Japanese cuisine',
    cuisine: 'Japanese',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
    rating: 4.8,
    deliveryTime: '30-45 min',
    deliveryFee: 3.99,
    minOrder: 15,
    tags: ['sushi', 'japanese', 'seafood'],
  },
  {
    name: 'Spice Garden',
    description: 'Authentic Indian curries and biryanis',
    cuisine: 'Indian',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    rating: 4.6,
    deliveryTime: '35-50 min',
    deliveryFee: 2.99,
    minOrder: 10,
    tags: ['indian', 'curry', 'biryani', 'spicy'],
  },
  {
    name: 'Taco Fiesta',
    description: 'Delicious Mexican street food',
    cuisine: 'Mexican',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    rating: 4.3,
    deliveryTime: '20-35 min',
    deliveryFee: 1.49,
    minOrder: 8,
    tags: ['mexican', 'tacos', 'burritos'],
  },
];

const menuData = {
  'Burger Palace': [
    { name: 'Classic Cheeseburger', description: 'Beef patty with cheddar, lettuce, tomato', price: 9.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', isVeg: false },
    { name: 'Veggie Burger', description: 'Black bean patty with avocado and greens', price: 8.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300', isVeg: true },
    { name: 'BBQ Bacon Burger', description: 'Double patty with bacon and BBQ sauce', price: 12.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300', isVeg: false },
    { name: 'Crispy Fries', description: 'Golden crispy french fries with dipping sauce', price: 3.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', isVeg: true },
    { name: 'Onion Rings', description: 'Beer-battered onion rings', price: 4.49, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300', isVeg: true },
    { name: 'Chocolate Shake', description: 'Thick creamy chocolate milkshake', price: 5.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300', isVeg: true },
  ],
  'Pizza Roma': [
    { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, basil', price: 11.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300', isVeg: true },
    { name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni slices', price: 13.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300', isVeg: false },
    { name: 'BBQ Chicken Pizza', description: 'Grilled chicken with BBQ sauce and red onion', price: 14.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300', isVeg: false },
    { name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 4.99, category: 'Starters', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300', isVeg: true },
    { name: 'Pasta Carbonara', description: 'Creamy pasta with pancetta and parmesan', price: 12.99, category: 'Pasta', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300', isVeg: false },
    { name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone', price: 6.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300', isVeg: true },
  ],
  'Sushi Heaven': [
    { name: 'Salmon Nigiri (6pc)', description: 'Fresh salmon over seasoned rice', price: 12.99, category: 'Nigiri', image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300', isVeg: false },
    { name: 'California Roll (8pc)', description: 'Crab, avocado, cucumber', price: 10.99, category: 'Rolls', image: 'https://images.unsplash.com/photo-1617196034099-6658f36f0c4e?w=300', isVeg: false },
    { name: 'Spicy Tuna Roll (8pc)', description: 'Spicy tuna with sriracha mayo', price: 13.99, category: 'Rolls', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300', isVeg: false },
    { name: 'Edamame', description: 'Steamed salted soybeans', price: 4.99, category: 'Starters', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300', isVeg: true },
    { name: 'Miso Soup', description: 'Traditional miso broth with tofu and wakame', price: 3.49, category: 'Soups', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300', isVeg: true },
  ],
  'Spice Garden': [
    { name: 'Chicken Tikka Masala', description: 'Tender chicken in creamy tomato sauce', price: 14.99, category: 'Curries', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300', isVeg: false },
    { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich buttery gravy', price: 12.99, category: 'Curries', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300', isVeg: true },
    { name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 15.99, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300', isVeg: false },
    { name: 'Garlic Naan', description: 'Soft flatbread brushed with garlic butter', price: 2.99, category: 'Breads', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', isVeg: true },
    { name: 'Mango Lassi', description: 'Sweet mango yogurt drink', price: 3.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=300', isVeg: true },
  ],
  'Taco Fiesta': [
    { name: 'Carne Asada Tacos (3pc)', description: 'Grilled beef with pico de gallo', price: 10.99, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300', isVeg: false },
    { name: 'Veggie Tacos (3pc)', description: 'Roasted peppers, beans, guacamole', price: 9.49, category: 'Tacos', image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=300', isVeg: true },
    { name: 'Chicken Burrito', description: 'Grilled chicken, rice, beans in a flour tortilla', price: 11.99, category: 'Burritos', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300', isVeg: false },
    { name: 'Guacamole & Chips', description: 'Fresh house-made guacamole with tortilla chips', price: 5.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=300', isVeg: true },
    { name: 'Horchata', description: 'Sweet cinnamon rice drink', price: 3.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300', isVeg: true },
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});
  await User.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@foodapp.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('Admin created:', admin.email);

  // Create test user
  const user = await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '555-0100',
  });
  console.log('Test user created:', user.email);

  // Create restaurants and menu items
  for (const rData of restaurants) {
    const restaurant = await Restaurant.create(rData);
    console.log('Created restaurant:', restaurant.name);

    const items = menuData[restaurant.name] || [];
    for (const item of items) {
      await MenuItem.create({ ...item, restaurant: restaurant._id });
    }
    console.log(`  Added ${items.length} menu items`);
  }

  console.log('\nSeed complete!');
  console.log('Admin login: admin@foodapp.com / admin123');
  console.log('User login:  john@example.com / password123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
