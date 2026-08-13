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
    image: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg',
    rating: 4.5,
    deliveryTime: '20-30 min',
    deliveryFee: 40,
    minOrder: 8,
    tags: ['burgers', 'fast food', 'american'],
  },
  {
    name: 'Pizza Roma',
    description: 'Authentic Italian pizza baked in wood fire oven',
    cuisine: 'Italian',
    image: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
    rating: 4.7,
    deliveryTime: '25-40 min',
    deliveryFee: 50,
    minOrder: 12,
    tags: ['pizza', 'italian', 'pasta'],
  },
  {
    name: 'Sushi Heaven',
    description: 'Fresh sushi and Japanese cuisine',
    cuisine: 'Japanese',
    image: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Sushi_platter_2.jpg/800px-Sushi_platter_2.jpg',
    rating: 4.8,
    deliveryTime: '30-45 min',
    deliveryFee: 60,
    minOrder: 15,
    tags: ['sushi', 'japanese', 'seafood'],
  },
  {
    name: 'Spice Garden',
    description: 'Authentic Indian curries and biryanis',
    cuisine: 'Indian',
    image: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
    rating: 4.6,
    deliveryTime: '35-50 min',
    deliveryFee: 50,
    minOrder: 10,
    tags: ['indian', 'curry', 'biryani', 'spicy'],
  },
  {
    name: 'Taco Fiesta',
    description: 'Delicious Mexican street food',
    cuisine: 'Mexican',
    image: 'https://res.cloudinary.com/demo/image/fetch/w_400,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cole_slaw_-_NCI_Visuals_Online.jpg/800px-Cole_slaw_-_NCI_Visuals_Online.jpg',
    rating: 4.3,
    deliveryTime: '20-35 min',
    deliveryFee: 30,
    minOrder: 8,
    tags: ['mexican', 'tacos', 'burritos'],
  },
];

const menuData = {
  'Burger Palace': [
    { name: 'Classic Cheeseburger', description: 'Beef patty with cheddar, lettuce, tomato', price: 199, category: 'Burgers', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg', isVeg: false },
    { name: 'Veggie Burger', description: 'Black bean patty with avocado and greens', price: 179, category: 'Burgers', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: true },
    { name: 'BBQ Bacon Burger', description: 'Double patty with bacon and BBQ sauce', price: 259, category: 'Burgers', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: false },
    { name: 'Crispy Fries', description: 'Golden crispy french fries with dipping sauce', price: 79, category: 'Sides', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cole_slaw_-_NCI_Visuals_Online.jpg/800px-Cole_slaw_-_NCI_Visuals_Online.jpg', isVeg: true },
    { name: 'Onion Rings', description: 'Beer-battered onion rings', price: 89, category: 'Sides', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Sushi_platter_2.jpg/800px-Sushi_platter_2.jpg', isVeg: true },
    { name: 'Chocolate Shake', description: 'Thick creamy chocolate milkshake', price: 109, category: 'Drinks', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg', isVeg: true },
  ],
  'Pizza Roma': [
    { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, basil', price: 239, category: 'Pizza', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: true },
    { name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni slices', price: 279, category: 'Pizza', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: false },
    { name: 'BBQ Chicken Pizza', description: 'Grilled chicken with BBQ sauce and red onion', price: 299, category: 'Pizza', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cole_slaw_-_NCI_Visuals_Online.jpg/800px-Cole_slaw_-_NCI_Visuals_Online.jpg', isVeg: false },
    { name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 99, category: 'Starters', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Sushi_platter_2.jpg/800px-Sushi_platter_2.jpg', isVeg: true },
    { name: 'Pasta Carbonara', description: 'Creamy pasta with pancetta and parmesan', price: 259, category: 'Pasta', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg', isVeg: false },
    { name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone', price: 139, category: 'Desserts', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: true },
  ],
  'Sushi Heaven': [
    { name: 'Salmon Nigiri (6pc)', description: 'Fresh salmon over seasoned rice', price: 259, category: 'Nigiri', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: false },
    { name: 'California Roll (8pc)', description: 'Crab, avocado, cucumber', price: 219, category: 'Rolls', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cole_slaw_-_NCI_Visuals_Online.jpg/800px-Cole_slaw_-_NCI_Visuals_Online.jpg', isVeg: false },
    { name: 'Spicy Tuna Roll (8pc)', description: 'Spicy tuna with sriracha mayo', price: 279, category: 'Rolls', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Sushi_platter_2.jpg/800px-Sushi_platter_2.jpg', isVeg: false },
    { name: 'Edamame', description: 'Steamed salted soybeans', price: 99, category: 'Starters', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg', isVeg: true },
    { name: 'Miso Soup', description: 'Traditional miso broth with tofu and wakame', price: 69, category: 'Soups', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: true },
  ],
  'Spice Garden': [
    { name: 'Chicken Tikka Masala', description: 'Tender chicken in creamy tomato sauce', price: 299, category: 'Curries', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: false },
    { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich buttery gravy', price: 259, category: 'Curries', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cole_slaw_-_NCI_Visuals_Online.jpg/800px-Cole_slaw_-_NCI_Visuals_Online.jpg', isVeg: true },
    { name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 319, category: 'Biryani', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Sushi_platter_2.jpg/800px-Sushi_platter_2.jpg', isVeg: false },
    { name: 'Garlic Naan', description: 'Soft flatbread brushed with garlic butter', price: 59, category: 'Breads', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg', isVeg: true },
    { name: 'Mango Lassi', description: 'Sweet mango yogurt drink', price: 79, category: 'Drinks', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: true },
  ],
  'Taco Fiesta': [
    { name: 'Carne Asada Tacos (3pc)', description: 'Grilled beef with pico de gallo', price: 219, category: 'Tacos', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: false },
    { name: 'Veggie Tacos (3pc)', description: 'Roasted peppers, beans, guacamole', price: 189, category: 'Tacos', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cole_slaw_-_NCI_Visuals_Online.jpg/800px-Cole_slaw_-_NCI_Visuals_Online.jpg', isVeg: true },
    { name: 'Chicken Burrito', description: 'Grilled chicken, rice, beans in a flour tortilla', price: 239, category: 'Burritos', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Sushi_platter_2.jpg/800px-Sushi_platter_2.jpg', isVeg: false },
    { name: 'Guacamole & Chips', description: 'Fresh house-made guacamole with tortilla chips', price: 119, category: 'Sides', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg', isVeg: true },
    { name: 'Horchata', description: 'Sweet cinnamon rice drink', price: 69, category: 'Drinks', image: 'https://res.cloudinary.com/demo/image/fetch/w_300,h_300,c_fill,q_auto/https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg', isVeg: true },
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
