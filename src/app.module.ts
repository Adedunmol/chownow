import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: configService.get('DATABASE_USERNAME'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_NAME'),
      entities,
      synchronize: true
    }),
    inject: [ConfigService]
  }), CustomersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
