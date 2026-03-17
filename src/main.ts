import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  // Seed default role
  const roleRepo = dataSource.getRepository(Role);
  const existing = await roleRepo.findOne({ where: { name: 'user' } });
  if (!existing) {
    await roleRepo.save({ name: 'user' });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
