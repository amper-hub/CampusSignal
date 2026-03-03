import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // globally load environment variables from `.env`
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // configure TypeORM using async factory so we can pull from ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // validate presence of required vars to avoid obscure runtime errors
        const host = configService.get<string>('DB_HOST');
        const port = parseInt(configService.get<string>('DB_PORT') ?? '3306', 10);
        const username = configService.get<string>('DB_USER');
        const password = configService.get<string>('DB_PASS');
        const database = configService.get<string>('DB_NAME');
        if (!host || !username || password === undefined || !database) {
          throw new Error(
            'Database configuration incomplete; please set DB_HOST, DB_USER, DB_PASS and DB_NAME in .env',
          );
        }
        return {
          type: 'mysql',
          host,
          port,
          username,
          password: password || '',
          database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // don't enable in production!
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
