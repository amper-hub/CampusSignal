import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  // Ensure baseline roles exist.
  const roleRepo = dataSource.getRepository(Role);
  let userRole = await roleRepo.findOne({ where: { name: 'user' } });
  if (!userRole) {
    userRole = await roleRepo.save({ name: 'user' });
  }
  let adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    adminRole = await roleRepo.save({ name: 'admin' });
  }

  // Reset users and seed required default admin.
  const userRepo = dataSource.getRepository(User);
  await userRepo
    .createQueryBuilder()
    .delete()
    .from(User)
    .where('1=1')
    .execute();
  const adminPassword = await bcrypt.hash('Admin123', 10);
  await userRepo.save(
    userRepo.create({
      email: 'admin@gmail.com',
      password: adminPassword,
      roleId: adminRole.id,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
