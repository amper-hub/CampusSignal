import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IssuesModule } from './issues/issues.module';
import { VotesModule } from './votes/votes.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // serve UI from the public/ folder
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/**'],
    }),

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
          type: 'sqlite',
          database: 'campussignal.db',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // don't enable in production!
        };
      },
      inject: [ConfigService],
    }),
    // application feature modules
    AuthModule,
    UsersModule,
    IssuesModule,
    VotesModule,
    SuggestionsModule,
    UploadsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
