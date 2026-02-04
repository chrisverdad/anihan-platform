import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import '../config/database.js'; // Initialize SQLite database
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import WasteType from '../models/WasteType.js';
import WasteCategory from '../models/WasteCategory.js';
import WasteSubmission from '../models/WasteSubmission.js';
import SourceWasteSubmission from '../models/SourceWasteSubmission.js';
import InventoryItem from '../models/InventoryItem.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    User.deleteMany({});
    Product.deleteMany({});
    Order.deleteMany({});
    WasteType.deleteMany({});
    WasteCategory.deleteMany({});
    WasteSubmission.deleteMany({});
    SourceWasteSubmission.deleteMany({});
    InventoryItem.deleteMany({});

    console.log('Cleared existing data...');

    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedVendorPassword = await bcrypt.hash('vendor123', 10);
    const hashedUserPassword = await bcrypt.hash('user123', 10);

    // Seed Users
    const users = [
      User.create({
        email: 'admin@anihan.com',
        password: hashedAdminPassword,
        full_name: 'Admin User',
        role: 'admin',
        phone: '+63 912 345 6789',
        address: 'Butuan City, Agusan del Norte',
        is_active: true
      }),
      User.create({
        email: 'vendor@anihan.com',
        password: hashedVendorPassword,
        full_name: 'Maria Santos',
        role: 'vendor',
        phone: '+63 912 345 6787',
        address: 'Public Market, Butuan City',
        is_active: true,
        vendor_status: 'approved',
        business_name: 'Santos Farm Produce',
        business_type: 'Farm',
        years_in_business: '5'
      }),
      User.create({
        email: 'user@anihan.com',
        password: hashedUserPassword,
        full_name: 'Pedro Garcia',
        role: 'user',
        phone: '+63 912 345 6786',
        address: 'Residential Area, Butuan City',
        is_active: true
      }),
      User.create({
        email: 'vendor2@anihan.com',
        password: hashedVendorPassword,
        full_name: 'Juan Dela Cruz',
        role: 'vendor',
        phone: '+63 912 345 6785',
        address: 'Farmers Market, Butuan City',
        is_active: true,
        vendor_status: 'approved',
        business_name: 'Dela Cruz Market',
        business_type: 'Market',
        years_in_business: '3'
      }),
      User.create({
        email: 'vendor3@anihan.com',
        password: hashedVendorPassword,
        full_name: 'Ana Rodriguez',
        role: 'vendor',
        phone: '+63 912 345 6784',
        address: 'Central Market, Butuan City',
        is_active: true,
        vendor_status: 'approved',
        business_name: 'Rodriguez Organic Farm',
        business_type: 'Farm',
        years_in_business: '7'
      })
    ];

    console.log(`Seeded ${users.length} users...`);

    // Seed Waste Categories
    const wasteCategories = [
      WasteCategory.create({
        name: 'Fruits',
        description: 'Fresh and processed fruits',
        color: '#f59e0b',
        icon: 'SunIcon',
        is_active: true
      }),
      WasteCategory.create({
        name: 'Vegetables',
        description: 'Fresh and processed vegetables',
        color: '#10b981',
        icon: 'SunIcon',
        is_active: true
      }),
      WasteCategory.create({
        name: 'Grains',
        description: 'Rice, wheat, and other grains',
        color: '#8b5cf6',
        icon: 'CubeIcon',
        is_active: true
      }),
      WasteCategory.create({
        name: 'Dairy',
        description: 'Milk, cheese, and dairy products',
        color: '#06b6d4',
        icon: 'HeartIcon',
        is_active: true
      }),
      WasteCategory.create({
        name: 'Meat',
        description: 'Fresh and processed meat products',
        color: '#ef4444',
        icon: 'FireIcon',
        is_active: true
      })
    ];

    console.log(`Seeded ${wasteCategories.length} waste categories...`);

    // Seed Waste Types
    const wasteTypes = [
      WasteType.create({
        name: 'Overripe Bananas',
        description: 'Bananas that are too ripe for sale',
        image_url: '/images/overripe-bananas.jpg',
        category: 'fruit',
        damage_level: 'moderate'
      }),
      WasteType.create({
        name: 'Bruised Tomatoes',
        description: 'Tomatoes with minor bruises',
        image_url: '/images/bruised-tomatoes.jpg',
        category: 'vegetable',
        damage_level: 'slight'
      }),
      WasteType.create({
        name: 'Damaged Mangoes',
        description: 'Mangoes with severe damage',
        image_url: '/images/damaged-mangoes.jpg',
        category: 'fruit',
        damage_level: 'severe'
      }),
      WasteType.create({
        name: 'Wilted Lettuce',
        description: 'Lettuce that has started to wilt',
        image_url: '/images/wilted-lettuce.jpg',
        category: 'vegetable',
        damage_level: 'moderate'
      }),
      WasteType.create({
        name: 'Damaged Apples',
        description: 'Apples with bruises and cuts',
        image_url: '/images/damaged-apples.jpg',
        category: 'fruit',
        damage_level: 'moderate'
      }),
      WasteType.create({
        name: 'Overripe Papayas',
        description: 'Papayas that are too soft for sale',
        image_url: '/images/overripe-papayas.jpg',
        category: 'fruit',
        damage_level: 'moderate'
      })
    ];

    console.log(`Seeded ${wasteTypes.length} waste types...`);

    // Seed Products
    const products = [
      Product.create({
        name: 'Organic Banana Compost',
        description: 'Rich compost made from overripe bananas, perfect for organic gardening',
        price: 150,
        category: 'compost',
        image_url: '/photos/banana compost.jpg',
        stock_quantity: 25,
        unit: 'kg',
        is_available: true
      }),
      Product.create({
        name: 'Tomato Fertilizer',
        description: 'Natural fertilizer derived from bruised tomatoes, rich in nutrients',
        price: 200,
        category: 'fertilizer',
        image_url: '/photos/tomato fertilizer.jpg',
        stock_quantity: 15,
        unit: 'bags',
        is_available: true
      }),
      Product.create({
        name: 'Mango Jam',
        description: 'Delicious jam made from damaged mangoes, sweet and natural',
        price: 80,
        category: 'preserved_food',
        image_url: '/photos/mango jam.webp',
        stock_quantity: 30,
        unit: 'bottles',
        is_available: true
      }),
      Product.create({
        name: 'Vegetable Compost',
        description: 'Mixed vegetable compost from various damaged produce',
        price: 120,
        category: 'compost',
        image_url: '/photos/vegetable compost.webp',
        stock_quantity: 20,
        unit: 'kg',
        is_available: true
      }),
      Product.create({
        name: 'Fruit Fertilizer',
        description: 'Nutrient-rich fertilizer made from fruit waste',
        price: 180,
        category: 'fertilizer',
        image_url: '/photos/overripe banana.jpg',
        stock_quantity: 12,
        unit: 'bags',
        is_available: true
      }),
      Product.create({
        name: 'Apple Preserves',
        description: 'Sweet preserves made from bruised apples',
        price: 90,
        category: 'preserved_food',
        image_url: '/photos/damage apples.webp',
        stock_quantity: 0,
        unit: 'jars',
        is_available: false
      })
    ];

    console.log(`Seeded ${products.length} products...`);

    // Seed Waste Submissions
    const wasteSubmissions = [
      WasteSubmission.create({
        user_id: users[1].id, // vendor@anihan.com
        waste_type_id: wasteTypes[0].id,
        quantity: 25,
        unit: 'kg',
        description: 'Bananas from yesterday\'s harvest',
        status: 'pending',
        title: 'Overripe Bananas',
        category: 'fruit',
        condition: 'overripe'
      }),
      WasteSubmission.create({
        user_id: users[1].id,
        waste_type_id: wasteTypes[1].id,
        quantity: 15,
        unit: 'pieces',
        description: 'Tomatoes with minor bruises',
        status: 'approved',
        title: 'Bruised Tomatoes',
        category: 'vegetable',
        condition: 'slightly_damaged'
      }),
      WasteSubmission.create({
        user_id: users[1].id,
        waste_type_id: wasteTypes[2].id,
        quantity: 8,
        unit: 'pieces',
        description: 'Mangoes damaged during transport',
        status: 'processed',
        title: 'Damaged Mangoes',
        category: 'fruit',
        condition: 'bruised',
        processed_at: new Date('2024-12-13T19:30:00Z').toISOString()
      })
    ];

    console.log(`Seeded ${wasteSubmissions.length} waste submissions...`);

    // Seed Source Waste Submissions
    const sourceWasteSubmissions = [
      SourceWasteSubmission.create({
        vendor_id: users[1].id,
        category_id: wasteCategories[0].id,
        title: 'Overripe Bananas',
        description: 'Bananas from yesterday\'s harvest that are too ripe for sale',
        quantity: 25,
        unit: 'kg',
        condition: 'overripe',
        location: 'Public Market, Butuan City',
        pickup_date: new Date('2024-12-20T10:00:00Z').toISOString(),
        estimated_value: 500,
        image_url: '/images/overripe-bananas.jpg',
        status: 'pending'
      }),
      SourceWasteSubmission.create({
        vendor_id: users[3].id,
        category_id: wasteCategories[1].id,
        title: 'Bruised Tomatoes',
        description: 'Tomatoes with minor bruises from transport',
        quantity: 15,
        unit: 'pieces',
        condition: 'slightly_damaged',
        location: 'Farmers Market, Butuan City',
        pickup_date: new Date('2024-12-21T14:00:00Z').toISOString(),
        estimated_value: 300,
        image_url: '/images/bruised-tomatoes.jpg',
        status: 'approved'
      }),
      SourceWasteSubmission.create({
        vendor_id: users[4].id,
        category_id: wasteCategories[0].id,
        title: 'Damaged Mangoes',
        description: 'Mangoes damaged during transport',
        quantity: 8,
        unit: 'pieces',
        condition: 'bruised',
        location: 'Central Market, Butuan City',
        pickup_date: new Date('2024-12-19T09:00:00Z').toISOString(),
        estimated_value: 200,
        image_url: '/images/damaged-mangoes.jpg',
        status: 'processed',
        processed_at: new Date('2024-12-13T19:30:00Z').toISOString()
      })
    ];

    console.log(`Seeded ${sourceWasteSubmissions.length} source waste submissions...`);

    // Seed Inventory Items
    const inventoryItems = [
      InventoryItem.create({
        vendor_id: users[1].id,
        product_name: 'Banana Compost',
        description: 'High-quality compost made from overripe bananas',
        category: 'compost',
        quantity: 50,
        unit: 'kg',
        price_per_unit: 25,
        total_value: 1250,
        source_waste_submission_id: sourceWasteSubmissions[0].id,
        image_url: '/placeholder-image.svg',
        is_available: true,
        quantity_history: [{
          adjustment_type: 'set',
          quantity_change: 50,
          previous_quantity: 0,
          new_quantity: 50,
          reason: 'Initial inventory creation',
          adjusted_by: 'Maria Santos',
          notes: 'Created from processed banana waste'
        }]
      }),
      InventoryItem.create({
        vendor_id: users[1].id,
        product_name: 'Tomato Fertilizer',
        description: 'Organic fertilizer made from bruised tomatoes',
        category: 'fertilizer',
        quantity: 20,
        unit: 'bags',
        price_per_unit: 150,
        total_value: 3000,
        source_waste_submission_id: sourceWasteSubmissions[1].id,
        image_url: '/placeholder-image.svg',
        is_available: true,
        quantity_history: [{
          adjustment_type: 'set',
          quantity_change: 20,
          previous_quantity: 0,
          new_quantity: 20,
          reason: 'Initial inventory creation',
          adjusted_by: 'Maria Santos',
          notes: 'Created from processed tomato waste'
        }]
      }),
      InventoryItem.create({
        vendor_id: users[1].id,
        product_name: 'Mango Jam',
        description: 'Sweet jam made from damaged mangoes',
        category: 'preserved_food',
        quantity: 15,
        unit: 'jars',
        price_per_unit: 80,
        total_value: 1200,
        source_waste_submission_id: sourceWasteSubmissions[2].id,
        image_url: '/placeholder-image.svg',
        is_available: true,
        quantity_history: [{
          adjustment_type: 'set',
          quantity_change: 15,
          previous_quantity: 0,
          new_quantity: 15,
          reason: 'Initial inventory creation',
          adjusted_by: 'Maria Santos',
          notes: 'Created from processed mango waste'
        }]
      })
    ];

    console.log(`Seeded ${inventoryItems.length} inventory items...`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
