import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomerAuthGuard extends AuthGuard('CustomerStrategy') {}

@Injectable()
export class RestaurantAuthGuard extends AuthGuard('RestaurantStrategy') {}

@Injectable()
export class DriverAuthGuard extends AuthGuard('DriverStrategy') {}