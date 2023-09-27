import { IsString, IsStrongPassword, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'test' })
    username: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'test' })
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