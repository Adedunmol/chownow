import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRestaurantDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'bites' })
    restaurant_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'password' })
    password: string;
}
