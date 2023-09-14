import { IsString, IsStrongPassword, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'Montag' })
    username: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'Montag' })
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'Guy' })
    last_name: string;
    
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minUppercase: 1 })
    @ApiProperty({ default: 'Password@1234', minimum: 6 })
    password: string;
}