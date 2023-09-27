import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRestaurantDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'bites' })
    restaurant_name: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'Password@1234', minimum: 6 })
    password: string;
}
