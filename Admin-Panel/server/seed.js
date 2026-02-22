/**
 * Seed script — creates initial SuperAdmin, Manager, and Staff users + sample projects.
 * 
 */
import 'dotenv/config.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import ProjectRequest from './models/ProjectRequest.js';
import { ROLES } from './config/permissions.js';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await ProjectRequest.deleteMany({});
    console.log('Cleared existing data.');

    // Create users
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: ROLES.SUPER_ADMIN,
      isActive: true,
    });

    const manager1 = await User.create({
      name: 'John Manager',
      email: 'manager@example.com',
      password: 'password123',
      role: ROLES.MANAGER,
      isActive: true,
    });

    const manager2 = await User.create({
      name: 'Jane Manager',
      email: 'manager2@example.com',
      password: 'password123',
      role: ROLES.MANAGER,
      isActive: true,
    });

    const staff1 = await User.create({
      name: 'Alice Staff',
      email: 'staff@example.com',
      password: 'password123',
      role: ROLES.STAFF,
      isActive: true,
    });

    const staff2 = await User.create({
      name: 'Bob Staff',
      email: 'staff2@example.com',
      password: 'password123',
      role: ROLES.STAFF,
      isActive: true,
    });

    console.log('Users created.');

    // Create project requests
    const projects = await ProjectRequest.insertMany([
      {
        title: 'Website Redesign',
        description: 'Redesign the company website with modern UI/UX standards.',
        createdBy: manager1._id,
        assignedTo: staff1._id,
        status: 'pending',
      },
      {
        title: 'Mobile App Development',
        description: 'Build a cross-platform mobile application for our customers.',
        createdBy: manager1._id,
        assignedTo: staff2._id,
        status: 'approved',
      },
      {
        title: 'API Integration',
        description: 'Integrate third-party payment gateway APIs.',
        createdBy: manager1._id,
        assignedTo: staff1._id,
        status: 'rejected',
      },
      {
        title: 'Database Migration',
        description: 'Migrate legacy database to MongoDB cluster.',
        createdBy: manager2._id,
        assignedTo: staff2._id,
        status: 'pending',
      },
      {
        title: 'Security Audit',
        description: 'Perform a comprehensive security audit of all systems.',
        createdBy: manager2._id,
        assignedTo: staff1._id,
        status: 'approved',
      },
      {
        title: 'DevOps Pipeline',
        description: 'Set up CI/CD pipeline for automated deployments.',
        createdBy: manager2._id,
        status: 'pending',
      },
    ]);

    console.log(`${projects.length} project requests created.`);

    console.log('\n--- Seed Complete ---');
    console.log('Login credentials (all passwords: password123):');
    console.log(`  SuperAdmin: admin@example.com`);
    console.log(`  Manager 1:  manager@example.com`);
    console.log(`  Manager 2:  manager2@example.com`);
    console.log(`  Staff 1:    staff@example.com`);
    console.log(`  Staff 2:    staff2@example.com`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
