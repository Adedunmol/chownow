import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';

export class UpdateRestaurantAdminDto extends PartialType(OmitType(CreateRestaurantDto, ['password'] as const)) {}
export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
