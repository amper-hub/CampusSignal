import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Database seeding script to initialize roles and admin user
 * Run with: npm run seed
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const roleRepository = app.get('RoleRepository') as Repository<Role>;
  const userRepository = app.get('UserRepository') as Repository<User>;

  try {
    console.log('[SEED] Starting database seed...');

    // Seed role IDs used by the frontend/backend contract.
    await roleRepository.query(
      "INSERT IGNORE INTO `role` (`id`, `name`) VALUES (1, 'admin')",
    );
    await roleRepository.query(
      "INSERT IGNORE INTO `role` (`id`, `name`) VALUES (2, 'user')",
    );
    console.log('[SEED] Role IDs ready: admin = 1, user = 2');

    // Seed admin user if not exists
    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@12345', 10);
      const admin = userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        roleId: 1,
      });
      await userRepository.save(admin);
      console.log(`[SEED] Created admin user: ${adminEmail}`);
    } else {
      console.log(`[SEED] Admin user already exists: ${adminEmail}`);
      // Ensure admin has admin role
      if (existingAdmin.roleId !== 1) {
        existingAdmin.roleId = 1;
        await userRepository.save(existingAdmin);
        console.log(`[SEED] Updated admin user role`);
      }
    }

    console.log('[SEED] Database seed completed successfully!');
  } catch (error) {
    console.error('[SEED] Error:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
