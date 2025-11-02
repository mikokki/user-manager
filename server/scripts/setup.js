#!/usr/bin/env node

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const dummyUsers = require('../data/dummyUsers');

// ANSI color codes for better terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Default admin user configuration
const DEFAULT_ADMIN = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'admin123',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user-manager');
    console.log(`${colors.green}✓${colors.reset} Connected to MongoDB`);
  } catch (error) {
    console.error(`${colors.red}✗ MongoDB connection error:${colors.reset}`, error.message);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async (userData) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: userData.email });
    if (existingAdmin) {
      console.log(`${colors.yellow}⚠ User with email ${userData.email} already exists${colors.reset}`);
      console.log(`${colors.blue}→${colors.reset} Skipping admin creation`);
      return existingAdmin;
    }

    // Create admin user
    const admin = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: 'admin',
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      state: userData.state || '',
      zipCode: userData.zipCode || '',
      status: 'active',
    });

    // Create audit log
    await AuditLog.create({
      action: 'CREATE',
      entityType: 'USER',
      entityId: admin._id,
      details: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: 'admin',
        note: 'Admin user created via setup script',
      },
      userEmail: admin.email,
      userName: `${admin.firstName} ${admin.lastName}`,
    });

    console.log(`${colors.green}✓${colors.reset} Admin user created successfully!`);
    console.log(`${colors.cyan}  Email:${colors.reset} ${admin.email}`);
    console.log(`${colors.cyan}  Role:${colors.reset} ${admin.role}`);
    console.log(`${colors.cyan}  ID:${colors.reset} ${admin._id}`);

    return admin;
  } catch (error) {
    console.error(`${colors.red}✗ Error creating admin user:${colors.reset}`, error.message);
    throw error;
  }
};

// Seed dummy users
const seedDummyUsers = async () => {
  try {
    console.log(`\n${colors.blue}→${colors.reset} Seeding dummy users...`);

    let created = 0;
    let skipped = 0;

    for (const userData of dummyUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
        created++;
      } else {
        skipped++;
      }
    }

    console.log(`${colors.green}✓${colors.reset} Created ${created} dummy users (${skipped} already existed)`);
  } catch (error) {
    console.error(`${colors.red}✗ Error seeding users:${colors.reset}`, error.message);
  }
};

// Main setup function
const runSetup = async () => {
  console.log(`\n${colors.bright}${colors.blue}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}║   User Manager - Initial Setup Script      ║${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}╚════════════════════════════════════════════╝${colors.reset}\n`);

  try {
    // Connect to database
    await connectDB();

    // Create admin user with default values
    console.log(`\n${colors.bright}Admin User Creation${colors.reset}`);
    console.log(`${colors.cyan}Using default admin credentials...${colors.reset}\n`);

    console.log(`${colors.blue}→${colors.reset} Creating admin user...`);
    await createAdminUser(DEFAULT_ADMIN);

    // Seed dummy users automatically
    console.log(`\n${colors.bright}Dummy Users${colors.reset}`);
    await seedDummyUsers();

    // Success message
    console.log(`\n${colors.green}${colors.bright}✓ Setup completed successfully!${colors.reset}\n`);
    console.log(`${colors.cyan}You can now start the server with:${colors.reset}`);
    console.log(`  ${colors.bright}npm start${colors.reset} or ${colors.bright}npm run dev${colors.reset}\n`);
    console.log(`${colors.cyan}Login credentials:${colors.reset}`);
    console.log(`  ${colors.bright}Email:${colors.reset} ${DEFAULT_ADMIN.email}`);
    console.log(`  ${colors.bright}Password:${colors.reset} ${DEFAULT_ADMIN.password}\n`);

  } catch (error) {
    console.error(`\n${colors.red}✗ Setup failed:${colors.reset}`, error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Handle Ctrl+C gracefully
process.on('SIGINT', async () => {
  console.log(`\n\n${colors.yellow}Setup cancelled by user${colors.reset}`);
  await mongoose.connection.close();
  process.exit(0);
});

// Run setup
runSetup();
