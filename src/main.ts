import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
=======
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  // Ensure baseline role IDs exist: 1 = admin, 2 = user.
  const roleRepo = dataSource.getRepository(Role);
  await roleRepo.query(
    "INSERT IGNORE INTO `role` (`id`, `name`) VALUES (1, 'admin')",
  );
  await roleRepo.query(
    "INSERT IGNORE INTO `role` (`id`, `name`) VALUES (2, 'user')",
  );

  // Seed or fix the required default admin.
  const userRepo = dataSource.getRepository(User);
  const adminEmail = 'admin@gmail.com';
  const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });
  if (existingAdmin) {
    if (existingAdmin.roleId !== 1) {
      existingAdmin.roleId = 1;
      await userRepo.save(existingAdmin);
    }
  } else {
    const adminPassword = await bcrypt.hash('Admin123', 10);
    await userRepo.save(userRepo.create({
      email: 'admin@gmail.com',
      password: adminPassword,
      roleId: 1,
    }));
  }

>>>>>>> docs/specs
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
