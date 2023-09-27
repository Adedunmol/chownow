import { forwardRef, Module } from '@nestjs/common';
import { CustomersModule } from '../customers/customers.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerStrategy } from './customer.strategy';
import { RestaurantStrategy } from './restaurant.strategy';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';

@Module({
  imports: [forwardRef(() => CustomersModule), forwardRef(() => RestaurantsModule), PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: '30m' }
    }),
    inject: [ConfigService]
  })],
  providers: [AuthService, JwtStrategy, CustomerStrategy, RestaurantStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
