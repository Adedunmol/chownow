import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateRestaurantDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'bites' })
    restaurant_name: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minUppercase: 1 })
    @ApiProperty({ default: 'Password@1234' })
    password: string;
}
