import { forwardRef, Module } from '@nestjs/common';
import { RestaurantsService } from './services/restaurants.service';
import { RestaurantsController } from './controllers/restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem, Restaurant } from '../typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, MenuItem]), forwardRef(() => AuthModule)],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
