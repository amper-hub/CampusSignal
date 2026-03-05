import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seed() {
  // Database configuration (same as in app.module.ts)
  const host = process.env.DB_HOST;
  const port = parseInt(process.env.DB_PORT ?? '3306', 10);
  const username = process.env.DB_USER;
  const password = process.env.DB_PASS;
  const database = process.env.DB_NAME;

  if (!host || !username || !database) {
    throw new Error(
      'Database configuration incomplete; please set DB_HOST, DB_USER, and DB_NAME in .env',
    );
  }

  const dataSource = new DataSource({
    type: 'mysql',
    host,
    port,
    username,
    password: password || '',
    database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // Do not synchronize in production
  });

  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log('Database connection established.');

    // Get repositories
    const roleRepository = dataSource.getRepository(Role);
    const userRepository = dataSource.getRepository(User);

    // Seed roles first (to avoid foreign key constraints)
    console.log('Seeding roles...');

    // Check if roles already exist
    let adminRole = await roleRepository.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      adminRole = roleRepository.create({ name: 'Admin' });
      await roleRepository.save(adminRole);
      console.log('Created Admin role.');
    } else {
      console.log('Admin role already exists.');
    }

    let userRole = await roleRepository.findOne({ where: { name: 'User' } });
    if (!userRole) {
      userRole = roleRepository.create({ name: 'User' });
      await roleRepository.save(userRole);
      console.log('Created User role.');
    } else {
      console.log('User role already exists.');
    }

    // Seed users after roles are created
    console.log('Seeding users...');

    // Check if admin user already exists
    let adminUser = await userRepository.findOne({ where: { email: 'admin@campus.com' } });
    if (!adminUser) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      adminUser = userRepository.create({
        email: 'admin@campus.com',
        password: hashedAdminPassword,
        roleId: adminRole.id,
      });
      await userRepository.save(adminUser);
      console.log('Created admin user: admin@campus.com');
    } else {
      console.log('Admin user already exists.');
    }

    // Check if normal user already exists
    let normalUser = await userRepository.findOne({ where: { email: 'user@campus.com' } });
    if (!normalUser) {
      const hashedUserPassword = await bcrypt.hash('user123', 10);
      normalUser = userRepository.create({
        email: 'user@campus.com',
        password: hashedUserPassword,
        roleId: userRole.id,
      });
      await userRepository.save(normalUser);
      console.log('Created normal user: user@campus.com');
    } else {
      console.log('Normal user already exists.');
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    // Close the data source
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

// Run the seed function
seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
